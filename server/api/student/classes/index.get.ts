import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const serviceRoleKey = config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabaseUrl = config.supabaseUrl || process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL || ''

  if (!serviceRoleKey || !supabaseUrl) {
    throw createError({ statusCode: 500, statusMessage: 'Konfigurasi server tidak lengkap.' })
  }

  // Get authenticated user from Authorization header
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Tidak terautentikasi.' })
  }
  const token = authHeader.replace('Bearer ', '')

  // Verify user token
  const anonKey = config.public?.supabaseKey || process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY || ''
  const anonClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } }
  })

  const { data: { user }, error: authError } = await anonClient.auth.getUser()
  if (authError || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Token tidak valid.' })
  }

  // Use service role to query class_member
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const { data, error } = await adminClient
    .from('class_member')
    .select(`
      id, class_id,
      class ( id, name )
    `)
    .eq('user_id', user.id)
    .order('id', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Gagal mengambil kelas: ${error.message}` })
  }

  // Extract class info from class_member rows
  const classes = (data ?? []).map((m: any) => ({
    member_id: m.id,
    class_id: m.class_id,
    name: m.class?.name ?? 'Kelas Tidak Dikenal',
  }))

  return { classes }
})
