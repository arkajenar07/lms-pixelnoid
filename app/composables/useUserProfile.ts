export const useUserProfile = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  
  const profile = useState<{
    fullname?: string
    username?: string
    roles?: string[]
    avatar_url?: string
  } | null>('user_profile_data', () => null)

  const fetchProfile = async () => {
    if (!user.value) return
    if (profile.value) return // already fetched

    const { data, error } = await supabase
      .from('users')
      .select('fullname, username, roles, avatar_url')
      .eq('id', user.value.id)
      .single()

    if (data && !error) {
      profile.value = data
    }
  }

  return { profile, fetchProfile }
}
