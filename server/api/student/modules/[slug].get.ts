import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const serviceRoleKey = config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabaseUrl = config.supabaseUrl || process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL || ''

  if (!serviceRoleKey || !supabaseUrl) {
    throw createError({ statusCode: 500, statusMessage: 'Konfigurasi server tidak lengkap.' })
  }

  // Verify auth
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Tidak terautentikasi.' })
  }
  const token = authHeader.replace('Bearer ', '')

  const anonKey = config.public?.supabaseKey || process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY || ''
  const anonClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } }
  })
  const { data: { user }, error: authError } = await anonClient.auth.getUser()
  if (authError || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Token tidak valid.' })
  }

  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Slug modul diperlukan.' })

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Get module + lessons
  const { data: mod, error: modErr } = await adminClient
    .from('class_modules')
    .select(`
      id, title, slug, description, thumbnail_url, xp_reward, estimated_minutes,
      sort_order, is_locked_default, is_published, class_id,
      module_lessons (
        id, title, slug, type, sort_order, video_url, xp_reward
      )
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (modErr || !mod) {
    throw createError({ statusCode: 404, statusMessage: 'Modul tidak ditemukan.' })
  }

  // Verify student is enrolled in the class
  const { data: membership } = await adminClient
    .from('class_member')
    .select('id')
    .eq('user_id', user.id)
    .eq('class_id', mod.class_id)
    .maybeSingle()

  if (!membership) {
    throw createError({ statusCode: 403, statusMessage: 'Kamu tidak terdaftar di kelas ini.' })
  }

  // Sort lessons by sort_order
  const lessons = [...(mod.module_lessons ?? [])].sort((a: any, b: any) => a.sort_order - b.sort_order)

  // Fetch user progress for these lessons
  const lessonIds = lessons.map((lesson: any) => lesson.id)
  const { data: progressRows, error: progressErr } = await adminClient
    .from('user_lesson_progress')
    .select('lesson_id, status')
    .eq('user_id', user.id)
    .in('lesson_id', lessonIds)

  if (progressErr) {
    console.error('[modules/[slug]] progressErr:', progressErr)
  }

  const progressMap = new Map<number, string>()
  for (const row of progressRows || []) {
    progressMap.set(row.lesson_id, row.status)
  }

  const lessonsWithStatus = lessons.map((lesson: any) => ({
    ...lesson,
    progress_status: progressMap.get(lesson.id) || 'not_started',
  }))

  return { module: { ...mod, module_lessons: lessonsWithStatus } }
})
