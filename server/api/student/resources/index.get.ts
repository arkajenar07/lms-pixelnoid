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

  // Optional: class_id override from query
  const query = getQuery(event)
  const classIdFilter = query.class_id ? Number(query.class_id) : null

  // Step 1: Get enrolled class IDs for this student
  let enrolledClassIds: number[] = []

  if (userId) {
    const { data: memberships } = await adminClient
      .from('class_member')
      .select('class_id')
      .eq('user_id', userId)

    enrolledClassIds = (memberships || []).map((m: any) => m.class_id)
  } else {
    // Fallback: get all class IDs for testing
    const { data: allClasses } = await adminClient
      .from('class')
      .select('id')
    enrolledClassIds = (allClasses || []).map((c: any) => c.id)
  }

  // Step 2: Fetch enrolled classes metadata
  let classesQuery = adminClient
    .from('class')
    .select('id, name')

  if (enrolledClassIds.length > 0) {
    classesQuery = classesQuery.in('id', enrolledClassIds)
  }

  const { data: classes } = await classesQuery.order('name')

  // Step 3: Fetch resources accessible to this student:
  //   - class_id IS NULL (public/general resources)
  //   - OR class_id IN (enrolledClassIds)
  let resourcesQuery = adminClient
    .from('resources')
    .select(`
      id,
      class_id,
      title,
      description,
      type,
      url,
      created_at,
      class:class_id (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false })

  if (classIdFilter) {
    // If student requested a specific class, include that class + general resources (null class_id)
    resourcesQuery = resourcesQuery.or(`class_id.eq.${classIdFilter},class_id.is.null`)
  } else if (enrolledClassIds.length > 0) {
    // Resources for all enrolled classes OR general (null class_id)
    resourcesQuery = resourcesQuery.or(`class_id.is.null,class_id.in.(${enrolledClassIds.join(',')})`)
  } else {
    // Only general resources if not enrolled in any class
    resourcesQuery = resourcesQuery.is('class_id', null)
  }

  const { data: resources, error: resourcesError } = await resourcesQuery

  if (resourcesError) {
    throw createError({ statusCode: 500, statusMessage: `Gagal mengambil resource: ${resourcesError.message}` })
  }

  // Normalize resources: attach class_name
  const normalizedResources = (resources || []).map((r: any) => ({
    id: r.id,
    class_id: r.class_id,
    class_name: r.class?.name || null,
    title: r.title,
    description: r.description,
    type: r.type || 'other',
    url: r.url,
    created_at: r.created_at
  }))

  return {
    classes: classes || [],
    enrolledClassIds,
    resources: normalizedResources,
    total: normalizedResources.length
  }
})
