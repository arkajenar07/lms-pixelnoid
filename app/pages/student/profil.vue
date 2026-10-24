<template>
  <div
    class="flex min-h-screen bg-[#F7F7F9] text-[#111827] antialiased overflow-x-clip"
    style="font-family: 'Instrument Sans', Raleway, sans-serif"
  >
    <Sidebar :open="sidebarOpen" @update:open="sidebarOpen = $event" />

    <div class="relative z-[1] flex-1 w-full min-w-0 lg:ml-[210px]">
      <!-- Header -->
      <!-- Header -->
      <header class="sticky top-0 z-[100] flex w-full flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4 px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8 lg:py-5 bg-white/[0.92] backdrop-blur-[14px] [-webkit-backdrop-filter:blur(14px)] border-b border-[#E4E4E7]">
        <div class="mx-auto flex w-full max-w-3xl flex-col gap-1 min-w-0">
          <!-- Baris 1: Tombol menu di kiri, judul di sebelahnya -->
          <div class="flex items-center gap-3 min-w-0">
            <button
              class="inline-flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-[#E4E4E7] text-[#52525B] transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#CFCFE0] hover:text-[#443E8D] lg:hidden cursor-pointer"
              @click="sidebarOpen = !sidebarOpen"
              aria-label="Toggle sidebar"
            >
              <Bars3Icon class="w-5 h-5" />
            </button>
            <h1 class="text-[1.05rem] sm:text-[1.15rem] font-semibold leading-snug tracking-[-0.02em] text-[#18181B] truncate">
              Profil Saya
            </h1>
          </div>
          <!-- Baris 2: Deskripsi selebar layar -->
          <p class="text-[0.75rem] sm:text-[0.82rem] leading-relaxed text-[#71717A] w-full m-0">
            Kelola informasi akun dan keamanan
          </p>
        </div>
      </header>

      <!-- Main Content -->
      <main class="mx-auto flex w-full max-w-3xl flex-col gap-6 p-5 lg:p-8">

        <!-- Profile Overview Card -->
        <section class="rounded-2xl border border-[#E4E4E7] bg-white p-6 shadow-sm">
          <div class="flex items-center gap-5">
            <!-- Avatar dengan tombol upload -->
            <div class="relative shrink-0 group">
              <!-- Avatar container -->
              <div
                class="flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-br from-[#443E8D] to-indigo-500 text-white text-2xl font-black shadow-lg shadow-indigo-900/10 select-none"
              >
                <img
                  v-if="avatarPreview || profile?.avatar_url"
                  :src="avatarPreview || profile?.avatar_url"
                  class="w-full h-full object-cover"
                  alt="Foto Profil"
                />
                <span v-else>{{ userInitials }}</span>
              </div>

              <!-- Loading spinner overlay -->
              <div v-if="avatarUploading" class="absolute inset-0 rounded-2xl bg-black/50 flex items-center justify-center">
                <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>

              <!-- Camera button -->
              <button
                v-else
                type="button"
                @click="triggerAvatarInput"
                title="Ganti foto profil"
                class="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#443E8D] text-white flex items-center justify-center shadow-md border-2 border-white hover:bg-[#312C6A] transition-colors cursor-pointer"
              >
                <CameraIcon class="w-3 h-3" />
              </button>

              <!-- Hidden file input -->
              <input
                ref="avatarInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleAvatarFileSelected"
              />
            </div>

            <div class="min-w-0 flex-1">
              <p class="text-lg font-bold text-[#18181B] truncate">{{ userName }}</p>
              <p class="text-sm text-[#71717A] truncate mt-0.5">@{{ userUsername }}</p>
              <div class="flex items-center gap-2 flex-wrap mt-1.5">
                <span class="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-[#443E8D]">
                  <CheckBadgeIcon class="h-3.5 w-3.5" />
                  {{ userRole }}
                </span>
                <button
                  type="button"
                  @click="triggerAvatarInput"
                  class="text-[0.65rem] font-semibold text-[#71717A] hover:text-[#443E8D] transition-colors cursor-pointer underline underline-offset-2"
                >
                  Ganti Foto
                </button>
              </div>
              <!-- Upload error -->
              <p v-if="avatarError" class="mt-1 text-[0.65rem] text-rose-600 font-medium">{{ avatarError }}</p>
            </div>
          </div>
        </section>

        <!-- ============================================================ -->
        <!-- MODAL CROP FOTO PROFIL -->
        <!-- ============================================================ -->
        <Teleport to="body">
          <div
            v-if="cropModalOpen"
            class="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <div class="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#E4E4E7]">
              <!-- Header -->
              <div class="flex items-center justify-between px-5 py-4 border-b border-[#F4F4F5]">
                <div>
                  <h3 class="text-sm font-bold text-[#18181B]">Sesuaikan Foto Profil</h3>
                  <p class="text-[0.65rem] text-[#71717A] mt-0.5">Drag untuk geser · Scroll untuk zoom</p>
                </div>
                <button @click="closeCropModal" class="p-1.5 rounded-xl text-[#71717A] hover:bg-[#F4F4F5] transition-colors cursor-pointer">
                  <XMarkIcon class="w-4 h-4" />
                </button>
              </div>

              <!-- Canvas crop area -->
              <div class="relative bg-[#111] flex items-center justify-center" style="height: 280px">
                <canvas
                  ref="cropCanvasRef"
                  class="cursor-move select-none"
                  :width="cropSize"
                  :height="cropSize"
                  @mousedown="onCropMouseDown"
                  @mousemove="onCropMouseMove"
                  @mouseup="onCropMouseUp"
                  @mouseleave="onCropMouseUp"
                  @wheel.prevent="onCropWheel"
                  @touchstart.prevent="onCropTouchStart"
                  @touchmove.prevent="onCropTouchMove"
                  @touchend="onCropTouchEnd"
                ></canvas>
                <!-- Circle overlay guide -->
                <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div
                    class="rounded-full border-2 border-white/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]"
                    :style="{ width: cropSize + 'px', height: cropSize + 'px' }"
                  ></div>
                </div>
              </div>

              <!-- Zoom slider -->
              <div class="px-5 py-3 flex items-center gap-3 border-b border-[#F4F4F5]">
                <MagnifyingGlassMinusIcon class="w-4 h-4 text-[#A1A1AA] shrink-0" />
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.01"
                  v-model.number="cropZoom"
                  @input="drawCrop"
                  class="flex-1 h-1 accent-[#443E8D] cursor-pointer"
                />
                <MagnifyingGlassPlusIcon class="w-4 h-4 text-[#A1A1AA] shrink-0" />
              </div>

              <!-- Actions -->
              <div class="flex items-center justify-end gap-2.5 px-5 py-4">
                <button
                  type="button"
                  @click="closeCropModal"
                  class="px-4 py-2 rounded-xl border border-[#E4E4E7] text-[#52525B] text-xs font-semibold hover:bg-[#F4F4F5] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  @click="confirmCropAndUpload"
                  :disabled="avatarUploading"
                  class="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#443E8D] hover:bg-[#312C6A] text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-sm shadow-[#443E8D]/25"
                >
                  <div v-if="avatarUploading" class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <CheckIcon v-else class="w-3.5 h-3.5" />
                  {{ avatarUploading ? 'Menyimpan...' : 'Simpan Foto' }}
                </button>
              </div>
            </div>
          </div>
        </Teleport>

        <!-- Edit Username Card -->
        <section class="rounded-2xl border border-[#E4E4E7] bg-white p-6 shadow-sm">
          <div class="mb-5 flex items-center gap-2">
            <UserIcon class="h-5 w-5 text-[#443E8D]" />
            <h2 class="text-base font-semibold text-[#18181B]">Ubah Username</h2>
          </div>

          <form @submit.prevent="handleUpdateUsername" novalidate class="flex flex-col gap-4">
            <div class="flex flex-col gap-1.5">
              <label for="username" class="text-sm font-semibold text-[#374151]">Username baru</label>
              <div class="relative flex items-center">
                <span class="absolute left-4 text-[#9CA3AF] text-sm font-medium select-none">@</span>
                <input
                  id="username"
                  v-model="usernameForm.value"
                  type="text"
                  placeholder="username_baru"
                  autocomplete="username"
                  class="w-full h-[48px] pl-8 pr-4 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-[0.9375rem] text-[#111827] outline-none focus:border-[#443E8D] focus:ring-4 focus:ring-[#443E8D]/5 transition-all placeholder:text-[#D1D5DB]"
                  :class="{ 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/5': usernameForm.error }"
                />
              </div>
              <p v-if="usernameForm.error" class="text-xs text-rose-600 font-medium">{{ usernameForm.error }}</p>
              <p class="text-xs text-[#9CA3AF]">Hanya huruf kecil, angka, dan underscore. Spasi akan diganti _</p>
            </div>

            <!-- Success banner -->
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div v-if="usernameForm.success" class="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm font-medium text-emerald-700">
                <CheckCircleIcon class="h-4 w-4 shrink-0 text-emerald-500" />
                Username berhasil diperbarui!
              </div>
            </Transition>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="usernameForm.loading || !usernameForm.value.trim()"
                class="inline-flex items-center gap-2 rounded-full bg-[#443E8D] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#312C6A] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                <div v-if="usernameForm.loading" class="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <template v-else>
                  <CheckIcon class="h-4 w-4" />
                  Simpan Username
                </template>
              </button>
            </div>
          </form>
        </section>

        <!-- Change Password Card -->
        <section class="rounded-2xl border border-[#E4E4E7] bg-white p-6 shadow-sm">
          <div class="mb-5 flex items-center gap-2">
            <LockClosedIcon class="h-5 w-5 text-[#443E8D]" />
            <h2 class="text-base font-semibold text-[#18181B]">Ubah Password</h2>
          </div>

          <form @submit.prevent="handleUpdatePassword" novalidate class="flex flex-col gap-4">
            <!-- Password lama -->
            <div class="flex flex-col gap-1.5">
              <label for="currentPassword" class="text-sm font-semibold text-[#374151]">Password saat ini</label>
              <div class="relative flex items-center">
                <LockClosedIcon class="absolute left-4 h-[18px] w-[18px] text-[#9CA3AF] pointer-events-none" />
                <input
                  id="currentPassword"
                  v-model="passwordForm.current"
                  :type="passwordForm.showCurrent ? 'text' : 'password'"
                  placeholder="Masukkan password lama"
                  autocomplete="current-password"
                  class="w-full h-[48px] pl-11 pr-12 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-[0.9375rem] text-[#111827] outline-none focus:border-[#443E8D] focus:ring-4 focus:ring-[#443E8D]/5 transition-all placeholder:text-[#D1D5DB]"
                  :class="{ 'border-rose-400 focus:border-rose-500': passwordForm.errors.current }"
                />
                <button type="button" class="absolute right-4 p-1 text-[#9CA3AF] hover:text-[#443E8D] transition-colors" @click="passwordForm.showCurrent = !passwordForm.showCurrent">
                  <EyeIcon v-if="!passwordForm.showCurrent" class="h-[18px] w-[18px]" />
                  <EyeSlashIcon v-else class="h-[18px] w-[18px]" />
                </button>
              </div>
              <p v-if="passwordForm.errors.current" class="text-xs text-rose-600 font-medium">{{ passwordForm.errors.current }}</p>
            </div>

            <!-- Password baru -->
            <div class="flex flex-col gap-1.5">
              <label for="newPassword" class="text-sm font-semibold text-[#374151]">Password baru</label>
              <div class="relative flex items-center">
                <LockClosedIcon class="absolute left-4 h-[18px] w-[18px] text-[#9CA3AF] pointer-events-none" />
                <input
                  id="newPassword"
                  v-model="passwordForm.new"
                  :type="passwordForm.showNew ? 'text' : 'password'"
                  placeholder="Min. 6 karakter"
                  autocomplete="new-password"
                  class="w-full h-[48px] pl-11 pr-12 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-[0.9375rem] text-[#111827] outline-none focus:border-[#443E8D] focus:ring-4 focus:ring-[#443E8D]/5 transition-all placeholder:text-[#D1D5DB]"
                  :class="{ 'border-rose-400 focus:border-rose-500': passwordForm.errors.new }"
                />
                <button type="button" class="absolute right-4 p-1 text-[#9CA3AF] hover:text-[#443E8D] transition-colors" @click="passwordForm.showNew = !passwordForm.showNew">
                  <EyeIcon v-if="!passwordForm.showNew" class="h-[18px] w-[18px]" />
                  <EyeSlashIcon v-else class="h-[18px] w-[18px]" />
                </button>
              </div>
              <p v-if="passwordForm.errors.new" class="text-xs text-rose-600 font-medium">{{ passwordForm.errors.new }}</p>
              <!-- Password strength bar -->
              <div v-if="passwordForm.new" class="mt-1 flex items-center gap-2">
                <div class="flex flex-1 gap-1">
                  <div
                    v-for="i in 4" :key="i"
                    class="h-1 flex-1 rounded-full transition-all duration-300"
                    :class="i <= passwordStrength.score ? passwordStrength.barColor : 'bg-[#E4E4E7]'"
                  />
                </div>
                <span class="text-xs font-medium" :class="passwordStrength.textColor">{{ passwordStrength.label }}</span>
              </div>
            </div>

            <!-- Konfirmasi password baru -->
            <div class="flex flex-col gap-1.5">
              <label for="confirmPassword" class="text-sm font-semibold text-[#374151]">Konfirmasi password baru</label>
              <div class="relative flex items-center">
                <LockClosedIcon class="absolute left-4 h-[18px] w-[18px] text-[#9CA3AF] pointer-events-none" />
                <input
                  id="confirmPassword"
                  v-model="passwordForm.confirm"
                  :type="passwordForm.showConfirm ? 'text' : 'password'"
                  placeholder="Ulangi password baru"
                  autocomplete="new-password"
                  class="w-full h-[48px] pl-11 pr-12 rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] text-[0.9375rem] text-[#111827] outline-none focus:border-[#443E8D] focus:ring-4 focus:ring-[#443E8D]/5 transition-all placeholder:text-[#D1D5DB]"
                  :class="{ 'border-rose-400 focus:border-rose-500': passwordForm.errors.confirm }"
                />
                <button type="button" class="absolute right-4 p-1 text-[#9CA3AF] hover:text-[#443E8D] transition-colors" @click="passwordForm.showConfirm = !passwordForm.showConfirm">
                  <EyeIcon v-if="!passwordForm.showConfirm" class="h-[18px] w-[18px]" />
                  <EyeSlashIcon v-else class="h-[18px] w-[18px]" />
                </button>
              </div>
              <p v-if="passwordForm.errors.confirm" class="text-xs text-rose-600 font-medium">{{ passwordForm.errors.confirm }}</p>
            </div>

            <!-- Error / Success global -->
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div v-if="passwordForm.globalError" class="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-100 px-4 py-3 text-sm font-medium text-rose-700">
                <ExclamationCircleIcon class="h-4 w-4 shrink-0 text-rose-500" />
                {{ passwordForm.globalError }}
              </div>
            </Transition>
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-200 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-1"
            >
              <div v-if="passwordForm.success" class="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm font-medium text-emerald-700">
                <CheckCircleIcon class="h-4 w-4 shrink-0 text-emerald-500" />
                Password berhasil diperbarui!
              </div>
            </Transition>

            <div class="flex justify-end">
              <button
                type="submit"
                :disabled="passwordForm.loading"
                class="inline-flex items-center gap-2 rounded-full bg-[#443E8D] px-6 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#312C6A] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
              >
                <div v-if="passwordForm.loading" class="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <template v-else>
                  <ShieldCheckIcon class="h-4 w-4" />
                  Ubah Password
                </template>
              </button>
            </div>
          </form>
        </section>

        <!-- Danger Zone -->
        <section class="rounded-2xl border border-rose-100 bg-rose-50/40 p-6">
          <div class="mb-3 flex items-center gap-2">
            <ExclamationTriangleIcon class="h-5 w-5 text-rose-500" />
            <h2 class="text-base font-semibold text-rose-700">Keluar Akun</h2>
          </div>
          <p class="mb-4 text-sm text-rose-600/80">Kamu akan keluar dari semua sesi aktif di perangkat ini.</p>
          <button
            @click="handleLogout"
            class="inline-flex items-center gap-2 rounded-full border border-rose-300 bg-white px-5 py-2 text-sm font-semibold text-rose-600 transition-all hover:bg-rose-500 hover:border-rose-500 hover:text-white hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowRightOnRectangleIcon class="h-4 w-4" />
            Keluar
          </button>
        </section>

      </main>
    </div>

    <!-- Overlay sidebar mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-[150] bg-slate-900/20 backdrop-blur-sm lg:hidden"
      @click="sidebarOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import Sidebar from '~/components/student/StudentSidebar.vue'
import {
  Bars3Icon,
  UserIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckIcon,
  CheckCircleIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  CameraIcon,
  XMarkIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
} from '@heroicons/vue/24/outline'

useSeoMeta({
  title: 'Profil Saya — Pixelnoid Academy',
  description: 'Kelola informasi profil, username, dan password akunmu di Pixelnoid Academy.',
})

definePageMeta({ layout: 'dashboard' })

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { profile, fetchProfile } = useUserProfile()
const sidebarOpen = ref(false)

// ── Avatar Upload + Crop ────────────────────────────────────────
const avatarInputRef = ref<HTMLInputElement | null>(null)
const cropCanvasRef = ref<HTMLCanvasElement | null>(null)
const avatarPreview = ref('')
const avatarUploading = ref(false)
const avatarError = ref('')
const cropModalOpen = ref(false)
const cropSize = 280 // px - ukuran canvas & preview lingkaran

// State gambar crop
let cropImg: HTMLImageElement | null = null
const cropZoom = ref(1)
let cropOffsetX = 0
let cropOffsetY = 0
let isDragging = false
let dragStartX = 0
let dragStartY = 0
let lastTouchDist = 0

const triggerAvatarInput = () => avatarInputRef.value?.click()

/** Dipanggil saat user pilih file — buka modal crop */
const handleAvatarFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return
  const file = target.files[0]

  if (!file.type.startsWith('image/')) {
    avatarError.value = 'File harus berupa gambar.'
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    avatarError.value = 'Ukuran foto maksimal 10 MB.'
    return
  }

  avatarError.value = ''
  const reader = new FileReader()
  reader.onload = async (e) => {
    const img = new Image()
    img.onload = async () => {
      cropImg = img
      // Reset posisi: tengahkan gambar
      const scale = Math.max(cropSize / img.width, cropSize / img.height)
      cropZoom.value = scale
      cropOffsetX = (cropSize - img.width * scale) / 2
      cropOffsetY = (cropSize - img.height * scale) / 2
      cropModalOpen.value = true
      await nextTick()
      drawCrop()
    }
    img.src = e.target?.result as string
  }
  reader.readAsDataURL(file)
  if (avatarInputRef.value) avatarInputRef.value.value = ''
}

/** Render frame crop ke canvas */
const drawCrop = () => {
  const canvas = cropCanvasRef.value
  if (!canvas || !cropImg) return
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, cropSize, cropSize)
  ctx.drawImage(
    cropImg,
    cropOffsetX, cropOffsetY,
    cropImg.width * cropZoom.value,
    cropImg.height * cropZoom.value
  )
}

// Mouse drag handlers
const onCropMouseDown = (e: MouseEvent) => {
  isDragging = true
  dragStartX = e.clientX - cropOffsetX
  dragStartY = e.clientY - cropOffsetY
}
const onCropMouseMove = (e: MouseEvent) => {
  if (!isDragging) return
  cropOffsetX = e.clientX - dragStartX
  cropOffsetY = e.clientY - dragStartY
  drawCrop()
}
const onCropMouseUp = () => { isDragging = false }

// Scroll zoom
const onCropWheel = (e: WheelEvent) => {
  const delta = e.deltaY > 0 ? -0.08 : 0.08
  cropZoom.value = Math.min(3, Math.max(0.5, cropZoom.value + delta))
  drawCrop()
}

// Touch handlers
const onCropTouchStart = (e: TouchEvent) => {
  if (e.touches.length === 1) {
    isDragging = true
    dragStartX = e.touches[0].clientX - cropOffsetX
    dragStartY = e.touches[0].clientY - cropOffsetY
  } else if (e.touches.length === 2) {
    lastTouchDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
  }
}
const onCropTouchMove = (e: TouchEvent) => {
  if (e.touches.length === 1 && isDragging) {
    cropOffsetX = e.touches[0].clientX - dragStartX
    cropOffsetY = e.touches[0].clientY - dragStartY
    drawCrop()
  } else if (e.touches.length === 2) {
    const dist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
    const delta = (dist - lastTouchDist) * 0.005
    cropZoom.value = Math.min(3, Math.max(0.5, cropZoom.value + delta))
    lastTouchDist = dist
    drawCrop()
  }
}
const onCropTouchEnd = () => { isDragging = false }

const closeCropModal = () => {
  cropModalOpen.value = false
  cropImg = null
}

/** Export canvas sebagai WebP blob, lalu upload */
const confirmCropAndUpload = async () => {
  const canvas = cropCanvasRef.value
  if (!canvas) return

  avatarUploading.value = true
  avatarError.value = ''

  try {
    // Render hasil crop ke canvas output 400x400
    const outputSize = 400
    const outCanvas = document.createElement('canvas')
    outCanvas.width = outputSize
    outCanvas.height = outputSize
    const ctx = outCanvas.getContext('2d')!
    // Scale down dari cropSize ke outputSize
    const ratio = outputSize / cropSize
    if (cropImg) {
      ctx.drawImage(
        cropImg,
        cropOffsetX * ratio, cropOffsetY * ratio,
        cropImg.width * cropZoom.value * ratio,
        cropImg.height * cropZoom.value * ratio
      )
    }

    const blob = await new Promise<Blob | null>(res => outCanvas.toBlob(res, 'image/webp', 0.9))
    if (!blob) throw new Error('Gagal memproses gambar.')

    const file = new File([blob], 'avatar.webp', { type: 'image/webp' })

    // Preview instan
    avatarPreview.value = URL.createObjectURL(blob)
    cropModalOpen.value = false

    // Upload ke server
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    if (!token) throw new Error('Tidak terautentikasi.')

    const formData = new FormData()
    formData.append('file', file)

    const res: any = await $fetch('/api/student/profile/upload-avatar', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })

    if (res.avatar_url) {
      avatarPreview.value = res.avatar_url
      profile.value = null
      await fetchProfile()
    }
  } catch (err: any) {
    avatarError.value = err?.data?.statusMessage || err?.message || 'Gagal mengunggah foto.'
    avatarPreview.value = ''
  } finally {
    avatarUploading.value = false
  }
}

// ── Computed profile fields ──────────────────────────────────────
const userName = computed(() =>
  profile.value?.fullname || user.value?.user_metadata?.full_name || user.value?.email?.split('@')[0] || 'Pengguna'
)
const userUsername = computed(() =>
  profile.value?.username || user.value?.user_metadata?.username || user.value?.email?.split('@')[0] || 'user'
)
const userRole = computed(() => {
  const roles = profile.value?.roles || user.value?.user_metadata?.role
  if (Array.isArray(roles) && roles.length > 0) return roles[0].charAt(0).toUpperCase() + roles[0].slice(1)
  return 'Student'
})
const userInitials = computed(() => {
  const name = userName.value
  const parts = name.split(/[\s@_.\-]+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return (name[0] || 'U').toUpperCase()
})

onMounted(() => {
  fetchProfile()
  // Pre-fill username input
  usernameForm.value = userUsername.value
})

// ── Username form ────────────────────────────────────────────────
const usernameForm = reactive({
  value: '',
  error: '',
  success: false,
  loading: false,
})

const handleUpdateUsername = async () => {
  usernameForm.error = ''
  usernameForm.success = false

  const trimmed = usernameForm.value.trim()
  if (!trimmed) {
    usernameForm.error = 'Username tidak boleh kosong.'
    return
  }
  if (!/^[a-zA-Z0-9_\s]+$/.test(trimmed)) {
    usernameForm.error = 'Username hanya boleh berisi huruf, angka, dan underscore.'
    return
  }

  usernameForm.loading = true
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    if (!token) throw new Error('Tidak terautentikasi.')

    await $fetch('/api/student/profile/update', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { username: trimmed },
    })

    usernameForm.success = true
    // Refresh profile state
    profile.value = null
    await fetchProfile()

    setTimeout(() => { usernameForm.success = false }, 4000)
  } catch (err: any) {
    usernameForm.error = err?.data?.statusMessage || err?.statusMessage || err?.message || 'Gagal memperbarui username.'
  } finally {
    usernameForm.loading = false
  }
}

// ── Password form ────────────────────────────────────────────────
const passwordForm = reactive({
  current: '',
  new: '',
  confirm: '',
  showCurrent: false,
  showNew: false,
  showConfirm: false,
  errors: { current: '', new: '', confirm: '' },
  globalError: '',
  success: false,
  loading: false,
})

// Password strength calculator
const passwordStrength = computed(() => {
  const pw = passwordForm.new
  if (!pw) return { score: 0, label: '', barColor: '', textColor: '' }
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++

  const map = [
    { label: 'Sangat Lemah', barColor: 'bg-rose-500', textColor: 'text-rose-500' },
    { label: 'Lemah',        barColor: 'bg-orange-400', textColor: 'text-orange-500' },
    { label: 'Cukup',        barColor: 'bg-amber-400',  textColor: 'text-amber-500' },
    { label: 'Kuat',         barColor: 'bg-emerald-400',textColor: 'text-emerald-500' },
    { label: 'Sangat Kuat',  barColor: 'bg-emerald-500',textColor: 'text-emerald-600' },
  ]
  const entry = map[Math.min(score, 4)]
  return { score: score + 1, ...entry }
})

const validatePasswordForm = () => {
  passwordForm.errors.current = ''
  passwordForm.errors.new = ''
  passwordForm.errors.confirm = ''
  passwordForm.globalError = ''
  let ok = true

  if (!passwordForm.current) {
    passwordForm.errors.current = 'Password lama wajib diisi.'
    ok = false
  }
  if (!passwordForm.new) {
    passwordForm.errors.new = 'Password baru wajib diisi.'
    ok = false
  } else if (passwordForm.new.length < 6) {
    passwordForm.errors.new = 'Password baru minimal 6 karakter.'
    ok = false
  }
  if (!passwordForm.confirm) {
    passwordForm.errors.confirm = 'Konfirmasi password wajib diisi.'
    ok = false
  } else if (passwordForm.new !== passwordForm.confirm) {
    passwordForm.errors.confirm = 'Konfirmasi password tidak cocok.'
    ok = false
  }

  return ok
}

const handleUpdatePassword = async () => {
  if (!validatePasswordForm()) return

  passwordForm.loading = true
  passwordForm.success = false
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    if (!token) throw new Error('Tidak terautentikasi.')

    await $fetch('/api/student/profile/update', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        currentPassword: passwordForm.current,
        newPassword: passwordForm.new,
      },
    })

    passwordForm.success = true
    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
    setTimeout(() => { passwordForm.success = false }, 4000)
  } catch (err: any) {
    passwordForm.globalError = err?.data?.statusMessage || err?.statusMessage || err?.message || 'Gagal memperbarui password.'
  } finally {
    passwordForm.loading = false
  }
}

// ── Logout ───────────────────────────────────────────────────────
const handleLogout = async () => {
  await supabase.auth.signOut()
  navigateTo('/login')
}
</script>

<style scoped>
/* none needed — all handled by Tailwind */
</style>
