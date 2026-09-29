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
    // Get all modules and their lessons in this class
    const { data: modulesWithLessons, error: modErr } = await adminClient
      .from('class_modules')
      .select(`
        id, xp_reward,
        module_lessons ( id, xp_reward )
      `)
      .eq('class_id', classId)

    if (modErr || !modulesWithLessons || modulesWithLessons.length === 0) {
      return {
        success: true,
        progressPercentage: 0,
        totalXpEarned: 0,
        completedCount: 0,
        totalLessons: 0,
      }
    }

    // Extract all lessons and module mapping
    const lessons: { id: number; xp_reward: number | null; moduleId: number }[] = []
    const moduleMap = new Map<number, any>()
    const lessonsCountPerModule = new Map<number, number>()

    modulesWithLessons.forEach((m: any) => {
      moduleMap.set(m.id, m)
      const modLessons = m.module_lessons || []
      lessonsCountPerModule.set(m.id, modLessons.length)
      modLessons.forEach((l: any) => {
        lessons.push({
          id: l.id,
          xp_reward: l.xp_reward,
          moduleId: m.id
        })
      })
    })

    const totalLessons = lessons.length
    const lessonIds = lessons.map(l => l.id)

    // Get user's completed lessons ONLY for lessons in THIS class!
    let completedLessonIds = new Set<number>()
    if (lessonIds.length > 0) {
      const { data: completed } = await adminClient
        .from('user_lesson_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .in('lesson_id', lessonIds)

      completedLessonIds = new Set((completed || []).map((c: any) => c.lesson_id))
    }

    const completedCount = completedLessonIds.size

    // Calculate progress percentage
    const progressPercentage = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0

    // Calculate total XP earned: awarded directly per completed lesson
    let totalXpEarned = 0
    lessons.forEach((lesson) => {
      if (completedLessonIds.has(lesson.id)) {
        const lessonXp = Number(lesson.xp_reward || 0)
        if (lessonXp > 0) {
          totalXpEarned += lessonXp
        } else {
          const mod = moduleMap.get(lesson.moduleId)
          const modXp = Number(mod?.xp_reward || 0)
          const count = lessonsCountPerModule.get(lesson.moduleId) || 1
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
