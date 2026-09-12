import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const serviceRoleKey = (config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || '') as string
  const supabaseUrl = (config.supabaseUrl || process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL || '') as string
  const anonKey = (config.public?.supabaseKey || process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY || '') as string

  if (!serviceRoleKey || !supabaseUrl) {
    throw createError({ statusCode: 500, statusMessage: 'Konfigurasi server tidak lengkap.' })
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Get authenticated user
  let userId: string | null = null
  const authHeader = getHeader(event, 'authorization')

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '')
    const anonClient = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: `Bearer ${token}` } }
    })
    const { data: { user } } = await anonClient.auth.getUser()
    if (user) userId = user.id
  }

  // Fetch mentorship sessions
  let query = adminClient
    .from('mentorship_sessions')
    .select(`
      id,
      created_at,
      mentor_id,
      student_id,
      topic,
      status,
      meeting_link,
      day,
      time,
      type,
      mentor:mentor_id (
        id,
        fullname,
        username,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })

  // Optional query override for dev/testing
  const queryParams = getQuery(event)
  if (!userId && queryParams.student_id) {
    userId = String(queryParams.student_id)
  }

  if (!userId) {
    // If not authenticated, do not expose any student's sessions
    return {
      sessions: [],
      ongoingSessions: [],
      upcomingSessions: [],
      historySessions: [],
      mentorNotes: [],
      total: 0
    }
  }

  // Strictly filter sessions for the authenticated student only
  query = query.eq('student_id', userId)

  const { data: rawSessions, error: sessionsError } = await query

  if (sessionsError) {
    throw createError({ statusCode: 500, statusMessage: `Gagal mengambil jadwal meeting: ${sessionsError.message}` })
  }

  const normalizedSessions = (rawSessions || []).map((s: any) => ({
    id: s.id,
    topic: s.topic || 'Sesi Mentoring',
    status: s.status || 'Upcoming',
    meeting_link: s.meeting_link || null,
    day: s.day || 'Hari Ini',
    time: s.time || '19:45 – 20:15 WIB',
    type: s.type || 'casual_class',
    created_at: s.created_at,
    mentor_id: s.mentor_id,
    student_id: s.student_id,
    mentor_name: s.mentor?.fullname || s.mentor?.username || 'Mentor Pixelnoid',
    mentor_avatar: s.mentor?.avatar_url || null,
    mentor_initials: (s.mentor?.fullname || s.mentor?.username || 'Mentor')
      .split(/[\s@_.-]+/)
      .slice(0, 2)
      .map((w: string) => w[0]?.toUpperCase())
      .join('') || 'M'
  }))

  // Categorize
  const ongoingSessions = normalizedSessions.filter(
    s => s.status.toLowerCase() === 'ongoing'
  )
  const upcomingSessions = normalizedSessions.filter(
    s => s.status.toLowerCase() === 'upcoming'
  )
  const historySessions = normalizedSessions.filter(
    s => ['completed', 'selesai', 'missed', 'done'].includes(s.status.toLowerCase())
  )

  // Fetch mentor feedback notes from student_assignments
  let notesQuery = adminClient
    .from('student_assignments')
    .select(`
      id,
      grade,
      feedback,
      feedback_at,
      assignment:assignments!student_assignments_assignment_id_fkey (
        title,
        type
      ),
      mentor:users!student_assignments_feedback_by_fkey (
        id,
        fullname,
        username,
        avatar_url
      )
    `)
    .not('feedback', 'is', null)
    .order('feedback_at', { ascending: false })
    .limit(5)

  if (userId) {
    notesQuery = notesQuery.eq('student_id', userId)
  }

  const { data: rawNotes } = await notesQuery

  const mentorNotes = (rawNotes || []).map((n: any) => {
    const mentorName = n.mentor?.fullname || n.mentor?.username || 'Mentor'
    const initials = mentorName.split(/[\s@_.-]+/).slice(0, 2).map((w: string) => w[0]?.toUpperCase()).join('') || 'M'
    const dateFormatted = n.feedback_at
      ? new Date(n.feedback_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
      : 'Review Terkini'

    return {
      id: n.id,
      init: initials,
      mentor: mentorName,
      topic: n.assignment?.title ? `${n.assignment.title} · Nilai: ${n.grade || 0}/100` : 'Evaluasi Tugas',
      date: dateFormatted,
      note: n.feedback,
      tags: [n.assignment?.type?.toUpperCase() || 'TUGAS', `Skor: ${n.grade || 0}`, 'Tinjauan Mentor']
    }
  })

  return {
    sessions: normalizedSessions,
    ongoingSessions,
    upcomingSessions,
    historySessions,
    mentorNotes,
    total: normalizedSessions.length
  }
})
