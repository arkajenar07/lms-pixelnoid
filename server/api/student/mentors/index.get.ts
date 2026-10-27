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

  // 1. Ambil daftar mentor dari database (vw_users atau public.users)
  let mentorsData: any[] = []

  const { data: vwData, error: vwError } = await adminClient
    .from('vw_users')
    .select('*')
    .contains('roles', ['mentor'])

  if (!vwError && vwData && vwData.length > 0) {
    mentorsData = vwData
  } else {
    const { data: usersData, error: usersError } = await adminClient
      .from('users')
      .select('*')
      .contains('roles', ['mentor'])

    if (usersError) {
      const { data: fallbackData } = await adminClient
        .from('users')
        .select('id, fullname, username, avatar_url, roles, created_at')
        .contains('roles', ['mentor'])
      mentorsData = fallbackData || []
    } else {
      mentorsData = usersData || []
    }
  }

  // Lengkapi email / whatsapp / pekerjaan / instansi jika belum tersinkronisasi di tabel users
  for (const m of mentorsData) {
    if (!m.email || !m.whatsapp || (!m.pekerjaan && !m.job) || (!m.instansi && !m.institution)) {
      try {
        const { data: authUser } = await adminClient.auth.admin.getUserById(m.id)
        if (authUser?.user) {
          if (!m.email && authUser.user.email) {
            m.email = authUser.user.email
          }
          if (!m.whatsapp) {
            m.whatsapp = authUser.user.user_metadata?.whatsapp ||
                         authUser.user.user_metadata?.phone ||
                         authUser.user.phone ||
                         null
          }
          if (!m.pekerjaan && !m.job) {
            m.pekerjaan = authUser.user.user_metadata?.pekerjaan ||
                          authUser.user.user_metadata?.job ||
                          authUser.user.user_metadata?.occupation ||
                          null
          }
          if (!m.instansi && !m.institution) {
            m.instansi = authUser.user.user_metadata?.instansi ||
                         authUser.user.user_metadata?.institution ||
                         authUser.user.user_metadata?.school ||
                         null
          }
        }
      } catch {
        // abaikan jika tidak ada di auth
      }
    }
  }

  // 2. Query student reviews untuk kalkulasi review count
  const allReviews = (await reviewsQuery.order('feedback_at', { ascending: false })).data || []

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

  // Enhance mentors with review history & db-driven contacts
  const enrichedMentors = mentorsData.map((m: any) => {
    const mentorReviews = reviewsByMentor.get(m.id) || []
    const rawWa = (m.whatsapp || '').toString().trim()
    const rawEmail = (m.email || '').toString().trim()
    const rawPekerjaan = (m.pekerjaan || m.job || '').toString().trim()
    const rawInstansi = (m.instansi || m.institution || '').toString().trim()

    let cleanWa = rawWa.replace(/[^\d+]/g, '').replace(/^\+/, '')
    if (cleanWa.startsWith('08')) cleanWa = '628' + cleanWa.slice(2)
    const contactWhatsApp = cleanWa ? `https://wa.me/${cleanWa}` : null
    const contactEmail = rawEmail ? `mailto:${rawEmail}` : null

    return {
      id: m.id,
      fullname: m.fullname || m.username || 'Mentor Pixelnoid',
      username: m.username,
      avatar_url: m.avatar_url,
      email: rawEmail || null,
      whatsapp: rawWa || null,
      pekerjaan: rawPekerjaan || (m.username === 'elang_saa' ? 'UI/UX Designer' : 'Software Engineer'),
      instansi: rawInstansi || 'Pixelnoid Studio',
      job: rawPekerjaan || null,
      institution: rawInstansi || null,
      roles: m.roles || ['mentor'],
      specialty: m.username === 'elang_saa' ? 'UI/UX & Product Design' : 'Fullstack Engineering & Code Architecture',
      bio: m.username === 'elang_saa'
        ? 'Senior UI/UX Designer berfokus pada design system, interaction design, dan wireframing.'
        : 'Tech Lead & Mentor Pixelnoid dengan pengalaman luas di modern web development dan arsitektur database.',
      contactWhatsApp,
      contactEmail,
      reviewCount: mentorReviews.length,
      reviews: mentorReviews
    }
  })

  return {
    mentors: enrichedMentors,
    allStudentReviews: allReviews
  }
})
