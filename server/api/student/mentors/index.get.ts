import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const serviceRoleKey = (config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || '') as string
  const supabaseUrl = (config.supabaseUrl || process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL || '') as string

  if (!serviceRoleKey || !supabaseUrl) {
    throw createError({ statusCode: 500, statusMessage: 'Konfigurasi server tidak lengkap.' })
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Get current student user if available
  const authHeader = getHeader(event, 'authorization')
  let studentId: string | null = null

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '')
    const anonKey = (config.public?.supabaseKey || process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY || '') as string
    const anonClient = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: `Bearer ${token}` } }
    })
    const { data: { user } } = await anonClient.auth.getUser()
    if (user) studentId = user.id
  }

  // Fetch all mentors
  const { data: mentors, error: mentorErr } = await adminClient
    .from('users')
    .select('id, fullname, username, avatar_url, roles, created_at')
    .contains('roles', ['mentor'])

  if (mentorErr) {
    throw createError({ statusCode: 500, statusMessage: `Gagal mengambil daftar mentor: ${mentorErr.message}` })
  }

  // Fetch all reviewed assignments (and mentor feedbacks) for this student
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

  const { data: reviews } = await reviewsQuery.order('feedback_at', { ascending: false })

  const allReviews = reviews || []

  // Enhance mentors with review history
  const enrichedMentors = (mentors || []).map((m: any) => {
    const mentorReviews = allReviews.filter((r: any) => r.feedback_by === m.id)
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
