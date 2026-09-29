/**
 * middleware/role.ts  (dipakai sebagai "guest" guard)
 * Jika sudah login, jangan bisa buka /login atau /register lagi.
 * Langsung redirect ke dashboard student.
 */
export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  let userId = (user.value as any)?.id || (user.value as any)?.sub || null
  if (!userId) {
    const { data } = await supabase.auth.getSession()
    userId = data?.session?.user?.id || null
  }

  if (!userId) return

  // Cek storage dulu (lebih cepat, hindari DB call)
  if (import.meta.client) {
    const stored = sessionStorage.getItem('px_active_portal') || localStorage.getItem('px_active_portal')
    if (stored === 'student') return navigateTo('/student')
    sessionStorage.setItem('px_active_portal', 'student')
    localStorage.setItem('px_active_portal', 'student')
  }

  return navigateTo('/student')
})

