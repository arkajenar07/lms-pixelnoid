export default defineEventHandler(async (event) => {
  // ── Auth ──────────────────────────────────────────────────────
  const user = await requireAuthUser(event)

  // ── Parse multipart form ──────────────────────────────────────
  const parts = await readMultipartFormData(event)
  if (!parts || parts.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Tidak ada file yang diterima.' })
  }

  const filePart = parts.find(p => p.name === 'file')
  if (!filePart?.data) {
    throw createError({ statusCode: 400, statusMessage: 'File tidak valid.' })
  }

  const mimeType = filePart.type || 'image/jpeg'
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(mimeType)) {
    throw createError({ statusCode: 400, statusMessage: 'Format tidak didukung. Gunakan JPEG, PNG, atau WebP.' })
  }

  if (filePart.data.length > 5 * 1024 * 1024) {
    throw createError({ statusCode: 400, statusMessage: 'Ukuran file maksimal 5 MB.' })
  }

  // ── Upload ke Supabase Storage bucket 'avatars' ───────────────
  const adminClient = getSupabaseAdmin()
  const ext = mimeType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg'
  const filePath = `${user.id}/avatar.${ext}`

  const { error: uploadError } = await adminClient.storage
    .from('avatars')
    .upload(filePath, filePart.data, {
      contentType: mimeType,
      upsert: true,
    })

  if (uploadError) {
    throw createError({ statusCode: 500, statusMessage: `Gagal upload: ${uploadError.message}` })
  }

  // Public URL dengan cache-busting
  const { data: urlData } = adminClient.storage
    .from('avatars')
    .getPublicUrl(filePath)

  const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`

  // ── Update tabel 'users' (bukan profiles) ────────────────────
  const { error: updateError } = await adminClient
    .from('users')
    .update({ avatar_url: avatarUrl })
    .eq('id', user.id)

  if (updateError) {
    throw createError({ statusCode: 500, statusMessage: `Gagal update profil: ${updateError.message}` })
  }

  return { avatar_url: avatarUrl }
})
