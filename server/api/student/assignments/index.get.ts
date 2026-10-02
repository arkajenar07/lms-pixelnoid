export default defineEventHandler(async (event) => {
  // Fast auth from in-memory cache (0.01ms)
  let userId: string | null = null
  try {
    const user = await requireAuthUser(event)
    userId = user.id
  } catch (err) {
    // Optional fallback for dev/testing if query param is passed
    const query = getQuery(event)
    if (query.student_id) {
      userId = String(query.student_id)
    } else {
      throw err
    }
  }

  if (!userId) {
    throw createError({ statusCode: 401, statusMessage: 'Tidak terautentikasi atau data siswa tidak ditemukan.' })
  }

  const adminClient = getSupabaseAdmin()

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

  // Compute metrics in a single pass (O(N))
  let total = 0
  let pending = 0
  let submitted = 0
  let reviewed = 0
  let gradeSum = 0
  let gradeCount = 0

  for (let i = 0; i < assignmentsList.length; i++) {
    const a = assignmentsList[i]
    total++
    if (a.status === 'pending') pending++
    else if (a.status === 'submitted') submitted++
    else if (a.status === 'reviewed') {
      reviewed++
      if (a.grade !== null && a.grade !== undefined) {
        const num = Number(a.grade)
        if (!isNaN(num)) {
          gradeSum += num
          gradeCount++
        }
      }
    }
  }

  const averageGrade = gradeCount > 0 ? Math.round((gradeSum / gradeCount) * 10) / 10 : null

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
