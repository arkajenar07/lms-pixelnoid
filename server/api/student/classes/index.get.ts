
export default defineEventHandler(async (event) => {
  const user = await requireAuthUser(event)
  const adminClient = getSupabaseAdmin()

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

  const classes = (data ?? []).map((m: any) => ({
    member_id: m.id,
    class_id: m.class_id,
    name: m.class?.name ?? 'Kelas Tidak Dikenal',
  }))

  return { classes }
})
