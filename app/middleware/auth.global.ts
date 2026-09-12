/**
 * middleware/auth.global.ts
 *
 * Global route guard — runs on every navigation.
 *
 * Rules:
 *   - /login, /register, /forgot-password → selalu public
 *   - /student/* → membutuhkan user yang sudah login dengan role 'student'
 *   - Selain itu → public, tidak dijaga
 *
 * Urutan pengecekan (client):
 *   1. sessionStorage — cepat, handles post-login race condition
 *   2. useSupabaseUser() — fallback jika sessionStorage kosong
 *   3. DB query — fallback terakhir (F5 / SSR / tab baru)
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // Halaman publik — lewati semua pengecekan
  if (
    to.path === '/login' ||
    to.path === '/register' ||
    to.path === '/forgot-password'
  ) return

  // Hanya jaga route /student/*
  if (!to.path.startsWith('/student')) return

  // ── Client: cek sessionStorage DULU (sebelum Supabase state) ──
  // Ini penting untuk menghindari race condition setelah login:
  // loginForPortal() set sessionStorage sebelum navigateTo, tapi
  // useSupabaseUser() belum tentu terupdate saat middleware jalan.
  if (import.meta.client) {
    const storedPortal = sessionStorage.getItem('px_active_portal')
    if (storedPortal === 'student') return          // ✅ Langsung lolos
    if (storedPortal) {
      // Ada portal lain di sessionStorage — tolak akses
      return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
    }
    // sessionStorage kosong → lanjut cek Supabase user
  }

  // ── Cek Supabase auth state ──
  const supabaseUser = useSupabaseUser()

  if (!supabaseUser.value?.id) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  // ── Fallback: fetch role dari DB (SSR / F5 / tab baru) ──
  const supabase = useSupabaseClient()
  const { data } = await supabase
    .from('users')
    .select('roles')
    .eq('id', supabaseUser.value.id)
    .single()

  const userRoles: string[] = data
    ? (Array.isArray(data.roles) ? data.roles : (data.roles ? [data.roles] : []))
    : []

  if (!userRoles.includes('student')) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  // Simpan ke sessionStorage agar navigasi berikutnya lebih cepat
  if (import.meta.client) {
    sessionStorage.setItem('px_active_portal', 'student')
  }
})



