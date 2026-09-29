export default defineEventHandler(async (event) => {
  const client = getSupabaseAdmin()
  const idParam = getRouterParam(event, 'id')
  const id = Number(idParam)

  if (!id || isNaN(id)) {
    throw createError({ statusCode: 400, statusMessage: 'ID Absensi tidak valid.' })
  }

  // Hapus absensi (relasi di absensi_students otomatis terhapus karena ON DELETE CASCADE)
  const { error } = await client
    .from('absensi')
    .delete()
    .eq('id', id)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: `Gagal menghapus absensi: ${error.message}`
    })
  }

  return {
    success: true,
    message: 'Data absensi berhasil dihapus.'
  }
})
