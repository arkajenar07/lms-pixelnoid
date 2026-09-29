export const useUserProfile = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  const profile = useState<{
    id?: string
    fullname?: string
    username?: string
    roles?: string[]
    avatar_url?: string
  } | null>('user_profile_data', () => null)

  const fetchProfile = async () => {
    if (profile.value?.id) return profile.value

    let userId = user.value?.id
    if (!userId) {
      const { data: authData } = await supabase.auth.getUser()
      userId = authData?.user?.id
    }
    if (!userId) {
      const { data: sessionData } = await supabase.auth.getSession()
      userId = sessionData?.session?.user?.id
    }
    if (!userId) return null

    const { data, error } = await supabase
      .from('users')
      .select('id, fullname, username, roles, avatar_url')
      .eq('id', userId)
      .single()

    if (data && !error) {
      profile.value = data
      return data
    }
    return null
  }

  return { profile, fetchProfile }
}
