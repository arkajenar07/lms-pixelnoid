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

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID lesson diperlukan.' })

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Fetch lesson with content
  const { data: lesson, error: lessonErr } = await adminClient
    .from('module_lessons')
    .select('id, title, slug, type, sort_order, video_url, xp_reward, content, class_modules ( id, class_id, title, slug )')
    .eq('id', id)
    .single()

  if (lessonErr || !lesson) {
    throw createError({ statusCode: 404, statusMessage: 'Lesson tidak ditemukan.' })
  }

  // Verify student is enrolled in the parent class
  const mod = (lesson as any).class_modules
  const classId = mod?.class_id
  if (classId) {
    const { data: membership } = await adminClient
      .from('class_member')
      .select('id')
      .eq('user_id', user.id)
      .eq('class_id', classId)
      .maybeSingle()

    if (!membership) {
      throw createError({ statusCode: 403, statusMessage: 'Kamu tidak terdaftar di kelas ini.' })
    }
  }

  // Fetch progress status dari user_lesson_progress
  const { data: progressRow } = await adminClient
    .from('user_lesson_progress')
    .select('status')
    .eq('lesson_id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  const progress_status = progressRow?.status === 'completed' ? 'completed' : 'not_complete'

  // Safely parse content if stored as JSON string in DB
  let parsedContent = lesson.content
  if (typeof parsedContent === 'string') {
    try {
      parsedContent = JSON.parse(parsedContent)
    } catch {
      // keep original
    }
  }

  return { lesson: { ...lesson, content: parsedContent, progress_status } }
})
