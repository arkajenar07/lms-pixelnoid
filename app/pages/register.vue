<template>
  <div class="auth-page">
    <!-- Ambient background glow effects -->
    <div class="bg-ambients" aria-hidden="true">
      <div class="ambient ambient-tl"></div>
      <div class="ambient ambient-tr"></div>
      <div class="ambient ambient-bl"></div>
    </div>

    <!-- Subtle dot/grid pattern overlay -->
    <div class="bg-grid" aria-hidden="true"></div>

    <div class="auth-layout">

      <!-- ══════════════ RIGHT / FORM SIDE (first on mobile) ══════════════ -->
      <main class="auth-form-side">
        <div class="form-wrapper">

          <!-- Mobile logo -->
          <NuxtLink to="/" class="mobile-logo">
            <img :src="logo" alt="Carriera" class="mobile-logo-img" />
          </NuxtLink>

          <div class="form-header">
            <h1 class="form-title">Buat Akunmu</h1>
            <p class="form-subtitle">
              Sudah punya akun?
              <NuxtLink to="/login" class="form-link">Masuk di sini →</NuxtLink>
            </p>
          </div>

          <form class="auth-form" @submit.prevent="handleRegister" novalidate>

            <!-- Row: Nama Depan + Nama Belakang -->
            <div class="fields-row">
              <div class="field-group" :class="{ 'has-error': errors.firstName }">
                <label for="firstName" class="field-label">Nama Depan</label>
                <div class="input-wrap">
                  <UserIcon class="input-icon" />
                  <input
                    id="firstName"
                    v-model="form.firstName"
                    type="text"
                    class="field-input"
                    placeholder="Andi"
                    autocomplete="given-name"
                  />
                </div>
                <span v-if="errors.firstName" class="field-error">{{ errors.firstName }}</span>
              </div>

              <div class="field-group" :class="{ 'has-error': errors.lastName }">
                <label for="lastName" class="field-label">Nama Belakang</label>
                <div class="input-wrap">
                  <UserIcon class="input-icon" />
                  <input
                    id="lastName"
                    v-model="form.lastName"
                    type="text"
                    class="field-input"
                    placeholder="Julianto"
                    autocomplete="family-name"
                  />
                </div>
                <span v-if="errors.lastName" class="field-error">{{ errors.lastName }}</span>
              </div>
            </div>

            <!-- Username -->
            <div class="field-group" :class="{ 'has-error': errors.username }">
              <label for="username" class="field-label">Username</label>
              <div class="input-wrap">
                <AtSymbolIcon class="input-icon" />
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  class="field-input"
                  placeholder="julianto123"
                  autocomplete="username"
                />
              </div>
              <span v-if="errors.username" class="field-error">{{ errors.username }}</span>
            </div>

            <!-- Email -->
            <div class="field-group" :class="{ 'has-error': errors.email }">
              <label for="email" class="field-label">Email</label>
              <div class="input-wrap">
                <EnvelopeIcon class="input-icon" />
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="field-input"
                  placeholder="nama@email.com"
                  autocomplete="email"
                />
              </div>
              <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
            </div>

            <!-- Password -->
            <div class="field-group" :class="{ 'has-error': errors.password }">
              <label for="password" class="field-label">Password</label>
              <div class="input-wrap">
                <LockClosedIcon class="input-icon" />
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="field-input"
                  placeholder="Min. 8 karakter"
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  class="toggle-pw"
                  @click="showPassword = !showPassword"
                  :aria-label="showPassword ? 'Sembunyikan password' : 'Tampilkan password'"
                >
                  <EyeSlashIcon v-if="!showPassword" />
                  <EyeIcon v-else />
                </button>
              </div>
              <!-- Password strength indicator -->
              <div class="pw-strength" v-if="form.password">
                <div class="pw-bars">
                  <div
                    v-for="n in 4"
                    :key="n"
                    class="pw-bar"
                    :class="{ active: passwordStrength >= n, [`level-${passwordStrength}`]: passwordStrength >= n }"
                  ></div>
                </div>
                <span class="pw-label">{{ passwordStrengthLabel }}</span>
              </div>
              <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
            </div>

            <!-- Confirm Password -->
            <div class="field-group" :class="{ 'has-error': errors.confirmPassword }">
              <label for="confirmPassword" class="field-label">Konfirmasi Password</label>
              <div class="input-wrap">
                <ShieldCheckIcon class="input-icon" />
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  :type="showConfirm ? 'text' : 'password'"
                  class="field-input"
                  placeholder="Ulangi password"
                  autocomplete="new-password"
                />
                <button
                  type="button"
                  class="toggle-pw"
                  @click="showConfirm = !showConfirm"
                  :aria-label="showConfirm ? 'Sembunyikan' : 'Tampilkan'"
                >
                  <EyeSlashIcon v-if="!showConfirm" />
                  <EyeIcon v-else />
                </button>
              </div>
              <span v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</span>
            </div>

            <!-- Terms -->
            <label class="terms-label" :class="{ 'has-error': errors.terms }">
              <input type="checkbox" v-model="form.terms" class="terms-check" />
              <span class="terms-custom"></span>
              <span>
                Saya setuju dengan
                <a href="#" class="form-link">Syarat &amp; Ketentuan</a>
                dan
                <a href="#" class="form-link">Kebijakan Privasi</a>
                Carriera.
              </span>
            </label>
            <span v-if="errors.terms" class="field-error" style="margin-top:-.5rem;">{{ errors.terms }}</span>

            <!-- Submit -->
            <button type="submit" class="btn-submit" :disabled="isLoading">
              <span v-if="!isLoading">
                Buat Akun
                <ArrowRightIcon class="btn-arrow" />
              </span>
              <span v-else class="loading-spinner"></span>
            </button>

            <!-- Divider -->
            <div class="divider"><span>atau</span></div>

            <!-- OAuth -->
            <button type="button" class="btn-oauth" @click="registerWithGoogle">
              <svg class="oauth-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"></path>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
              </svg>
              Daftar dengan Google
            </button>

          </form>
        </div>
      </main>

      <!-- ══════════════ LEFT PANEL (branding) ══════════════ -->
      <aside class="auth-panel" aria-hidden="true">
        <div class="panel-inner">

          <!-- Logo -->
          <div class="panel-logo">
            <NuxtLink to="/" class="logo-link">
              <img :src="logo" alt="Carriera Logo" class="logo-img" />
            </NuxtLink>
          </div>

          <!-- Headline -->
          <div class="panel-copy">
            <div class="badge">
              <span class="badge-dot"></span>
              Mulai Perjalananmu
            </div>
            <h2 class="panel-title">
              Bergabung dan<br />
              Bangun <em class="panel-accent">Portfolio Nyata.</em>
            </h2>
            <p class="panel-desc">
              Bukan sekadar belajar. Di Carriera kamu akan menghadapi simulasi kerja nyata,
              deadline yang ketat, dan review dari mentor berpengalaman — sehingga portofoliomu
              berbicara lebih keras dari sekadar ijazah.
            </p>
          </div>

          <!-- Stats cards -->
          <div class="stats-row">
            <div class="stat-card" v-for="stat in stats" :key="stat.label">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>

          <!-- Feature list -->
          <ul class="panel-features">
            <li v-for="feat in panelFeatures" :key="feat" class="panel-feature-item">
              <span class="feat-check">
                <CheckIcon />
              </span>
              {{ feat }}
            </li>
          </ul>

        </div>
      </aside>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { 
  UserIcon, 
  EnvelopeIcon, 
  AtSymbolIcon,
  LockClosedIcon, 
  EyeIcon, 
  EyeSlashIcon, 
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'
import logo from '~/assets/images/logo-pc.png'

useSeoMeta({
  title: 'Daftar — Carriera Course',
  description: 'Buat akun Carriera Course dan mulai perjalanan belajar coding dengan simulasi kerja nyata.'
})

definePageMeta({
  layout: false
})

const supabase = useSupabaseClient()

const showPassword = ref(false)
const showConfirm = ref(false)
const isLoading = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false
})

const errors = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: ''
})

/* ─── Password Strength ─── */
const passwordStrength = computed(() => {
  const p = form.password
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

const passwordStrengthLabel = computed(() => {
  return ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat'][passwordStrength.value] ?? ''
})

/* ─── Validate ─── */
const validate = () => {
  Object.keys(errors).forEach(k => (errors as any)[k] = '')
  let valid = true

  if (!form.firstName.trim()) { errors.firstName = 'Nama depan wajib diisi.'; valid = false }
  if (!form.lastName.trim())  { errors.lastName  = 'Nama belakang wajib diisi.'; valid = false }

  if (!form.username.trim()) {
    errors.username = 'Username wajib diisi.'; valid = false
  } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
    errors.username = 'Username hanya boleh berisi huruf, angka, dan underscore.'; valid = false
  }

  if (!form.email) {
    errors.email = 'Email wajib diisi.'; valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Format email tidak valid.'; valid = false
  }

  if (!form.password) {
    errors.password = 'Password wajib diisi.'; valid = false
  } else if (form.password.length < 8) {
    errors.password = 'Password minimal 8 karakter.'; valid = false
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Konfirmasi password wajib diisi.'; valid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Password tidak cocok.'; valid = false
  }

  if (!form.terms) {
    errors.terms = 'Kamu harus menyetujui syarat & ketentuan.'; valid = false
  }

  return valid
}

const handleRegister = async () => {
  if (!validate()) return
  isLoading.value = true
  
  const fullName = `${form.firstName} ${form.lastName}`.trim()

  const { data, error } = await supabase.auth.signUp({
    email: form.email,
    password: form.password,
    options: {
      data: {
        role: ['student'],
        full_name: fullName,
        name: fullName,
        display_name: fullName,
        username: form.username
      }
    }
  })

  if (error) {
    alert(error.message || 'Gagal mendaftar')
    isLoading.value = false
    return
  }

  if (data.user) {
    const { error: dbError } = await supabase.from('users').insert({
      id: data.user.id,
      fullname: fullName,
      username: form.username,
      roles: ['student']
    } as any)
    
    if (dbError) {
      console.error('Failed to create public user profile', dbError)
      alert(`Gagal menyimpan profil: ${dbError.message}`)
      isLoading.value = false
      return
    }
  }

  // Redirect to dashboard
  await navigateTo('/student')
  isLoading.value = false
}

const registerWithGoogle = () => {
  // TODO: implement Google OAuth
}

const stats = [
  { value: '1.2k+', label: 'Siswa Aktif' },
  { value: '48+',   label: 'Project Nyata' },
  { value: '94%',   label: 'Alumni Puas'  }
]

const panelFeatures = [
  'Simulasi kerja nyata dengan standar industri',
  'Mentor berpengalaman yang memberikan code review',
  'Portfolio siap pakai setelah selesai program',
  'Akses komunitas alumni selamanya'
]
</script>

<style scoped>
/* ═══════════════════════ BASE PAGE ═══════════════════════ */
.auth-page {
  position: relative;
  min-height: 100vh;
  background-color: #FAFAFA;
  font-family: 'Instrument Sans', 'Inter', 'Raleway', sans-serif;
  -webkit-font-smoothing: antialiased;
  overflow: hidden;
}

/* ═══════════════════════ AMBIENTS ═══════════════════════ */
.bg-ambients { pointer-events: none; position: fixed; inset: 0; z-index: 0; overflow: hidden; }
.ambient { position: absolute; border-radius: 50%; filter: blur(100px); }
.ambient-tl { top: -10%; left: -8%; width: 50%; height: 50%; background: radial-gradient(circle, rgba(99,88,245,.09), transparent 70%); }
.ambient-tr { top: 10%; right: -5%; width: 30%; height: 30%; background: radial-gradient(circle, rgba(165,180,252,.06), transparent 70%); }
.ambient-bl { bottom: 0; left: 40%; width: 55%; height: 28%; background: radial-gradient(circle, rgba(99,88,245,.04), transparent 60%); }

/* ═══════════════════════ GRID ═══════════════════════ */
.bg-grid {
  pointer-events: none; position: fixed; inset: 0; z-index: 0;
  background-image: linear-gradient(to right, rgba(99,88,245,.06) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(99,88,245,.06) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
}

/* ═══════════════════════ LAYOUT ═══════════════════════ */
.auth-layout {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}
@media (max-width: 900px) {
  .auth-layout { grid-template-columns: 1fr; }
}

/* ═══════════════════════ FORM SIDE (left col) ═══════════════════════ */
.auth-form-side {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background: #FAFAFA;
  order: 1;
}
.form-wrapper {
  width: 100%;
  max-width: 440px;
}

.mobile-logo { display: none; }
@media (max-width: 900px) {
  .mobile-logo { display: block; margin-bottom: 2.5rem; }
  .mobile-logo-img { width: 120px; height: auto; }
}

.form-header { margin-bottom: 2rem; }
.form-title {
  font-size: clamp(1.625rem, 3vw, 2.25rem);
  font-weight: 600;
  letter-spacing: -.025em;
  color: #111827;
  margin-bottom: .5rem;
}
.form-subtitle { font-size: .9375rem; font-weight: 300; color: #6B7280; }
.form-link { color: #6458f5; font-weight: 600; text-decoration: none; transition: color .2s; }
.form-link:hover { color: #5448e0; }

/* ═══════════════════════ FORM ═══════════════════════ */
.auth-form { display: flex; flex-direction: column; gap: 1.125rem; }

.fields-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
@media (max-width: 480px) {
  .fields-row { grid-template-columns: 1fr; }
}

.field-group { display: flex; flex-direction: column; gap: .45rem; }

.field-label {
  font-size: .875rem;
  font-weight: 600;
  color: #374151;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.input-icon {
  position: absolute;
  left: 1rem;
  width: 17px; height: 17px;
  color: #9CA3AF;
  pointer-events: none;
  transition: color .2s;
}
.field-input {
  width: 100%;
  height: 50px;
  padding: 0 3rem 0 2.625rem;
  border-radius: 14px;
  border: 1.5px solid #E5E7EB;
  background: #FFFFFF;
  font-family: inherit;
  font-size: .9375rem;
  color: #111827;
  outline: none;
  transition: border-color .2s, box-shadow .2s;
}
.field-input::placeholder { color: #C4C8D0; }
.field-input:focus {
  border-color: #6458f5;
  box-shadow: 0 0 0 3px rgba(100,88,245,.1);
}
.input-wrap:focus-within .input-icon { color: #6458f5; }
.has-error .field-input { border-color: #F87171; }
.has-error .field-input:focus { box-shadow: 0 0 0 3px rgba(248,113,113,.12); }
.field-error { font-size: .8125rem; color: #DC2626; font-weight: 500; }

.toggle-pw {
  position: absolute; right: .875rem;
  background: none; border: none; cursor: pointer; padding: .25rem;
  color: #9CA3AF; transition: color .2s;
  display: flex; align-items: center;
}
.toggle-pw svg { width: 17px; height: 17px; }
.toggle-pw:hover { color: #6458f5; }

/* Password strength */
.pw-strength { display: flex; align-items: center; gap: .625rem; margin-top: .25rem; }
.pw-bars { display: flex; gap: 4px; }
.pw-bar {
  width: 36px; height: 4px;
  border-radius: 9999px;
  background: #E5E7EB;
  transition: background .3s;
}
.pw-bar.active.level-1 { background: #F87171; }
.pw-bar.active.level-2 { background: #FBBF24; }
.pw-bar.active.level-3 { background: #34D399; }
.pw-bar.active.level-4 { background: #10B981; }
.pw-label { font-size: .75rem; font-weight: 600; color: #6B7280; }

/* Terms */
.terms-label {
  display: flex;
  align-items: flex-start;
  gap: .625rem;
  font-size: .875rem;
  color: #4B5563;
  cursor: pointer;
  user-select: none;
  line-height: 1.5;
}
.terms-check { display: none; }
.terms-custom {
  width: 18px; height: 18px; min-width: 18px;
  border-radius: 5px; border: 1.5px solid #D1D5DB; background: #fff;
  flex-shrink: 0; transition: all .2s; position: relative; margin-top: 1px;
}
.terms-check:checked ~ .terms-custom {
  background: #6458f5; border-color: #6458f5;
}
.terms-check:checked ~ .terms-custom::after {
  content: '';
  position: absolute; top: 2px; left: 5px;
  width: 5px; height: 9px;
  border: 2px solid #fff; border-top: none; border-left: none;
  transform: rotate(45deg);
}
.terms-label.has-error .terms-custom { border-color: #F87171; }

/* Submit */
.btn-submit {
  width: 100%; height: 52px;
  border-radius: 14px; background: #6458f5; color: #fff;
  border: none; cursor: pointer; font-family: inherit; font-size: .9375rem; font-weight: 600;
  display: flex; align-items: center; justify-content: center; gap: .5rem;
  box-shadow: 0 10px 30px rgba(100,88,245,.3); transition: all .25s; margin-top: .125rem;
}
.btn-submit:hover:not(:disabled) {
  background: #5448e0; box-shadow: 0 16px 40px rgba(100,88,245,.4); transform: translateY(-1px);
}
.btn-submit:disabled { opacity: .6; cursor: not-allowed; }
.btn-arrow { width: 16px; height: 16px; transition: transform .2s; }
.btn-submit:hover .btn-arrow { transform: translateX(3px); }

.loading-spinner {
  width: 20px; height: 20px;
  border: 2.5px solid rgba(255,255,255,.35); border-top-color: #fff;
  border-radius: 50%; animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Divider */
.divider { position: relative; text-align: center; margin: .25rem 0; }
.divider::before { content: ''; position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #E5E7EB; }
.divider span { position: relative; background: #FAFAFA; padding: 0 1rem; font-size: .8125rem; color: #9CA3AF; }

/* OAuth */
.btn-oauth {
  width: 100%; height: 50px; border-radius: 14px; background: #fff;
  color: #374151; border: 1.5px solid #E5E7EB; cursor: pointer;
  font-family: inherit; font-size: .9375rem; font-weight: 500;
  display: flex; align-items: center; justify-content: center; gap: .75rem;
  transition: all .2s; box-shadow: 0 2px 8px rgba(0,0,0,.04);
}
.btn-oauth:hover {
  border-color: rgba(100,88,245,.3); box-shadow: 0 4px 16px rgba(0,0,0,.07); transform: translateY(-1px);
}
.oauth-icon { width: 20px; height: 20px; flex-shrink: 0; }

/* ═══════════════════════ RIGHT PANEL (branding) ═══════════════════════ */
.auth-panel {
  background: #0F172A;
  position: relative; overflow: hidden;
  padding: 3.5rem 3rem;
  display: flex; flex-direction: column;
  order: 2;
}
.auth-panel::before {
  content: '';
  position: absolute; top: 0; left: 0;
  width: 1px; height: 100%;
  background: linear-gradient(to bottom, transparent, rgba(99,88,245,.4) 40%, rgba(99,88,245,.4) 60%, transparent);
}
.auth-panel::after {
  content: '';
  position: absolute; top: -20%; right: -10%;
  width: 70%; height: 70%;
  background: radial-gradient(circle, rgba(99,88,245,.12), transparent 65%);
  pointer-events: none;
}

.panel-inner {
  display: flex; flex-direction: column;
  height: 100%; gap: 2.5rem;
  position: relative; z-index: 1;
}

.logo-link { display: inline-block; }
.logo-img { height: auto; width: 130px; object-fit: contain; filter: brightness(0) invert(1); opacity: .9; }

/* Badge */
.badge {
  display: inline-flex; align-items: center; gap: .5rem;
  padding: .375rem .875rem; border-radius: 9999px;
  border: 1px solid rgba(165,180,252,.25); background: rgba(99,88,245,.08);
  font-size: .7rem; font-weight: 600; letter-spacing: .07em;
  text-transform: uppercase; color: #A5B4FC; margin-bottom: 1.25rem;
}
.badge-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #818CF8;
  animation: pulse-dot 2s infinite;
}
@keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.5;transform:scale(.8);} }

.panel-copy { flex: 1; }
.panel-title {
  font-size: clamp(1.75rem, 2.5vw, 2.5rem);
  font-weight: 300; line-height: 1.2;
  letter-spacing: -.03em; color: #F9FAFB; margin-bottom: 1rem;
}
.panel-accent { font-style: italic; font-weight: 700; color: #818CF8; }
.panel-desc {
  font-size: .9375rem; font-weight: 300;
  line-height: 1.75; color: #6B7280; max-width: 380px;
}

/* Stats */
.stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.stat-card {
  background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.06);
  border-radius: 16px; padding: 1.25rem 1rem; text-align: center;
}
.stat-value {
  font-size: 1.5rem; font-weight: 700; letter-spacing: -.02em;
  background: linear-gradient(135deg, #818CF8, #C4B5FD);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  margin-bottom: .25rem;
}
.stat-label { font-size: .75rem; font-weight: 400; color: #6B7280; }

/* Feature list */
.panel-features { list-style: none; display: flex; flex-direction: column; gap: .875rem; }
.panel-feature-item {
  display: flex; align-items: flex-start; gap: .75rem;
  font-size: .9rem; font-weight: 300; line-height: 1.5; color: #D1D5DB;
}
.feat-check {
  width: 20px; height: 20px; border-radius: 50%;
  background: rgba(99,88,245,.2);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 1px;
}
.feat-check svg { width: 11px; height: 11px; color: #818CF8; }

@media (max-width: 900px) {
  .auth-panel { display: none; }
}
</style>