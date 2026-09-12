/**
 * usePortalAuth.ts
 *
 * Portal-aware authentication composable.
 * Tracks which login portal the user authenticated through (admin | student | mentor).
 *
 * sessionStorage key: 'px_active_portal'
 */

export type Portal = 'admin' | 'student' | 'mentor'

const PORTAL_STORAGE_KEY = 'px_active_portal'

/** Login page URL for each portal */
const PORTAL_LOGIN: Record<Portal, string> = {
  admin:   '/admin/login',
  student: '/login',
  mentor:  '/login',
}

/** Dashboard URL for each portal */
const PORTAL_DASHBOARD: Record<Portal, string> = {
  admin:   '/admin',
  student: '/student',
  mentor:  '/mentor',
}

export const usePortalAuth = () => {
  const supabase = useSupabaseClient()

  // Active portal state (reactive, read from sessionStorage)
  const activePortal = useState<Portal | null>('portal_auth_portal', () => {
    if (import.meta.client) {
      const stored = sessionStorage.getItem(PORTAL_STORAGE_KEY) as Portal | null
      if (stored && ['admin', 'student', 'mentor'].includes(stored)) return stored
    }
    return null
  })

  // Fetch user roles from the users table
  const fetchUserRoles = async (userId: string): Promise<string[]> => {
    const { data, error } = await supabase
      .from('users')
      .select('roles')
      .eq('id', userId)
      .single()

    if (error || !data) return []
    return Array.isArray(data.roles) ? data.roles : (data.roles ? [data.roles] : [])
  }

  /**
   * Authenticates a user for a specific portal.
   * - Signs in via Supabase Auth
   * - Verifies the user has the required role from the users table
   * - On success: stores activePortal in sessionStorage
   * - On role mismatch: signs out and returns an error
   */
  const loginForPortal = async (
    email: string,
    password: string,
    allowedRoles: Portal | Portal[]
  ): Promise<{ success: boolean; error?: string }> => {
    // Step 1: Supabase Auth sign-in
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error || !data.user) {
      return { success: false, error: error?.message || 'Login gagal. Periksa email dan password.' }
    }

    // Step 2: Fetch roles from custom users table
    const roles = await fetchUserRoles(data.user.id)

    if (roles.length === 0) {
      await supabase.auth.signOut()
      return { success: false, error: 'Akun tidak ditemukan di database. Hubungi administrator.' }
    }

    // Step 3: Enforce required role for this portal
    const rolesToCheck = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
    const hasRole = rolesToCheck.some(role => roles.includes(role))

    if (!hasRole) {
      await supabase.auth.signOut()
      return {
        success: false,
        error: `Akses ditolak. Role Anda: [${roles.join(', ')}]. Portal ini membutuhkan role: ${rolesToCheck.join(' atau ')}.`,
      }
    }

    // Determine which portal they should actually be assigned to.
    // If they have multiple of the allowed roles, we'll pick the first one they match.
    // E.g., if allowed is ['student', 'mentor'] and they are a 'mentor', they get assigned 'mentor'.
    const matchedPortal = rolesToCheck.find(role => roles.includes(role)) as Portal

    // Step 4: Store active portal in sessionStorage
    if (import.meta.client) {
      sessionStorage.setItem(PORTAL_STORAGE_KEY, matchedPortal)
    }
    activePortal.value = matchedPortal

    return { success: true }
  }

  /**
   * Signs out from Supabase, clears portal session,
   * and redirects to the login page of the CURRENT active portal.
   */
  const logoutFromPortal = async () => {
    const portal = activePortal.value

    if (import.meta.client) {
      sessionStorage.removeItem(PORTAL_STORAGE_KEY)
    }
    activePortal.value = null

    await supabase.auth.signOut()

    const loginPath = portal ? PORTAL_LOGIN[portal] : '/login'
    await navigateTo(loginPath)
  }

  const isAdminPortal   = computed(() => activePortal.value === 'admin')
  const isStudentPortal = computed(() => activePortal.value === 'student')
  const isMentorPortal  = computed(() => activePortal.value === 'mentor')

  const restorePortal = () => {
    if (import.meta.client && !activePortal.value) {
      const stored = sessionStorage.getItem(PORTAL_STORAGE_KEY) as Portal | null
      if (stored && ['admin', 'student', 'mentor'].includes(stored)) {
        activePortal.value = stored
      }
    }
  }

  return {
    activePortal,
    isAdminPortal,
    isStudentPortal,
    isMentorPortal,
    loginForPortal,
    logoutFromPortal,
    restorePortal,
    fetchUserRoles,
    PORTAL_LOGIN,
    PORTAL_DASHBOARD,
  }
}
