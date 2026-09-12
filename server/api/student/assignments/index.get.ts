import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const serviceRoleKey = (config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || '') as string
  const supabaseUrl = (config.supabaseUrl || process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL || '') as string
  const anonKey = (config.public?.supabaseKey || process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY || '') as string

  if (!serviceRoleKey || !supabaseUrl) {
    throw createError({ statusCode: 500, statusMessage: 'Konfigurasi server tidak lengkap.' })
  }

  // Get authenticated user
  const authHeader = getHeader(event, 'authorization')
  let userId: string | null = null

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '')
    const anonClient = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: `Bearer ${token}` } }
    })
    const { data: { user } } = await anonClient.auth.getUser()
    if (user) {
      userId = user.id
    }
  }

  // Optional query override for dev/testing
  const query = getQuery(event)
  if (!userId && query.student_id) {
    userId = String(query.student_id)
  }

  // If still not found, fallback to the primary active student in database for development convenience
  if (!userId) {
    const fallbackClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })
    const { data: fallbackUser } = await fallbackClient
      .from('student_assignments')
      .select('student_id')
      .limit(1)
      .maybeSingle()

    if (fallbackUser?.student_id) {
      userId = fallbackUser.student_id
    }
  }

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Tidak terautentikasi atau data siswa tidak ditemukan.' })
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Fetch all assignments for this student
  const { data: studentAssignments, error } = await adminClient
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
      created_at,
      updated_at,
      assignments:assignment_id (
        id,
        title,
        description,
        type,
        link_url,
        due_date
      ),
      mentor:users!student_assignments_feedback_by_fkey (
        id,
        fullname,
        username,
        avatar_url
      )
    `)
    .eq('student_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Gagal mengambil tugas: ${error.message}` })
  }

  const assignmentsList = studentAssignments || []

  // Compute metrics
  const total = assignmentsList.length
  const pending = assignmentsList.filter(a => a.status === 'pending').length
  const submitted = assignmentsList.filter(a => a.status === 'submitted').length
  const reviewedList = assignmentsList.filter(a => a.status === 'reviewed')
  const reviewed = reviewedList.length

  const grades = reviewedList.map(a => Number(a.grade)).filter(g => !isNaN(g))
  const averageGrade = grades.length > 0
    ? Math.round((grades.reduce((acc, curr) => acc + curr, 0) / grades.length) * 10) / 10
    : null

  return {
    studentId: userId,
    metrics: {
      total,
      pending,
      submitted,
      reviewed,
      averageGrade
    },
    assignments: assignmentsList
  }
})
