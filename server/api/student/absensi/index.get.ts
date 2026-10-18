export default defineEventHandler(async (event) => {
  let userId: string | null = null
  try {
    const user = await requireAuthUser(event)
    userId = user.id
  } catch (err) {
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

  const client = getSupabaseAdmin()

  // 1. Ambil ID absensi yang diikuti oleh murid ini dari tabel relasi absensi_students
  const { data: studentAbsensiRows, error: studentRowsError } = await client
    .from('absensi_students')
    .select('absensi_id')
    .eq('student_id', userId)

  if (studentRowsError) {
    throw createError({
      statusCode: 500,
      statusMessage: `Gagal mengambil data absensi siswa: ${studentRowsError.message}`
    })
  }

  const myAbsensiIds = (studentAbsensiRows ?? []).map((r: any) => r.absensi_id)

  // Ambil data mentor agar siswa bisa memilih mentor di form tambah presensi
  const { data: mentorsData } = await client
    .from('users')
    .select('id, fullname, username, avatar_url, roles')
    .contains('roles', ['mentor'])
    .order('fullname', { ascending: true })

  const mentors = mentorsData ?? []

  // Jika murid ini belum memiliki presensi apa pun
  if (myAbsensiIds.length === 0) {
    return {
      absensi: [],
      mentors,
      students: []
    }
  }

  // 2. Query tabel absensi hanya untuk ID yang dimiliki murid ini
  const { data: absensiList, error: absensiError } = await client
    .from('absensi')
    .select('*')
    .in('id', myAbsensiIds)
    .order('session_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (absensiError) {
    throw createError({
      statusCode: 500,
      statusMessage: `Gagal mengambil data absensi: ${absensiError.message}`
    })
  }

  // 3. Ambil data murid yang hadir pada sesi absensi terkait
  const { data: allStudentRows } = await client
    .from('absensi_students')
    .select('absensi_id, student_id')
    .in('absensi_id', myAbsensiIds)

  const absensiStudentsMap = new Map<number, string[]>()
  const studentUserIds = new Set<string>()

  for (const row of allStudentRows ?? []) {
    const list = absensiStudentsMap.get(row.absensi_id) || []
    list.push(row.student_id)
    absensiStudentsMap.set(row.absensi_id, list)
    studentUserIds.add(String(row.student_id))
  }

  let studentUsers: any[] = []
  if (studentUserIds.size > 0) {
    const { data: sUsers } = await client
      .from('users')
      .select('id, fullname, username, avatar_url, roles')
      .in('id', Array.from(studentUserIds))
    studentUsers = sUsers ?? []
  }

  const userMap = new Map<string, any>()
  for (const m of mentors) userMap.set(String(m.id), m)
  for (const s of studentUsers) userMap.set(String(s.id), s)

  // 4. Format data absensi dengan objek mentor dan murid
  const mergedAbsensi = (absensiList ?? []).map((abs: any) => {
    const mentor = abs.mentor_id ? userMap.get(String(abs.mentor_id)) || null : null
    const studentIds = absensiStudentsMap.get(abs.id) || []
    const attendedStudents = studentIds
      .map(sId => userMap.get(String(sId)))
      .filter(Boolean)

    return {
      ...abs,
      mentor,
      students: attendedStudents,
      student_ids: studentIds
    }
  })

  return {
    absensi: mergedAbsensi,
    mentors,
    students: studentUsers
  }
})
