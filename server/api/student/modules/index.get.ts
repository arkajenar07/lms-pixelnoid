import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const serviceRoleKey = config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabaseUrl = config.supabaseUrl || process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL || ''

  if (!serviceRoleKey || !supabaseUrl) {
    throw createError({ statusCode: 500, statusMessage: 'Konfigurasi server tidak lengkap.' })
  }

  // Verify auth token
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

  const query = getQuery(event)
  const classId = query.class_id ? Number(query.class_id) : null
  if (!classId) {
    throw createError({ statusCode: 400, statusMessage: 'Parameter class_id wajib diisi.' })
  }

  // Check student is a member of this class
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const { data: membership } = await adminClient
    .from('class_member')
    .select('id')
    .eq('user_id', user.id)
    .eq('class_id', classId)
    .maybeSingle()

  if (!membership) {
    throw createError({ statusCode: 403, statusMessage: 'Kamu tidak terdaftar di kelas ini.' })
  }

  // Fetch published modules for this class
  const { data, error } = await adminClient
    .from('class_modules')
    .select(`
      id, title, slug, description, thumbnail_url, xp_reward,
      estimated_minutes, sort_order, is_locked_default, is_published, class_id,
      module_lessons ( id, title, slug, type, sort_order, xp_reward )
    `)
    .eq('class_id', classId)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('sort_order', { referencedTable: 'module_lessons', ascending: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Gagal mengambil modul: ${error.message}` })
  }

  // Fetch progress for all lessons in these modules
  const allLessonIds = (data ?? []).flatMap((m: any) => (m.module_lessons ?? []).map((l: any) => l.id))

  let completedLessonIds = new Set<number>()
  if (allLessonIds.length > 0) {
    const { data: progressRows } = await adminClient
      .from('user_lesson_progress')
      .select('lesson_id')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .in('lesson_id', allLessonIds)

    completedLessonIds = new Set((progressRows ?? []).map((p: any) => p.lesson_id))
  }

  const modulesWithProgress = (data ?? []).map((mod: any) => {
    const lessons = mod.module_lessons ?? []
    const totalCount = lessons.length
    const completedCount = lessons.filter((l: any) => completedLessonIds.has(l.id)).length
    const isCompleted = totalCount > 0 && completedCount === totalCount

    return {
      ...mod,
      total_lessons: totalCount,
      completed_lessons: completedCount,
      is_completed: isCompleted,
    }
  })

  return { modules: modulesWithProgress }
})
