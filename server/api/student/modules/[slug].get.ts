
export default defineEventHandler(async (event) => {
  const user = await requireAuthUser(event)

  const slug = getRouterParam(event, 'slug')
  if (!slug) throw createError({ statusCode: 400, statusMessage: 'Slug modul diperlukan.' })

  const adminClient = getSupabaseAdmin()

  // 1. Get module + lessons (including content so the first lesson loads instantly in 1 request)
  const { data: mod, error: modErr } = await adminClient
    .from('class_modules')
    .select(`
      id, title, slug, description, thumbnail_url, xp_reward, estimated_minutes,
      sort_order, is_locked_default, is_published, class_id,
      module_lessons (
        id, title, slug, type, sort_order, video_url, xp_reward, content
      )
    `)
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (modErr || !mod) {
    throw createError({ statusCode: 404, statusMessage: 'Modul tidak ditemukan.' })
  }

  const lessons = [...(mod.module_lessons ?? [])].sort((a: any, b: any) => a.sort_order - b.sort_order)
  const lessonIds = lessons.map((lesson: any) => lesson.id)

  // 2. Parallel verification: membership & user lesson progress
  const [membershipRes, progressRes] = await Promise.all([
    adminClient
      .from('class_member')
      .select('id')
      .eq('user_id', user.id)
      .eq('class_id', mod.class_id)
      .maybeSingle(),
    lessonIds.length > 0
      ? adminClient
          .from('user_lesson_progress')
          .select('lesson_id, status')
          .eq('user_id', user.id)
          .in('lesson_id', lessonIds)
      : Promise.resolve({ data: [] as any[] })
  ])

  if (!membershipRes.data) {
    throw createError({ statusCode: 403, statusMessage: 'Kamu tidak terdaftar di kelas ini.' })
  }

  const progressMap = new Map<number, string>()
  for (const row of progressRes.data || []) {
    progressMap.set(row.lesson_id, row.status)
  }

  // Separate lesson metadata (for the sidebar) and initial lesson detail
  const lessonsMeta = lessons.map((l: any) => {
    const { content, ...meta } = l
    return {
      ...meta,
      progress_status: progressMap.get(l.id) || 'not_started'
    }
  })

  // Pick initial lesson to display: first incomplete lesson or first lesson
  const activeLesson = lessons.find((l: any) => progressMap.get(l.id) !== 'completed') || lessons[0] || null
  let initialLesson: any = null
  if (activeLesson) {
    let parsedContent = activeLesson.content
    if (typeof parsedContent === 'string') {
      try { parsedContent = JSON.parse(parsedContent) } catch {}
    }
    initialLesson = {
      id: activeLesson.id,
      title: activeLesson.title,
      slug: activeLesson.slug,
      type: activeLesson.type,
      sort_order: activeLesson.sort_order,
      video_url: activeLesson.video_url,
      xp_reward: activeLesson.xp_reward,
      content: parsedContent,
      progress_status: progressMap.get(activeLesson.id) || 'not_started',
      class_modules: {
        id: mod.id,
        class_id: mod.class_id,
        title: mod.title,
        slug: mod.slug
      }
    }
  }

  return {
    module: {
      id: mod.id,
      title: mod.title,
      slug: mod.slug,
      description: mod.description,
      thumbnail_url: mod.thumbnail_url,
      xp_reward: mod.xp_reward,
      estimated_minutes: mod.estimated_minutes,
      sort_order: mod.sort_order,
      is_locked_default: mod.is_locked_default,
      is_published: mod.is_published,
      class_id: mod.class_id,
      module_lessons: lessonsMeta
    },
    initial_lesson: initialLesson
  }
})
