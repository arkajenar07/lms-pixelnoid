export default defineEventHandler(async (event) => {
  const client = getSupabaseAdmin()
  const body = await readBody(event)

  const {
    mentor_id,
    student_ids,
    session_date,
    session_time,
    topic,
    bukti_foto,
    status = 'pending',
    notes,
    approved_by,
  } = body ?? {}

  if (!mentor_id) {
    throw createError({ statusCode: 400, statusMessage: 'Mentor wajib dipilih.' })
  }

  if (!Array.isArray(student_ids) || student_ids.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Pilih minimal 1 murid yang hadir.' })
  }

  if (!session_date) {
    throw createError({ statusCode: 400, statusMessage: 'Tanggal sesi wajib diisi.' })
  }

  if (!session_time || !String(session_time).trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Jam sesi wajib diisi.' })
  }

  // 1. Simpan ke tabel absensi
  const absensiPayload: Record<string, any> = {
    mentor_id,
    session_date,
    session_time: String(session_time).trim(),
    topic: topic ? String(topic).trim() : null,
    bukti_foto: bukti_foto ? String(bukti_foto).trim() : null,
    status: status || 'pending',
    notes: notes ? String(notes).trim() : null,
  }

  if (status === 'approved') {
    absensiPayload.approved_at = new Date().toISOString()
    if (approved_by) absensiPayload.approved_by = approved_by
  }

  const { data: newAbsensi, error: absensiError } = await client
    .from('absensi')
    .insert(absensiPayload)
    .select()
    .single()

  if (absensiError) {
    throw createError({
      statusCode: 500,
      statusMessage: `Gagal menyimpan absensi: ${absensiError.message}`
    })
  }

  // 2. Simpan daftar murid ke tabel absensi_students
  const studentRows = student_ids.map((sId: string) => ({
    absensi_id: newAbsensi.id,
    student_id: sId
  }))

  const { error: studentError } = await client
    .from('absensi_students')
    .insert(studentRows)

  if (studentError) {
    console.error('Gagal memasukkan data absensi_students:', studentError.message)
    throw createError({
      statusCode: 500,
      statusMessage: `Absensi dibuat, namun gagal mengaitkan siswa: ${studentError.message}`
    })
  }

  return {
    success: true,
    message: 'Absensi berhasil ditambahkan!',
    absensi: newAbsensi
  }
})
