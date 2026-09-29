export default defineEventHandler(async () => {
  const client = getSupabaseAdmin()

  // 1. Ambil data absensi utama
  const { data: absensiList, error: absensiError } = await client
    .from('absensi')
    .select('*')
    .order('session_date', { ascending: false })
    .order('created_at', { ascending: false })

  if (absensiError) {
    throw createError({
      statusCode: 500,
      statusMessage: `Gagal mengambil data absensi: ${absensiError.message}`
    })
  }

  // 2. Ambil seluruh data absensi_students beserta student_id
  const absensiIds = (absensiList ?? []).map((a: any) => a.id)
  const absensiStudentsMap = new Map<number, string[]>()

  if (absensiIds.length > 0) {
    const { data: studentRows, error: studentRowsError } = await client
      .from('absensi_students')
      .select('absensi_id, student_id')
      .in('absensi_id', absensiIds)

    if (!studentRowsError && studentRows) {
      for (const row of studentRows) {
        const list = absensiStudentsMap.get(row.absensi_id) || []
        list.push(row.student_id)
        absensiStudentsMap.set(row.absensi_id, list)
      }
    }
  }

  // 3. Ambil data mentor dan student dari users
  const [mentorsResult, studentsResult] = await Promise.all([
    client
      .from('users')
      .select('id, fullname, username, avatar_url, roles')
      .contains('roles', ['mentor'])
      .order('fullname', { ascending: true }),
    client
      .from('users')
      .select('id, fullname, username, avatar_url, roles')
      .contains('roles', ['student'])
      .order('fullname', { ascending: true }),
  ])

  const mentors = mentorsResult.data ?? []
  const students = studentsResult.data ?? []

  const userMap = new Map<string, any>()
  for (const m of mentors) userMap.set(String(m.id), m)
  for (const s of students) userMap.set(String(s.id), s)

  // Fallback: jika ada mentor/student di data absensi yang belum ada di userMap, ambil dari database
  const missingUserIds = new Set<string>()
  for (const abs of absensiList ?? []) {
    if (abs.mentor_id && !userMap.has(String(abs.mentor_id))) {
      missingUserIds.add(String(abs.mentor_id))
    }
    const sIds = absensiStudentsMap.get(abs.id) || []
    for (const sId of sIds) {
      if (!userMap.has(String(sId))) {
        missingUserIds.add(String(sId))
      }
    }
  }

  if (missingUserIds.size > 0) {
    const { data: extraUsers } = await client
      .from('users')
      .select('id, fullname, username, avatar_url, roles')
      .in('id', Array.from(missingUserIds))

    if (extraUsers) {
      for (const u of extraUsers) {
        userMap.set(String(u.id), u)
      }
    }
  }

  // 4. Format data absensi dengan objek mentor dan list objek student
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
    students
  }
})
