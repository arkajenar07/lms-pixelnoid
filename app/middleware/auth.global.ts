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

  // ── Client: cek sessionStorage / localStorage DULU (sebelum Supabase state) ──
  // Ini penting untuk menghindari race condition setelah login dan saat refresh:
  if (import.meta.client) {
    const storedPortal = sessionStorage.getItem('px_active_portal') || localStorage.getItem('px_active_portal')
    if (storedPortal === 'student') return          // ✅ Langsung lolos
    if (storedPortal && storedPortal !== 'student') {
      // Ada portal lain di storage — tolak akses
      return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
    }
  }

  // ── Cek Supabase auth state ──
  const supabase = useSupabaseClient()
  const supabaseUser = useSupabaseUser()

  let userId = (supabaseUser.value as any)?.id || (supabaseUser.value as any)?.sub || null

  // Jika belum terisi di reactive state (misal saat F5 / refresh halaman), ambil dari getSession
  if (!userId) {
    const { data: sessionData } = await supabase.auth.getSession()
    userId = sessionData?.session?.user?.id || null
  }

  // Fallback terakhir: getUser()
  if (!userId) {
    const { data: authData } = await supabase.auth.getUser()
    userId = authData?.user?.id || null
  }

  if (!userId) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  // ── Fallback: fetch role dari DB ──
  const { data } = await supabase
    .from('users')
    .select('roles')
    .eq('id', userId)
    .single()

  const userRoles: string[] = data
    ? (Array.isArray(data.roles) ? data.roles : (data.roles ? [data.roles] : []))
    : []

  if (!userRoles.includes('student')) {
    return navigateTo({ path: '/login', query: { redirect: to.fullPath } })
  }

  // Simpan ke sessionStorage & localStorage agar navigasi / refresh berikutnya langsung lolos
  if (import.meta.client) {
    sessionStorage.setItem('px_active_portal', 'student')
    localStorage.setItem('px_active_portal', 'student')
  }
})



