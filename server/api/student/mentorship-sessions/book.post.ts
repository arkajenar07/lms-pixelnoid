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
    if (user) userId = user.id
  }

  const body = await readBody(event)
  const { day, time, topics, notes, topic, mentorId } = body || {}

  if (!day) {
    throw createError({ statusCode: 400, statusMessage: 'Hari sesi wajib dipilih.' })
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Determine student_id: if not logged in, fallback to first available student
  if (!userId) {
    const { data: firstStudent } = await adminClient
      .from('users')
      .select('id')
      .contains('roles', ['student'])
      .limit(1)
      .single()

    userId = firstStudent?.id || null
  }

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'Student ID tidak ditemukan.' })
  }

  // Determine mentor_id
  let chosenMentorId = mentorId
  if (!chosenMentorId) {
    const { data: defaultMentor } = await adminClient
      .from('users')
      .select('id')
      .contains('roles', ['mentor'])
      .limit(1)
      .single()

    chosenMentorId = defaultMentor?.id || '74c66366-c928-49b4-b987-512a355b1e3e'
  }

  // Build topic string
  let finalTopic = topic
  if (!finalTopic) {
    const topicParts: string[] = []
    if (Array.isArray(topics) && topics.length > 0) {
      topicParts.push(topics.join(', '))
    }
    if (notes && typeof notes === 'string' && notes.trim()) {
      topicParts.push(notes.trim())
    }
    finalTopic = topicParts.length > 0 ? `Micro Session: ${topicParts.join(' - ')}` : 'Micro Session: Debug & Review Project'
  }

  const sessionData = {
    student_id: userId,
    mentor_id: chosenMentorId,
    topic: finalTopic,
    status: 'Upcoming',
    meeting_link: null,
    day: day,
    time: time || '19:45 – 20:15 WIB',
    type: 'casual_class'
  }

  const { data: inserted, error: insertError } = await adminClient
    .from('mentorship_sessions')
    .insert(sessionData)
    .select(`
      id,
      topic,
      status,
      day,
      time,
      type,
      mentor:mentor_id (
        id,
        fullname,
        username
      )
    `)
    .single()

  if (insertError) {
    throw createError({ statusCode: 500, statusMessage: `Gagal membuat jadwal booking: ${insertError.message}` })
  }

  return {
    success: true,
    message: 'Booking Micro Session berhasil dijadwalkan!',
    session: inserted
  }
})
