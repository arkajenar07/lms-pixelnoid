import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const serviceRoleKey = (config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || '') as string
  const supabaseUrl = (config.supabaseUrl || process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL || '') as string
  const anonKey = (config.public?.supabaseKey || process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY || '') as string

  if (!serviceRoleKey || !supabaseUrl || !anonKey) {
    throw createError({ statusCode: 500, statusMessage: 'Konfigurasi server tidak lengkap.' })
  }

  // ── Auth: verifikasi Bearer token ──────────────────────────────
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Tidak terautentikasi.' })
  }
  const token = authHeader.replace('Bearer ', '').trim()

  const anonClient = createClient(supabaseUrl, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } }
  })

  const { data: { user }, error: authErr } = await anonClient.auth.getUser()
  if (authErr || !user) {
    throw createError({ statusCode: 401, statusMessage: 'Token tidak valid atau sesi berakhir.' })
  }

  // ── Admin client (service_role) ────────────────────────────────
  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // ── Parse body ─────────────────────────────────────────────────
  const body = await readBody(event)
  const { username, currentPassword, newPassword } = body as {
    username?: string
    currentPassword?: string
    newPassword?: string
  }

  const errors: string[] = []

  // ── 1. Update username di tabel users ─────────────────────────
  if (username !== undefined && username.trim() !== '') {
    const cleanUsername = username.trim().toLowerCase().replace(/\s+/g, '_')

    // Cek apakah username sudah dipakai user lain
    const { data: existing } = await adminClient
      .from('users')
      .select('id')
      .eq('username', cleanUsername)
      .neq('id', user.id)
      .maybeSingle()

    if (existing) {
      errors.push('Username sudah digunakan oleh pengguna lain.')
    } else {
      const { error: updateErr } = await adminClient
        .from('users')
        .update({ username: cleanUsername })
        .eq('id', user.id)

      if (updateErr) {
        errors.push('Gagal memperbarui username: ' + updateErr.message)
      }
    }
  }

  // ── 2. Update password ─────────────────────────────────────────
  if (newPassword && newPassword.trim() !== '') {
    if (!currentPassword || currentPassword.trim() === '') {
      errors.push('Password lama wajib diisi untuk mengubah password.')
    } else if (newPassword.length < 6) {
      errors.push('Password baru minimal 6 karakter.')
    } else {
      // Ambil email user via admin
      const { data: authUserData } = await adminClient.auth.admin.getUserById(user.id)
      const email = authUserData?.user?.email

      if (!email) {
        errors.push('Tidak dapat menemukan email pengguna.')
      } else {
        // Verifikasi password lama dengan sign-in
        const verifyClient = createClient(supabaseUrl, anonKey, {
          auth: { autoRefreshToken: false, persistSession: false }
        })
        const { error: signInErr } = await verifyClient.auth.signInWithPassword({
          email,
          password: currentPassword,
        })

        if (signInErr) {
          errors.push('Password lama tidak sesuai.')
        } else {
          // Update password via Admin API
          const { error: pwErr } = await adminClient.auth.admin.updateUserById(user.id, {
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
