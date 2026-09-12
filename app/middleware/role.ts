/**
 * middleware/role.ts  (dipakai sebagai "guest" guard)
 * Jika sudah login, jangan bisa buka /login atau /register lagi.
 * Langsung redirect ke dashboard student.
 */
export default defineNuxtRouteMiddleware(async () => {
  const user = useSupabaseUser()

  if (!user.value?.id) return

  // Cek sessionStorage dulu (lebih cepat, hindari DB call)
  if (import.meta.client) {
    const stored = sessionStorage.getItem('px_active_portal')
    if (stored === 'student') return navigateTo('/student')
  }

  // Fallback ke DB — pastikan id valid sebelum query
  if (import.meta.client) {
    sessionStorage.setItem('px_active_portal', 'student')
  }

  return navigateTo('/student')
})

