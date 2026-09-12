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

  const body = await readBody(event)
  const { studentAssignmentId, submissionUrl, submissionNotes, studentId } = body || {}

  if (!userId && studentId) {
    userId = String(studentId)
  }

  if (!studentAssignmentId) {
    throw createError({ statusCode: 400, statusMessage: 'studentAssignmentId diperlukan.' })
  }

  if (!submissionUrl || typeof submissionUrl !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'URL pengumpulan tugas wajib diisi.' })
  }

  const trimmedUrl = submissionUrl.trim()
  if (!/^https?:\/\/.+/i.test(trimmedUrl)) {
    throw createError({ statusCode: 400, statusMessage: 'Format URL tidak valid. Pastikan diawali dengan https://' })
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Verify target student_assignment exists
  const { data: existing, error: findError } = await adminClient
    .from('student_assignments')
    .select('id, student_id, status')
    .eq('id', studentAssignmentId)
    .single()

  if (findError || !existing) {
    throw createError({ statusCode: 404, statusMessage: 'Data tugas siswa tidak ditemukan.' })
  }

  // If userId is known, verify ownership
  if (userId && existing.student_id !== userId) {
    throw createError({ statusCode: 403, statusMessage: 'Kamu tidak memiliki akses ke tugas ini.' })
  }

  // Do not allow re-submission if already reviewed
  if (existing.status === 'reviewed') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tugas ini sudah dinilai dan ditutup oleh mentor, link tidak dapat diubah lagi.'
    })
  }

  const now = new Date().toISOString()

  // Update submission
  const { data: updated, error: updateError } = await adminClient
    .from('student_assignments')
    .update({
      submission_url: trimmedUrl,
      submission_notes: (submissionNotes || '').trim(),
      status: 'submitted',
      submitted_at: now,
      updated_at: now
    })
    .eq('id', studentAssignmentId)
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
      feedback_at
    `)
    .single()

  if (updateError) {
    throw createError({ statusCode: 500, statusMessage: `Gagal menyimpan pengumpulan tugas: ${updateError.message}` })
  }

  return {
    success: true,
    message: 'Tugas berhasil dikumpulkan!',
    data: updated
  }
})
