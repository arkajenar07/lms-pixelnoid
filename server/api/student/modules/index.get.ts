
export default defineEventHandler(async (event) => {
  const user = await requireAuthUser(event)

  const query = getQuery(event)
  const classId = query.class_id ? Number(query.class_id) : null
  if (!classId) {
    throw createError({ statusCode: 400, statusMessage: 'Parameter class_id wajib diisi.' })
  }

  const adminClient = getSupabaseAdmin()

  // 1. Fetch membership & modules in PARALLEL to reduce query latency by 50%
  const [membershipRes, modulesRes] = await Promise.all([
    adminClient
      .from('class_member')
      .select('id, progress_percentage, total_xp_earned')
      .eq('user_id', user.id)
      .eq('class_id', classId)
      .maybeSingle(),
    adminClient
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
  ])

  if (!membershipRes.data) {
    throw createError({ statusCode: 403, statusMessage: 'Kamu tidak terdaftar di kelas ini.' })
  }

  if (modulesRes.error) {
    throw createError({ statusCode: 500, statusMessage: `Gagal mengambil modul: ${modulesRes.error.message}` })
  }

  const modulesRaw = modulesRes.data ?? []

  // 2. Fetch progress for all lessons in these modules
  const allLessons: { id: number; xp_reward: number | null; moduleId: number }[] = []
  const allLessonIds: number[] = []

  for (const m of modulesRaw) {
    for (const l of (m.module_lessons ?? [])) {
      allLessonIds.push(l.id)
      allLessons.push({
        id: l.id,
        xp_reward: l.xp_reward,
        moduleId: m.id
      })
    }
  }

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

  // 3. Compute progress & XP directly on the server (eliminates extra POST class-progress)
  let calculatedXp = 0
  const modulesWithProgress = modulesRaw.map((mod: any) => {
    const lessons = mod.module_lessons ?? []
    const totalCount = lessons.length
    const completedCount = lessons.filter((l: any) => completedLessonIds.has(l.id)).length
    const isCompleted = totalCount > 0 && completedCount === totalCount

    const lessonsWithStatus = lessons.map((l: any) => {
      const isDone = completedLessonIds.has(l.id)
      if (isDone) {
        calculatedXp += Number(l.xp_reward || 0)
      }
      return {
        ...l,
        is_completed: isDone
      }
    })

    return {
      ...mod,
      module_lessons: lessonsWithStatus,
      total_lessons: totalCount,
      completed_lessons: completedCount,
      is_completed: isCompleted,
    }
  })

  const totalLessonsCount = allLessonIds.length
  const completedLessonsCount = completedLessonIds.size
  const progressPercentage = totalLessonsCount > 0
    ? Math.min(100, Math.round((completedLessonsCount / totalLessonsCount) * 100))
    : 0

  // Asynchronously update class_member in background without blocking response
  if (membershipRes.data) {
    adminClient
      .from('class_member')
      .update({
        progress_percentage: progressPercentage,
        total_xp_earned: calculatedXp
      })
      .eq('id', membershipRes.data.id)
      .then(() => {})
      .catch(() => {})
  }

  return {
    modules: modulesWithProgress,
    progressPercentage,
    totalXpEarned: calculatedXp
  }
})
