export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Pixelnoid Digital Academy',
      meta: [
        { name: 'description', content: 'Platform belajar online terbaik' }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Raleway:wght@100..900&display=swap'
        }
      ]
    }
  },

  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@nuxt/icon'],

  supabase: {
    redirect: false,
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8,
      sameSite: 'lax',
    }
  },

  // Private runtime config — hanya bisa diakses di server (tidak bocor ke browser)
  // WAJIB menggunakan service_role key (BUKAN anon key) untuk Admin API
  runtimeConfig: {
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
    // URL dibaca otomatis dari SUPABASE_URL (dipakai juga oleh @nuxtjs/supabase)
    supabaseUrl: process.env.SUPABASE_URL ?? '',
  }
})