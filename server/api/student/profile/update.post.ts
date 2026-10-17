import { requireAuthUser } from '~/server/utils/auth'
import { getSupabaseAdmin } from '~/server/utils/supabaseAdmin'

export default defineEventHandler(async (event) => {
  // 1. Auth check
  const user = await requireAuthUser(event)

  // 2. Parse body
  const body = await readBody(event)
  const { username, currentPassword, newPassword } = body as {
    username?: string
    currentPassword?: string
    newPassword?: string
  }

  const admin = getSupabaseAdmin()
  const errors: string[] = []

  // 3. Update username di tabel users (jika diisi)
  if (username !== undefined && username.trim() !== '') {
    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '_')

    // Cek apakah username sudah dipakai user lain
    const { data: existing } = await admin
      .from('users')
      .select('id')
      .eq('username', cleanUsername)
      .neq('id', user.id)
      .maybeSingle()

    if (existing) {
      errors.push('Username sudah digunakan oleh pengguna lain.')
    } else {
      const { error: updateErr } = await admin
        .from('users')
        .update({ username: cleanUsername })
        .eq('id', user.id)

      if (updateErr) {
        errors.push('Gagal memperbarui username: ' + updateErr.message)
      }
    }
  }

  // 4. Update password (jika diisi)
  if (newPassword && newPassword.trim() !== '') {
    if (!currentPassword || currentPassword.trim() === '') {
      errors.push('Password lama wajib diisi untuk mengubah password.')
    } else if (newPassword.length < 6) {
      errors.push('Password baru minimal 6 karakter.')
    } else {
      // Verifikasi password lama dengan sign-in
      const config = useRuntimeConfig()
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = (config.supabaseUrl || process.env.SUPABASE_URL || '') as string
      const anonKey = (config.public?.supabaseKey || process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY || '') as string

      const tempClient = createClient(supabaseUrl, anonKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      })

      // Ambil email user dari auth
      const { data: authUser } = await admin.auth.admin.getUserById(user.id)
      const email = authUser?.user?.email

      if (!email) {
        errors.push('Tidak dapat menemukan email pengguna.')
      } else {
        const { error: signInErr } = await tempClient.auth.signInWithPassword({
          email,
          password: currentPassword,
        })

        if (signInErr) {
          errors.push('Password lama tidak sesuai.')
        } else {
          // Update password via Admin API
          const { error: pwErr } = await admin.auth.admin.updateUserById(user.id, {
            password: newPassword,
          })

          if (pwErr) {
            errors.push('Gagal memperbarui password: ' + pwErr.message)
          }
        }
      }
    }
  }

  if (errors.length > 0) {
    throw createError({ statusCode: 400, statusMessage: errors.join(' | ') })
  }

  return { success: true, message: 'Profil berhasil diperbarui.' }
})
