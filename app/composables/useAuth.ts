/**
 * useAuth — Mock Authentication System (No DB required)
 *
 * Sistem auth simulasi berbasis localStorage + Nuxt useState.
 * Siap diganti Supabase/API nanti cukup swap bagian loginWithCredentials.
 *
 * Demo accounts:
 *   student@pixelnoid.dev  / student123   → role: student
 *   mentor@pixelnoid.dev   / mentor123    → role: mentor
 *   admin@pixelnoid.dev    / admin123     → role: admin
 */

// ── Types ─────────────────────────────────────────────────────────────
export type UserRole = 'student' | 'mentor' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string   // initials
  batch: string
  joinedAt: string
}

export interface LoginResult {
  success: boolean
  error?: string
}

// ── Mock user database ──────────────────────────────────────────────────
const MOCK_USERS: Array<AuthUser & { password: string }> = [
  {
    id: 'usr_001',
    name: 'Arka Jenar',
    email: 'student@pixelnoid.dev',
    password: 'student123',
    role: 'student',
    avatar: 'AJ',
    batch: 'Batch 13',
    joinedAt: '2026-01-10',
  },
  {
    id: 'usr_002',
    name: 'Yudha Pratama',
    email: 'mentor@pixelnoid.dev',
    password: 'mentor123',
    role: 'mentor',
    avatar: 'YP',
    batch: 'Staff',
    joinedAt: '2025-06-01',
  },
  {
    id: 'usr_003',
    name: 'Admin Pixelnoid Digital Academy',
    email: 'admin@pixelnoid.dev',
    password: 'admin123',
    role: 'admin',
    avatar: 'AD',
    batch: 'Staff',
    joinedAt: '2025-01-01',
  },
]

const STORAGE_KEY = 'Pixelnoid Digital Academy_auth_user'

// ── Composable ──────────────────────────────────────────────────────────
export const useAuth = () => {
  // Nuxt useState = SSR-safe global reactive state (shared across components)
  const user = useState<AuthUser | null>('auth_user', () => {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        return stored ? (JSON.parse(stored) as AuthUser) : null
      } catch {
        return null
      }
    }
    return null
  })

  // ── Computed helpers ─────────────────────────────────────────────
  const isLoggedIn = computed(() => !!user.value)
  const isStudent = computed(() => user.value?.role === 'student')
  const isMentor = computed(() => user.value?.role === 'mentor')
  const isAdmin = computed(() => user.value?.role === 'admin')

  // ── Login ────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<LoginResult> => {
    // Simulate network delay (remove for instant mock)
    await new Promise(r => setTimeout(r, 800))

    const found = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )

    if (!found) {
      return { success: false, error: 'Email atau password salah.' }
    }

    // Strip password before storing
    const { password: _pw, ...safeUser } = found
    user.value = safeUser

    if (import.meta.client) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser))
    }

    return { success: true }
  }

  // ── Logout ───────────────────────────────────────────────────────
  const logout = () => {
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem(STORAGE_KEY)
    }
    navigateTo('/login')
  }

  // ── Restore session from localStorage (call on app mount) ────────
  const restoreSession = () => {
    if (import.meta.client && !user.value) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) user.value = JSON.parse(stored) as AuthUser
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }

  // ── Role-based redirect helper ───────────────────────────────────
  const defaultRedirectForRole = (role: UserRole): string => {
    switch (role) {
      case 'student': return '/student/'
      case 'mentor': return '/mentor/'
      case 'admin': return '/admin/'
      default: return '/'
    }
  }

  return {
    user,
    isLoggedIn,
    isStudent,
    isMentor,
    isAdmin,
    login,
    logout,
    restoreSession,
    defaultRedirectForRole,
  }
}
