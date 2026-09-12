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
  const classId = body?.class_id

  if (!classId) {
    throw createError({ statusCode: 400, statusMessage: 'class_id diperlukan.' })
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

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

  try {
    // Get all modules in this class
    const { data: modules } = await adminClient
      .from('class_modules')
      .select('id, xp_reward')
      .eq('class_id', classId)

    if (!modules || modules.length === 0) {
      return {
        success: true,
        progressPercentage: 0,
        totalXpEarned: 0,
        completedCount: 0,
        totalLessons: 0,
      }
    }

    const moduleIds = modules.map((m: any) => m.id)
    const moduleMap = new Map(modules.map((m: any) => [m.id, m]))

    // Get all lessons in these modules
    const { data: allLessons } = await adminClient
      .from('module_lessons')
      .select('id, xp_reward, class_modules(id)')
      .in('class_modules.id', moduleIds)

    const lessons = (allLessons || []).filter((l: any) => {
      const moduleId = Array.isArray(l.class_modules) ? l.class_modules[0]?.id : l.class_modules?.id
      return moduleId && moduleIds.includes(moduleId)
    })

    const totalLessons = lessons.length

    // Get user's completed lessons
    const { data: completed } = await adminClient
      .from('user_lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('status', 'completed')

    const completedLessonIds = new Set((completed || []).map((c: any) => c.lesson_id))
    const completedCount = completedLessonIds.size

    // Calculate progress percentage
    const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

    // Count lessons per module for fallback proportional XP distribution
    const lessonsCountPerModule = new Map<number, number>()
    lessons.forEach((lesson: any) => {
      const moduleId = Array.isArray(lesson.class_modules) ? lesson.class_modules[0]?.id : lesson.class_modules?.id
      if (moduleId) {
        lessonsCountPerModule.set(moduleId, (lessonsCountPerModule.get(moduleId) || 0) + 1)
      }
    })

    // Calculate total XP earned: awarded directly per completed lesson
    let totalXpEarned = 0
    lessons.forEach((lesson: any) => {
      if (completedLessonIds.has(lesson.id)) {
        const lessonXp = Number(lesson.xp_reward || 0)
        if (lessonXp > 0) {
          totalXpEarned += lessonXp
        } else {
          const moduleId = Array.isArray(lesson.class_modules) ? lesson.class_modules[0]?.id : lesson.class_modules?.id
          const mod = moduleId ? moduleMap.get(moduleId) : null
          const modXp = Number(mod?.xp_reward || 0)
          const count = moduleId ? (lessonsCountPerModule.get(moduleId) || 1) : 1
          if (modXp > 0 && count > 0) {
            totalXpEarned += Math.round(modXp / count)
          }
        }
      }
    })

    console.log('[class-progress] Updating:', {
      userId: user.id,
      classId,
      progressPercentage,
      totalXpEarned,
      completedCount,
      totalLessons,
    })

    // Update class_member
    const { error: updateErr } = await adminClient
      .from('class_member')
      .update({
        progress_percentage: progressPercentage,
        total_xp_earned: totalXpEarned,
      })
      .eq('user_id', user.id)
      .eq('class_id', classId)

    if (updateErr) {
      console.error('[class-progress] Update error:', updateErr)
      throw updateErr
    }

    return {
      success: true,
      progressPercentage,
      totalXpEarned,
      completedCount,
      totalLessons,
    }
  } catch (err: any) {
    console.error('[class-progress] Error:', err)
    throw createError({ statusCode: 500, statusMessage: 'Gagal memperbarui progress: ' + err.message })
  }
})
