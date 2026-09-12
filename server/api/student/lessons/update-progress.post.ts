import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const serviceRoleKey = (config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || '') as string
  const supabaseUrl = (config.supabaseUrl || process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL || '') as string
  const anonKey = (config.public?.supabaseKey || process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY || '') as string

  if (!serviceRoleKey || !supabaseUrl || !anonKey) {
    throw createError({ statusCode: 500, statusMessage: 'Konfigurasi server tidak lengkap.' })
  }

  // Verify auth
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Tidak terautentikasi.' })
  }
  const token = authHeader.replace('Bearer ', '')

  const anonClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } }
  })
  const { data: { user }, error: authError } = await anonClient.auth.getUser()
  if (authError || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Token tidak valid.' })
  }

  const body = await readBody(event)
  const lessonId = body?.lesson_id
  const status = body?.status // 'completed' | 'not_complete'

  console.log('[update-progress] Request:', { lessonId, status, userId: user.id })

  if (!lessonId || !status) {
    throw createError({ statusCode: 400, statusMessage: 'lesson_id dan status diperlukan.' })
  }

  if (!['completed', 'not_complete'].includes(status)) {
    throw createError({ statusCode: 400, statusMessage: 'Status tidak valid. Gunakan: completed atau not_complete.' })
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Get lesson with related module (same pattern as [id].get.ts)
  const { data: lesson, error: lessonErr } = await adminClient
    .from('module_lessons')
    .select('id, class_modules(class_id)')
    .eq('id', lessonId)
    .maybeSingle()

  console.log('[update-progress] Lesson query:', { lessonId, error: lessonErr, lesson })

  if (lessonErr) {
    console.error('[update-progress] Query error:', lessonErr)
    throw createError({ statusCode: 500, statusMessage: 'Error querying lesson: ' + lessonErr.message })
  }

  if (!lesson) {
    console.error('[update-progress] Lesson not found for ID:', lessonId)
    throw createError({ statusCode: 404, statusMessage: 'Pelajaran tidak ditemukan.' })
  }

  const classId = (lesson as any).class_modules?.class_id
  if (!classId) {
    console.error('[update-progress] No class_id found in lesson data:', lesson)
    throw createError({ statusCode: 400, statusMessage: 'Class ID tidak ditemukan.' })
  }

  // Verify student is in this class
  const { data: membership } = await adminClient
    .from('class_member')
    .select('id')
    .eq('user_id', user.id)
    .eq('class_id', classId)
    .maybeSingle()

  if (!membership) {
    throw createError({ statusCode: 403, statusMessage: 'Kamu tidak terdaftar di kelas ini.' })
  }

  // Update or insert user_lesson_progress (using service role to bypass RLS)
  const now = new Date().toISOString()
  const updateData: any = { status }

  if (status === 'completed') {
    updateData.completed_at = now
  } else {
    updateData.completed_at = null
  }

  const { data: existing } = await adminClient
    .from('user_lesson_progress')
    .select('id')
    .eq('lesson_id', lessonId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing && existing.id) {
    await adminClient.from('user_lesson_progress').update(updateData).eq('id', existing.id)
  } else {
    await adminClient.from('user_lesson_progress').insert({
      lesson_id: lessonId,
      user_id: user.id,
      ...updateData
    })
  }

  // Update the student's last accessed lesson for this class
  const { error: lastAccessErr } = await adminClient
    .from('class_member')
    .update({ last_accessed_lesson_id: lessonId })
    .eq('user_id', user.id)
    .eq('class_id', classId)

  if (lastAccessErr) {
    console.error('[update-progress] last_accessed_lesson update error:', lastAccessErr)
  }

  // Recalculate class progress and total XP for this user in the class
  try {
    // Get modules for class
    const { data: modules, error: modulesErr } = await adminClient
      .from('class_modules')
      .select('id, xp_reward')
      .eq('class_id', classId)

    if (modulesErr) {
      console.error('[update-progress] modulesErr:', modulesErr)
    }

    const moduleIds = (modules || []).map((m: any) => m.id)
    const moduleMap = new Map((modules || []).map((m: any) => [m.id, m]))

    // Fetch lessons for these modules and compute rewards per module
    const { data: moduleLessons, error: moduleLessonsErr } = await adminClient
      .from('module_lessons')
      .select('id, xp_reward, class_modules(id)')
      .in('class_modules.id', moduleIds)

    if (moduleLessonsErr) {
      console.error('[update-progress] moduleLessonsErr:', moduleLessonsErr)
    }

    const lessons = moduleLessons || []
    const lessonIds = lessons.map((l: any) => l.id)
    const totalLessons = lessonIds.length

    // Get completed lessons for this user within these lessons
    const { data: completed, error: completedErr } = await adminClient
      .from('user_lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .in('lesson_id', lessonIds || [])

    if (completedErr) {
      console.error('[update-progress] completedErr:', completedErr)
    }

    const completedIds = new Set((completed || []).map((c: any) => c.lesson_id))
    const completedCount = completedIds.size

    const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

    // Count lessons per module for fallback proportional XP distribution
    const lessonsCountPerModule = new Map<number, number>()
    lessons.forEach((l: any) => {
      const mid = Array.isArray(l.class_modules) ? l.class_modules[0]?.id : l.class_modules?.id
      if (mid) {
        lessonsCountPerModule.set(mid, (lessonsCountPerModule.get(mid) || 0) + 1)
      }
    })

    // Calculate XP directly per completed lesson
    let totalXpEarned = 0
    for (const l of lessons) {
      if (completedIds.has(l.id)) {
        const lessonXp = Number(l.xp_reward || 0)
        if (lessonXp > 0) {
          totalXpEarned += lessonXp
        } else {
          const mid = Array.isArray(l.class_modules) ? l.class_modules[0]?.id : l.class_modules?.id
          const mod = mid ? moduleMap.get(mid) : null
          const modXp = Number(mod?.xp_reward || 0)
          const count = mid ? (lessonsCountPerModule.get(mid) || 1) : 1
          if (modXp > 0 && count > 0) {
            totalXpEarned += Math.round(modXp / count)
          }
        }
      }
    }

    // Update class_member summary
    const { error: updateErr } = await adminClient
      .from('class_member')
      .update({ progress_percentage: progressPercentage, total_xp_earned: totalXpEarned })
      .eq('user_id', user.id)
      .eq('class_id', classId)

    if (updateErr) {
      console.error('[update-progress] class_member update error:', updateErr)
    } else {
      console.log('[update-progress] class_member updated', { user: user.id, classId, progressPercentage, totalXpEarned, completedCount, totalLessons })
    }
  } catch (e) {
    console.error('[update-progress] recalc error:', e)
  }

  console.log(`[mark-progress] User ${user.id} marked lesson ${lessonId} as ${status}`)

  return { success: true, status }
})
