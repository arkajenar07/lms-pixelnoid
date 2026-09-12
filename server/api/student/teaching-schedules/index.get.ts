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

  return {
    schedules: schedules || [],
    userEmail,
    total: (schedules || []).length
  }
})
