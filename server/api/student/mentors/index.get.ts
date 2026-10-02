export default defineEventHandler(async (event) => {
  const adminClient = getSupabaseAdmin()

  // Get current student user if available (from cache or token)
  let studentId: string | null = null
  try {
    const user = await requireAuthUser(event)
    studentId = user.id
  } catch {
    // Optional fallback
  }

  // Fetch mentors and student reviews in PARALLEL
  let reviewsQuery = adminClient
    .from('student_assignments')
    .select(`
      id,
      assignment_id,
      student_id,
      status,
      submission_url,
      submission_notes,
      submitted_at,
      grade,
      feedback,
      feedback_by,
      feedback_at,
      assignments:assignment_id (
        id,
        title,
        type,
        due_date
      )
    `)
    .not('feedback', 'is', null)

  if (studentId) {
    reviewsQuery = reviewsQuery.eq('student_id', studentId)
  }

  const [mentorsRes, reviewsRes] = await Promise.all([
    adminClient
      .from('users')
      .select('id, fullname, username, avatar_url, roles, created_at')
      .contains('roles', ['mentor']),
    reviewsQuery.order('feedback_at', { ascending: false })
  ])

  if (mentorsRes.error) {
    throw createError({ statusCode: 500, statusMessage: `Gagal mengambil daftar mentor: ${mentorsRes.error.message}` })
  }

  const mentors = mentorsRes.data || []
  const allReviews = reviewsRes.data || []

  // Pre-index reviews by mentor for O(1) lookups
  const reviewsByMentor = new Map<string, any[]>()
  for (const r of allReviews) {
    if (r.feedback_by) {
      if (!reviewsByMentor.has(r.feedback_by)) {
        reviewsByMentor.set(r.feedback_by, [])
      }
      reviewsByMentor.get(r.feedback_by)!.push(r)
    }
  }

  // Enhance mentors with review history
  const enrichedMentors = mentors.map((m: any) => {
    const mentorReviews = reviewsByMentor.get(m.id) || []
    return {
      id: m.id,
      fullname: m.fullname || m.username || 'Mentor Pixelnoid',
      username: m.username,
      avatar_url: m.avatar_url,
      roles: m.roles || ['mentor'],
      specialty: m.username === 'elang_saa' ? 'UI/UX & Product Design' : 'Fullstack Engineering & Code Architecture',
      bio: m.username === 'elang_saa'
        ? 'Senior UI/UX Designer berfokus pada design system, interaction design, dan wireframing.'
        : 'Tech Lead & Mentor Pixelnoid dengan pengalaman luas di modern web development dan arsitektur database.',
      contactWhatsApp: 'https://wa.me/6281234567890',
      contactEmail: `mailto:${m.username || 'mentor'}@pixelnoid.dev`,
      reviewCount: mentorReviews.length,
      reviews: mentorReviews
    }
  })

  return {
    mentors: enrichedMentors,
    allStudentReviews: allReviews
  }
})
