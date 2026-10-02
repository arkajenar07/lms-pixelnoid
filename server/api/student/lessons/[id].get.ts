
export default defineEventHandler(async (event) => {
  const user = await requireAuthUser(event)

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID lesson diperlukan.' })

  const adminClient = getSupabaseAdmin()

  // 1. Fetch lesson with content and progress in parallel
  const [lessonRes, progressRes] = await Promise.all([
    adminClient
      .from('module_lessons')
      .select('id, title, slug, type, sort_order, video_url, xp_reward, content, class_modules ( id, class_id, title, slug )')
      .eq('id', id)
      .single(),
    adminClient
      .from('user_lesson_progress')
      .select('status')
      .eq('lesson_id', id)
      .eq('user_id', user.id)
      .maybeSingle()
  ])

  const lesson = lessonRes.data
  if (lessonRes.error || !lesson) {
    throw createError({ statusCode: 404, statusMessage: 'Lesson tidak ditemukan.' })
  }

  // 2. Verify student is enrolled in the parent class
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

  const progress_status = progressRes.data?.status === 'completed' ? 'completed' : 'not_complete'

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
