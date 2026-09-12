<template>
  <div class="min-h-screen bg-[#FAFAFA] font-['Instrument_Sans','Inter',sans-serif] relative overflow-hidden flex flex-col">
    <!-- Ambient background glow effects -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-[10%] -left-[8%] w-[50%] h-[50%] rounded-full bg-radial-gradient from-[#443E8D]/[0.04] to-transparent filter blur-[100px]"></div>
      <div class="absolute top-[10%] -right-[5%] w-[30%] h-[30%] rounded-full bg-radial-gradient from-[#A5B4FC]/[0.03] to-transparent filter blur-[100px]"></div>
      <div class="absolute bottom-0 left-[45%] w-[55%] h-[28%] rounded-full bg-radial-gradient from-[#443E8D]/[0.02] to-transparent filter blur-[100px]"></div>
    </div>

    <!-- Subtle dot/grid pattern overlay -->
    <div class="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#443E8D04_1px,transparent_1px),linear-gradient(to_bottom,#443E8D04_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_80%,transparent)]" aria-hidden="true"></div>

    <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      <!-- Left Panel (branding) - Hidden on mobile -->
      <aside class="hidden lg:flex bg-[#0F172A] relative overflow-hidden p-12 flex-col justify-between" aria-hidden="true">
        <!-- Decoration: Edge Glow -->
        <div class="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent"></div>
        <!-- Decoration: Center Glow -->
        <div class="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-radial-gradient from-[#443E8D]/20 to-transparent pointer-events-none"></div>

        <div class="relative z-10 flex flex-col gap-10 h-full">
          <!-- Logo -->
          <div class="panel-logo">
            <NuxtLink to="/" class="inline-block">
              <img :src="logo" alt="Pixelnoid Digital Academy Logo" class="w-[130px] h-auto object-contain brightness-0 invert opacity-90" />
            </NuxtLink>
          </div>

          <!-- Headline -->
          <div class="flex-1">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/15 bg-indigo-500/5 text-[0.7rem] font-bold tracking-widest uppercase text-indigo-300 mb-5">
              <span class="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
              Platform Belajar Masa Depan
            </div>
            <h2 class="text-4xl xl:text-5xl font-light leading-[1.2] tracking-tight text-gray-50 mb-4">
              Selamat Datang<br />
              Kembali di <em class="not-italic font-medium text-indigo-300">Pixelnoid Digital Academy.</em>
            </h2>
            <p class="text-[0.9375rem] font-light leading-relaxed text-gray-400 max-w-[380px]">
              Lanjutkan perjalanan belajarmu. Setiap sprint membawamu selangkah lebih dekat ke portofolio
              yang berbicara lebih keras dari ijazah.
            </p>
          </div>

          <!-- Decorative code snippet -->
          <div class="bg-black/30 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <div class="flex gap-1.5 px-4 pt-3 pb-2">
              <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            </div>
            <div class="px-5 pb-5 font-mono text-[0.8125rem] leading-loose">
              <div class="text-gray-400"><span class="text-purple-400">const</span> <span class="text-blue-400">user</span> = <span class="text-amber-400">'you'</span></div>
              <div class="text-gray-400"><span class="text-purple-400">await</span> <span class="text-emerald-400">login</span>(user)</div>
              <div class="text-gray-400"><span class="text-purple-400">return</span> <span class="text-amber-400">'welcome back 🚀'</span></div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Right Panel (form) -->
      <main class="flex items-center justify-center p-8 lg:p-12">
        <div class="w-full max-w-[420px]">
          <!-- Mobile logo -->
          <NuxtLink to="/" class="lg:hidden block mb-10">
            <img :src="logo" alt="Pixelnoid Digital Academy" class="w-[120px] h-auto" />
          </NuxtLink>

          <div class="mb-10">
            <h1 class="text-3xl lg:text-4xl font-light tracking-tight text-gray-900 mb-2">Masuk ke Akunmu</h1>
            <p class="text-[0.9375rem] font-light text-gray-500">
              Belum punya akun?
              <NuxtLink to="/register" class="text-[#443E8D] font-bold hover:text-[#312C6A] transition-colors">Daftar sekarang →</NuxtLink>
            </p>
          </div>

          <form class="flex flex-col gap-5" @submit.prevent="handleLogin" novalidate>
            <!-- Email -->
            <div class="flex flex-col gap-2">
              <label for="email" class="text-[0.875rem] font-bold text-gray-700">Email</label>
              <div class="relative flex items-center">
                <EnvelopeIcon class="absolute left-4 w-[18px] h-[18px] text-gray-400 pointer-events-none group-focus-within:text-[#443E8D] transition-colors" />
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="w-full h-[50px] pl-11 pr-4 rounded-2xl border-1.5 border-gray-200 bg-white font-inherit text-[0.9375rem] text-gray-900 outline-none focus:border-[#443E8D] focus:ring-4 focus:ring-[#443E8D]/5 transition-all placeholder:text-gray-300"
                  :class="{ 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/5': errors.email }"
                  placeholder="nama@email.com"
                  autocomplete="email"
                />
              </div>
              <span v-if="errors.email" class="text-[0.8125rem] text-rose-600 font-medium">{{ errors.email }}</span>
            </div>

            <!-- Password -->
            <div class="flex flex-col gap-2">
              <div class="flex justify-between items-center">
                <label for="password" class="text-[0.875rem] font-bold text-gray-700">Password</label>
                <NuxtLink to="/forgot-password" class="text-[0.8125rem] text-[#443E8D] hover:text-[#312C6A] transition-colors">Lupa password?</NuxtLink>
              </div>
              <div class="relative flex items-center">
                <LockClosedIcon class="absolute left-4 w-[18px] h-[18px] text-gray-400 pointer-events-none transition-colors" />
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full h-[50px] pl-11 pr-12 rounded-2xl border-1.5 border-gray-200 bg-white font-inherit text-[0.9375rem] text-gray-900 outline-none focus:border-[#443E8D] focus:ring-4 focus:ring-[#443E8D]/5 transition-all placeholder:text-gray-300"
                  :class="{ 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/5': errors.password }"
                  placeholder="Masukkan password"
                  autocomplete="current-password"
                />
                <button type="button" class="absolute right-4 p-1 text-gray-400 hover:text-[#443E8D] transition-colors" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'">
                  <EyeIcon v-if="!showPassword" class="w-[18px] h-[18px]" />
                  <EyeSlashIcon v-else class="w-[18px] h-[18px]" />
                </button>
              </div>
              <span v-if="errors.password" class="text-[0.8125rem] text-rose-600 font-medium">{{ errors.password }}</span>
            </div>

            <!-- Remember me -->
            <label class="flex items-center gap-2.5 text-[0.875rem] text-gray-600 cursor-pointer select-none group">
              <div class="relative w-[18px] h-[18px] rounded-lg border-1.5 border-gray-300 bg-white group-hover:border-[#443E8D]/50 transition-all flex items-center justify-center overflow-hidden">
                <input type="checkbox" v-model="form.remember" class="absolute inset-0 opacity-0 cursor-pointer z-10" />
                <div v-if="form.remember" class="w-full h-full bg-[#443E8D] flex items-center justify-center">
                  <CheckIcon class="w-3.5 h-3.5 text-white stroke-[3]" />
                </div>
              </div>
              Ingat saya di perangkat ini
            </label>

            <!-- Login error banner -->
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div v-if="loginError" class="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-[0.875rem] font-medium">
                <ExclamationCircleIcon class="w-4 h-4 text-rose-500 shrink-0" />
                {{ loginError }}
              </div>
            </Transition>

            <!-- Submit -->
            <button 
              type="submit" 
              class="group w-full h-[52px] rounded-full bg-[#443E8D] text-white font-bold text-[0.9375rem] flex items-center justify-center gap-2 hover:bg-[#312C6A] hover:shadow-xl hover:shadow-[#443E8D]/10 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-1" 
              :disabled="isLoading"
            >
              <template v-if="!isLoading">
                Masuk
                <ArrowRightIcon class="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </template>
              <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </button>

            <!-- Demo accounts hint -->
            <div class="flex flex-col">
              <button type="button" class="flex items-center justify-center gap-2 py-2.5 rounded-xl border-1.5 border-dashed border-gray-300 text-[0.8125rem] font-bold text-gray-500 hover:border-[#443E8D] hover:text-[#443E8D] transition-all" @click="showHint = !showHint">
                <InformationCircleIcon class="w-4 h-4 text-gray-400" />
                Demo accounts
                <ChevronDownIcon class="w-3.5 h-3.5 ml-auto transition-transform duration-300" :class="{ 'rotate-180': showHint }" />
              </button>
              
              <Transition
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-2 max-h-0"
                enter-to-class="opacity-100 translate-y-0 max-h-[400px]"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="opacity-100 translate-y-0 max-h-[400px]"
                leave-to-class="opacity-0 -translate-y-2 max-h-0"
              >
                <div v-if="showHint" class="mt-2 border-1.5 border-gray-200 rounded-2xl overflow-hidden bg-[#FAFAFA] shadow-sm">
                  <p class="text-[0.6875rem] text-gray-400 text-center py-2 font-bold uppercase tracking-widest bg-white border-b border-gray-100">Klik untuk isi otomatis</p>
                  <div class="flex flex-col">
                    <button
                      v-for="acc in demoAccounts"
                      :key="acc.role"
                      type="button"
                      class="flex items-center gap-3 p-3.5 text-left hover:bg-white transition-colors border-b border-gray-100 last:border-0 group/acc"
                      @click="fillDemo(acc)"
                    >
                      <span class="text-[0.625rem] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shrink-0 w-[64px] text-center" :style="{ background: acc.color + '18', color: acc.color }">{{ acc.role }}</span>
                      <div class="flex-1 min-w-0">
                        <code class="block text-[0.75rem] text-gray-700 font-mono truncate">{{ acc.email }}</code>
                        <code class="block text-[0.625rem] text-gray-400 font-mono">pw: {{ acc.password }}</code>
                      </div>
                      <ArrowRightIcon class="w-3.5 h-3.5 text-gray-300 group-hover/acc:text-[#443E8D] transition-all" />
                    </button>
                  </div>
                </div>
              </Transition>
            </div>

            <div class="relative text-center my-1">
              <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200"></div></div>
              <span class="relative bg-[#FAFAFA] px-4 text-[0.8125rem] text-gray-400">atau</span>
            </div>

            <!-- OAuth -->
            <button type="button" class="w-full h-[50px] rounded-full bg-white border-1.5 border-gray-200 text-gray-700 font-bold text-[0.9375rem] flex items-center justify-center gap-3 hover:border-[#443E8D]/30 hover:bg-[#443E8D]/[0.02] hover:shadow-lg hover:shadow-black/[0.03] transition-all" @click="loginWithGoogle">
              <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Lanjutkan dengan Google
            </button>
          </form>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import logo from '~/assets/images/logo-pc.png'
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  CheckIcon, 
  ExclamationCircleIcon,
  ArrowRightIcon,
  InformationCircleIcon,
  ChevronDownIcon
} from '@heroicons/vue/24/outline'

useSeoMeta({
  title: 'Masuk — Pixelnoid Digital Academy',
  description: 'Masuk ke akun Pixelnoid Digital Academy dan lanjutkan perjalanan belajar coding-mu.'
})

// 'role' middleware: redirect ke dashboard jika sudah login
definePageMeta({
  layout: false,
  middleware: ['role'],
})

const route = useRoute()
const supabase = useSupabaseClient()
const { loginForPortal } = usePortalAuth()

const showPassword  = ref(false)
const isLoading     = ref(false)
const loginError    = ref('')
const showHint      = ref(false)

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

const errors = reactive({
  email: '',
  password: '',
})

// ── Demo accounts hint ──────────────────────────────────────────
const demoAccounts = [
  { role: 'Student',  email: 'student@pixelnoid.dev', password: 'student123', color: '#443E8D' },
  { role: 'Mentor',   email: 'mentor@pixelnoid.dev',  password: 'mentor123',  color: '#10B981' },
  { role: 'Admin',    email: 'admin@pixelnoid.dev',   password: 'admin123',   color: '#F59E0B' },
]

function fillDemo(acc: typeof demoAccounts[0]) {
  form.email = acc.email
  form.password = acc.password
  errors.email = ''
  errors.password = ''
  loginError.value = ''
  showHint.value = false
}

// ── Validation ──────────────────────────────────────────────────
const validate = () => {
  errors.email = ''
  errors.password = ''
  let valid = true

  if (!form.email) {
    errors.email = 'Email wajib diisi.'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Format email tidak valid.'
    valid = false
  }

  if (!form.password) {
    errors.password = 'Password wajib diisi.'
    valid = false
  }

  return valid
}

// ── Login handler ───────────────────────────────────────────────
const handleLogin = async () => {
  if (!validate()) return

  isLoading.value  = true
  loginError.value = ''

  // loginForPortal: authenticates via Supabase, checks if they have either 'student' or 'mentor' role,
  // stores the matched role in sessionStorage as the active portal, returns error if role missing
  const result = await loginForPortal(form.email, form.password, ['student', 'mentor'])

  if (!result.success) {
    loginError.value = result.error || 'Login gagal.'
    isLoading.value  = false
    return
  }

  // Success → redirect to their respective dashboard based on the active portal assigned
  const { activePortal } = usePortalAuth()
  const defaultPath = activePortal.value === 'mentor' ? '/mentor' : '/student'
  
  const redirectTo = (route.query.redirect as string) || defaultPath
  await navigateTo(redirectTo)
}

const loginWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/student'
    }
  })
  if (error) {
    loginError.value = error.message
  }
}
</script>

<style>
/* Aesthetic patterns and glows are handled by Tailwind classes */
</style>
