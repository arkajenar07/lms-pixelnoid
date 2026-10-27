export const useUserProfile = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const CACHE_PROFILE_KEY = 'px_cached_user_profile'
  
  const profile = useState<{
    id?: string
    fullname?: string
    username?: string
    email?: string
    roles?: string[]
    avatar_url?: string
    whatsapp?: string
    pekerjaan?: string
    instansi?: string
  } | null>('user_profile_data', () => {
    if (import.meta.client) {
      try {
        const raw = sessionStorage.getItem(CACHE_PROFILE_KEY)
        if (raw) return JSON.parse(raw)
      } catch {}
    }
    return null
  })

  const isProfileLoading = useState<boolean>('user_profile_loading', () => false)

  const fetchProfile = async (force = false) => {
    if (!force && profile.value?.id) return profile.value

    isProfileLoading.value = true
    try {
      let authUser: any = user.value
      let userId = authUser?.id

      if (!userId) {
        const { data: authData } = await supabase.auth.getUser()
        if (authData?.user) {
          authUser = authData.user
          userId = authUser.id
        }
      }
      if (!userId) {
        const { data: sessionData } = await supabase.auth.getSession()
        if (sessionData?.session?.user) {
          authUser = sessionData.session.user
          userId = authUser.id
        }
      }
      if (!userId) return null

      // Coba query lengkap ke tabel users
      let { data, error } = await supabase
        .from('users')
        .select('id, fullname, username, email, roles, avatar_url, whatsapp, pekerjaan, instansi')
        .eq('id', userId)
        .maybeSingle()

      // Fallback jika ada kolom baru yang belum ada di schema DB
      if (error) {
        console.warn('Query full profile tabel users gagal, mencoba kolom dasar:', error.message)
        const fallbackRes = await supabase
          .from('users')
          .select('id, fullname, username, email, roles, avatar_url')
          .eq('id', userId)
          .maybeSingle()
        data = fallbackRes.data
      }

      // Gabungkan dengan metadata autentikasi Supabase agar nama & avatar selalu ada
      const meta = authUser?.user_metadata || {}
      const resolvedProfile = {
        id: userId,
        fullname:
          data?.fullname ||
          meta.fullname ||
          meta.full_name ||
          meta.name ||
          meta.display_name ||
          authUser?.email?.split('@')[0] ||
          'Siswa',
        username:
          data?.username ||
          meta.username ||
          authUser?.email?.split('@')[0] ||
          'siswa',
        email: data?.email || authUser?.email || '',
        roles: (Array.isArray(data?.roles) && data.roles.length > 0)
          ? data.roles
          : (Array.isArray(meta.role) ? meta.role : (meta.role ? [meta.role] : ['student'])),
        avatar_url: data?.avatar_url || meta.avatar_url || meta.picture || null,
        whatsapp: data?.whatsapp || meta.whatsapp || meta.phone || null,
        pekerjaan: data?.pekerjaan || meta.pekerjaan || meta.job || null,
        instansi: data?.instansi || meta.instansi || meta.institution || null,
      }

      profile.value = resolvedProfile
      if (import.meta.client) {
        try {
          sessionStorage.setItem(CACHE_PROFILE_KEY, JSON.stringify(resolvedProfile))
        } catch {}
      }

      return resolvedProfile
    } catch (err) {
      console.error('Error saat fetchProfile:', err)
      return null
    } finally {
      isProfileLoading.value = false
    }
  }

  return { profile, isProfileLoading, fetchProfile }
}
