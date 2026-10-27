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

  // Get authenticated user email
  let userEmail: string | null = null
  const authHeader = getHeader(event, 'authorization')

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.replace('Bearer ', '')
    const anonClient = createClient(supabaseUrl, anonKey, {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { Authorization: `Bearer ${token}` } }
    })
    const { data: { user } } = await anonClient.auth.getUser()
    if (user?.email) {
      userEmail = user.email.toLowerCase().trim()
    }
  }

  // Support query param override for testing
  const query = getQuery(event)
  if (query.email) {
    userEmail = String(query.email).toLowerCase().trim()
  }

  let schedules: any[] = []

  if (userEmail) {
    // 1. Primary: Match schedules where student_emails contains user's email
    const { data: studentRows, error: studentError } = await adminClient
      .from('teaching_schedules')
      .select('*')
      .contains('student_emails', [userEmail])
      .order('start_at', { ascending: true })

    if (studentError) {
      throw createError({ statusCode: 500, statusMessage: `Gagal mengambil jadwal: ${studentError.message}` })
    }

    schedules = studentRows || []
  } else {
    schedules = []
  }

  // 2. Join dengan public.users & auth.users untuk memetakan nama, avatar, whatsapp, dan instansi
  const allEmails = new Set<string>()
  for (const s of schedules) {
    if (s.mentor_email) allEmails.add(s.mentor_email.toLowerCase().trim())
    for (const se of (s.student_emails || [])) {
      if (se) allEmails.add(se.toLowerCase().trim())
    }
  }

  const userProfilesMap: Record<string, any> = {}

  if (allEmails.size > 0) {
    const emailList = Array.from(allEmails)

    // Ambil data dari tabel users
    const { data: userRows } = await adminClient
      .from('users')
      .select('id, email, fullname, username, avatar_url, roles, whatsapp, pekerjaan, instansi')

    if (userRows && userRows.length > 0) {
      for (const u of userRows) {
        if (u.email) {
          userProfilesMap[u.email.toLowerCase().trim()] = u
        }
        if (u.username) {
          userProfilesMap[u.username.toLowerCase().trim()] = u
        }
      }
    }

    // Periksa apakah masih ada email yang belum terpetakan langsung
    const missingEmails = emailList.filter(e => !userProfilesMap[e])
    if (missingEmails.length > 0) {
      try {
        const { data: authData } = await adminClient.auth.admin.listUsers({ perPage: 1000 })
        for (const aUser of authData?.users || []) {
          const aEmail = aUser.email?.toLowerCase().trim()
          if (aEmail && missingEmails.includes(aEmail)) {
            const matchedProfile = userRows?.find(r => r.id === aUser.id)
            userProfilesMap[aEmail] = {
              id: aUser.id,
              email: aEmail,
              fullname: matchedProfile?.fullname || aUser.user_metadata?.full_name || aUser.user_metadata?.name || aEmail.split('@')[0],
              username: matchedProfile?.username || aUser.user_metadata?.username || aEmail.split('@')[0],
              avatar_url: matchedProfile?.avatar_url || aUser.user_metadata?.avatar_url || null,
              whatsapp: matchedProfile?.whatsapp || aUser.user_metadata?.whatsapp || null,
              pekerjaan: matchedProfile?.pekerjaan || aUser.user_metadata?.pekerjaan || null,
              instansi: matchedProfile?.instansi || aUser.user_metadata?.instansi || null,
              roles: matchedProfile?.roles || aUser.user_metadata?.role || ['student']
            }
          }
        }
      } catch (err) {
        console.warn('Could not list auth users:', err)
      }
    }
  }

  // 3. Format jadwal dengan detail mentor dan student
  const enrichedSchedules = schedules.map(s => {
    const mentorEmailKey = (s.mentor_email || '').toLowerCase().trim()
    const mentorProfile = userProfilesMap[mentorEmailKey] || null

    const studentProfiles = (s.student_emails || []).map((se: string) => {
      const key = se.toLowerCase().trim()
      const p = userProfilesMap[key]
      return p ? {
        id: p.id,
        email: se,
        fullname: p.fullname,
        username: p.username,
        avatar_url: p.avatar_url,
        whatsapp: p.whatsapp,
        pekerjaan: p.pekerjaan,
        instansi: p.instansi
      } : {
        email: se,
        fullname: se.split('@')[0],
        username: se.split('@')[0]
      }
    })

    return {
      ...s,
      mentor: mentorProfile ? {
        id: mentorProfile.id,
        fullname: mentorProfile.fullname,
        username: mentorProfile.username,
        email: mentorProfile.email || s.mentor_email,
        avatar_url: mentorProfile.avatar_url,
        whatsapp: mentorProfile.whatsapp,
        pekerjaan: mentorProfile.pekerjaan,
        instansi: mentorProfile.instansi
      } : (s.mentor_email ? {
        fullname: s.mentor_email.split('@')[0],
        email: s.mentor_email
      } : null),
      students: studentProfiles
    }
  })

  return {
    schedules: enrichedSchedules,
    userProfiles: userProfilesMap,
    userEmail,
    total: enrichedSchedules.length
  }
})
