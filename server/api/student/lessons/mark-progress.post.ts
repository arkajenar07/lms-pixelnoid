import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const serviceRoleKey = (config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || '') as string
  const supabaseUrl = (config.supabaseUrl || process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL || '') as string

  if (!serviceRoleKey || !supabaseUrl) {
    throw createError({ statusCode: 500, statusMessage: 'Konfigurasi server tidak lengkap.' })
  }

  // Verify auth
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Tidak terautentikasi.' })
  }
  const token = authHeader.replace('Bearer ', '')

  const anonKey = (config.public?.supabaseKey || process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY || '') as string
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
  const classId = body?.class_id

  if (!lessonId || !classId) {
    throw createError({ statusCode: 400, statusMessage: 'lesson_id dan class_id diperlukan.' })
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

  // Get all modules for this class first
  const { data: modules, error: modulesErr } = await adminClient
    .from('class_modules')
    .select('id')
    .eq('class_id', classId)

  if (modulesErr || !modules || modules.length === 0) {
    console.error('[mark-progress] Failed to fetch modules:', modulesErr)
    throw createError({ statusCode: 500, statusMessage: 'Gagal mengambil data modul.' })
  }

  const moduleIds = modules.map((m: any) => m.id)
  console.log('[mark-progress] Found modules for class', classId, ':', moduleIds)

  // Now query module_lessons that belong to these modules
  // We'll use a different approach - just select all and filter
  const { data: allLessons, error: lessonsErr } = await adminClient
    .from('module_lessons')
    .select('id, xp_reward, class_modules(id)')

  if (lessonsErr) {
    console.error('[mark-progress] Failed to fetch lessons:', lessonsErr)
    throw createError({ statusCode: 500, statusMessage: 'Gagal mengambil data pelajaran.' })
  }

  // Filter lessons that belong to our modules
  const lessons = (allLessons || []).filter((l: any) => {
    const moduleId = l.class_modules?.id
    return moduleId && moduleIds.includes(moduleId)
  })

  console.log('[mark-progress] Filtered lessons:', lessons.map((l: any) => l.id))

  if (lessons.length === 0) {
    console.warn('[mark-progress] No lessons found for modules:', moduleIds)
    throw createError({ statusCode: 400, statusMessage: 'Tidak ada pelajaran di kelas ini.' })
  }

  const totalLessons = lessons.length
  const xpByLessonId = new Map(lessons.map((l: any) => [l.id, l.xp_reward || 0]))

  // Get user's completed lessons in this class
  const { data: completed, error: completedErr } = await adminClient
    .from('user_lesson_progress')
    .select('lesson_id')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .in('lesson_id', lessons.map((l: any) => l.id))

  if (completedErr) {
    throw createError({ statusCode: 500, statusMessage: 'Gagal mengambil progress data.' })
  }

  const completedCount = completed?.length ?? 0
  const completedLessonIds = new Set((completed ?? []).map((c: any) => c.lesson_id))

  // Calculate progress percentage
  const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  // Calculate total XP earned
  let totalXpEarned = 0
  completedLessonIds.forEach((lId) => {
    totalXpEarned += xpByLessonId.get(lId) || 0
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
    console.error('update class_member error:', updateErr)
    throw createError({ statusCode: 500, statusMessage: 'Gagal memperbarui progress.' })
  }

  return {
    success: true,
    progressPercentage,
    totalXpEarned,
    completedCount,
    totalLessons,
  }
})
