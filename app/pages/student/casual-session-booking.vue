<template>
  <div
    class="flex min-h-screen bg-[#F5F5F8] antialiased relative overflow-x-hidden"
    style="font-family: 'Instrument Sans', Raleway, sans-serif"
  >
    <!-- Sidebar -->
    <StudentSidebar :open="sidebarOpen" @update:open="sidebarOpen = $event" />

    <!-- Main wrap -->
    <div class="flex-1 lg:ml-[260px] flex flex-col relative z-[1]">

      <!-- ── TOPBAR ── -->
      <header class="sticky top-0 z-[100] flex items-center gap-4 px-10 py-4 max-[900px]:px-6 bg-white border-b border-[#EEEDF5]">
        <button
          class="hidden max-[900px]:flex w-9 h-9 border border-[#E8E7F2] bg-white cursor-pointer rounded-xl items-center justify-center text-[#443E8D] hover:bg-[#F0EFF9] transition-colors"
          @click="sidebarOpen = !sidebarOpen"
          aria-label="Toggle sidebar"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <!-- Breadcrumb -->
            <NuxtLink to="/student/class?tab=meeting" class="inline-flex items-center gap-1 text-[0.68rem] font-semibold text-[#9896C8] hover:text-[#443E8D] transition-colors">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
              Live Meeting
            </NuxtLink>
            <span class="text-[#D8D6F0] text-xs">/</span>
            <span class="text-[0.68rem] font-bold text-[#443E8D]">Pilih Jadwal</span>
          </div>
          <h1 class="text-[1.1rem] font-bold text-[#1A1830] m-0 tracking-tight">
            Booking Micro Session
          </h1>
        </div>

        <!-- Time badge -->
        <div class="flex-shrink-0 flex items-center gap-2 bg-[#ECFDF5] px-3.5 py-2 rounded-xl border border-[#A7F3D0]/50">
          <svg class="w-3.5 h-3.5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span class="text-[0.72rem] font-bold text-[#10B981]">19.45 – 20.00 WIB</span>
        </div>
      </header>

      <!-- ── MAIN CONTENT ── -->
      <main class="py-8 px-10 max-[900px]:p-6 flex flex-col gap-7 max-w-[800px] mx-auto w-full">

        <!-- Info Banner -->
        <div class="bg-white border border-[#EEEDF5] rounded-2xl p-5 flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="flex flex-col gap-1 flex-1">
            <span class="text-[0.82rem] font-bold text-[#1A1830]">Tentang Micro Session</span>
            <p class="text-[0.75rem] text-[#6B68A8] leading-relaxed m-0">
              Sesi 30–45 menit untuk check progress project, debug bareng mentor, dan selesaikan masalah yang bikin stuck.
              Tersedia <strong class="text-[#1A1830]">setiap hari Senin–Minggu</strong>, pukul <strong class="text-[#1A1830]">19.45 – 20.00 WIB</strong>.
              Pilih satu hari di bawah ini, lalu konfirmasi booking kamu.
            </p>
          </div>
        </div>

        <!-- Step 1: Pilih Hari -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-[#443E8D] text-white text-[0.65rem] font-black flex items-center justify-center">1</span>
            <h2 class="text-[0.95rem] font-bold text-[#1A1830] tracking-tight m-0">Pilih Hari</h2>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <button
              v-for="day in days"
              :key="day.id"
              @click="selectedDay = day.id"
              class="relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 group focus:outline-none"
              :class="selectedDay === day.id
                ? 'bg-[#443E8D] border-[#443E8D] shadow-lg shadow-[#443E8D]/20'
                : 'bg-white border-[#EEEDF5] hover:border-[#C4C1E8] hover:bg-[#FAFAFA]'"
            >
              <!-- Day abbreviation -->
              <span
                class="text-[0.6rem] font-bold uppercase tracking-wider"
                :class="selectedDay === day.id ? 'text-white/70' : 'text-[#9896C8]'"
              >{{ day.short }}</span>

              <!-- Full name -->
              <span
                class="text-[0.88rem] font-bold leading-none"
                :class="selectedDay === day.id ? 'text-white' : 'text-[#1A1830]'"
              >{{ day.name }}</span>

              <!-- Slot availability -->
              <span
                class="text-[0.6rem] font-semibold px-2 py-0.5 rounded-full"
                :class="selectedDay === day.id
                  ? 'bg-white/20 text-white'
                  : day.available
                    ? 'bg-[#ECFDF5] text-[#10B981]'
                    : 'bg-[#FEF2F2] text-[#EF4444]'"
              >{{ day.available ? 'Tersedia' : 'Penuh' }}</span>

              <!-- Selected indicator -->
              <div
                v-if="selectedDay === day.id"
                class="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-white flex items-center justify-center"
              >
                <svg class="w-2.5 h-2.5 text-[#443E8D]" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
            </button>
          </div>
        </div>

        <!-- Step 2: Detail Sesi (muncul setelah pilih hari) -->
        <Transition name="slide-up">
          <div v-if="selectedDay" class="flex flex-col gap-4">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-[#443E8D] text-white text-[0.65rem] font-black flex items-center justify-center">2</span>
              <h2 class="text-[0.95rem] font-bold text-[#1A1830] tracking-tight m-0">Detail Sesi</h2>
            </div>

            <div class="bg-white border border-[#EEEDF5] rounded-2xl overflow-hidden">
              <!-- Header card -->
              <div class="bg-gradient-to-r from-[#443E8D] to-[#6B68A8] px-6 py-5">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div>
                    <span class="text-[0.6rem] font-bold text-white/60 uppercase tracking-wider">Micro Session</span>
                    <div class="text-[1rem] font-bold text-white">Debug &amp; Review Project</div>
                  </div>
                </div>
              </div>

              <!-- Detail rows -->
              <div class="divide-y divide-[#F3F2FA]">
                <div class="flex items-center gap-4 px-6 py-4">
                  <div class="w-8 h-8 rounded-lg bg-[#F0EFF9] flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-[#443E8D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  </div>
                  <div class="flex-1">
                    <div class="text-[0.68rem] text-[#9896C8] font-semibold uppercase tracking-wider mb-0.5">Hari</div>
                    <div class="text-[0.88rem] font-bold text-[#1A1830]">{{ selectedDayObj?.name }}, Minggu Ini</div>
                  </div>
                </div>

                <div class="flex items-center gap-4 px-6 py-4">
                  <div class="w-8 h-8 rounded-lg bg-[#F0EFF9] flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-[#443E8D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div class="flex-1">
                    <div class="text-[0.68rem] text-[#9896C8] font-semibold uppercase tracking-wider mb-0.5">Waktu</div>
                    <div class="text-[0.88rem] font-bold text-[#1A1830]">19.45 – 20.00 WIB <span class="text-[0.72rem] font-medium text-[#9896C8]">(±15 menit)</span></div>
                  </div>
                </div>

                <div class="flex items-center gap-4 px-6 py-4">
                  <div class="w-8 h-8 rounded-lg bg-[#F0EFF9] flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-[#443E8D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <div class="flex-1">
                    <div class="text-[0.68rem] text-[#9896C8] font-semibold uppercase tracking-wider mb-0.5">Mentor</div>
                    <div class="text-[0.88rem] font-bold text-[#1A1830]">Support Mentor <span class="text-[0.72rem] font-medium text-[#9896C8]">(diassign otomatis)</span></div>
                  </div>
                </div>

                <div class="flex items-center gap-4 px-6 py-4">
                  <div class="w-8 h-8 rounded-lg bg-[#F0EFF9] flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-[#443E8D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                  </div>
                  <div class="flex-1">
                    <div class="text-[0.68rem] text-[#9896C8] font-semibold uppercase tracking-wider mb-0.5">Platform</div>
                    <div class="text-[0.88rem] font-bold text-[#1A1830]">Google Meet <span class="text-[0.72rem] font-medium text-[#9896C8]">(link dikirim via notifikasi)</span></div>
                  </div>
                </div>

                <div class="flex items-center gap-4 px-6 py-4">
                  <div class="w-8 h-8 rounded-lg bg-[#ECFDF5] flex items-center justify-center flex-shrink-0">
                    <svg class="w-4 h-4 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  </div>
                  <div class="flex-1">
                    <div class="text-[0.68rem] text-[#9896C8] font-semibold uppercase tracking-wider mb-0.5">Slot Tersisa</div>
                    <div class="text-[0.88rem] font-bold text-[#10B981]">{{ selectedDayObj?.slots }} slot tersedia</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>

        <!-- Step 3: Topik / Catatan (muncul setelah pilih hari) -->
        <Transition name="slide-up">
          <div v-if="selectedDay" class="flex flex-col gap-4">
            <div class="flex items-center gap-2">
              <span class="w-6 h-6 rounded-full bg-[#443E8D] text-white text-[0.65rem] font-black flex items-center justify-center">3</span>
              <h2 class="text-[0.95rem] font-bold text-[#1A1830] tracking-tight m-0">Topik yang Ingin Dibahas</h2>
            </div>

            <div class="bg-white border border-[#EEEDF5] rounded-2xl p-5 flex flex-col gap-4">
              <!-- Quick topics -->
              <div class="flex flex-col gap-2">
                <span class="text-[0.72rem] font-semibold text-[#9896C8] uppercase tracking-wider">Pilih cepat (opsional)</span>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="topic in quickTopics"
                    :key="topic"
                    @click="toggleTopic(topic)"
                    class="text-[0.72rem] font-semibold px-3 py-1.5 rounded-xl border-2 transition-all"
                    :class="selectedTopics.includes(topic)
                      ? 'bg-[#443E8D] border-[#443E8D] text-white'
                      : 'bg-white border-[#EEEDF5] text-[#6B68A8] hover:border-[#C4C1E8]'"
                  >{{ topic }}</button>
                </div>
              </div>

              <!-- Free text -->
              <div class="flex flex-col gap-1.5">
                <label class="text-[0.72rem] font-semibold text-[#9896C8] uppercase tracking-wider">Catatan tambahan (opsional)</label>
                <textarea
                  v-model="notes"
                  placeholder="Ceritakan masalah atau pertanyaan yang ingin kamu bahas..."
                  rows="3"
                  class="w-full px-4 py-3 bg-[#F8F7FD] border border-[#E8E7F2] rounded-xl text-[0.82rem] text-[#1A1830] placeholder-[#B5B3D8] focus:border-[#443E8D] focus:ring-2 focus:ring-[#443E8D]/10 outline-none transition-all resize-none leading-relaxed"
                ></textarea>
              </div>
            </div>
          </div>
        </Transition>

        <!-- CTA: Konfirmasi -->
        <Transition name="slide-up">
          <div v-if="selectedDay" class="flex flex-col gap-3">
            <div v-if="bookingError" class="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
              {{ bookingError }}
            </div>

            <button
              v-if="!isBooked"
              @click="confirmBooking"
              :disabled="isSubmitting"
              class="w-full py-3.5 rounded-2xl bg-[#443E8D] text-white font-bold text-[0.9rem] hover:bg-[#3A3478] active:scale-[0.98] transition-all shadow-lg shadow-[#443E8D]/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div v-if="isSubmitting" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>{{ isSubmitting ? 'Memproses Booking...' : `Konfirmasi Booking — ${selectedDayObj?.name}, 19.45 WIB` }}</span>
            </button>

            <!-- Success State -->
            <div
              v-else
              class="w-full py-4 rounded-2xl bg-[#ECFDF5] border-2 border-[#A7F3D0] flex flex-col items-center gap-2 text-center"
            >
              <div class="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
              </div>
              <div class="text-[0.88rem] font-bold text-[#059669]">Booking Berhasil! 🎉</div>
              <p class="text-[0.75rem] text-[#6B68A8] m-0">Sesi Micro Session kamu telah berhasil dijadwalkan dan tercatat di sistem.</p>
              <NuxtLink to="/student/class?tab=meeting" class="mt-1 text-[0.75rem] font-bold text-[#443E8D] hover:underline">
                ← Kembali ke Live Meeting
              </NuxtLink>
            </div>

            <NuxtLink
              v-if="!isBooked"
              to="/student/class?tab=meeting"
              class="text-center text-[0.75rem] font-semibold text-[#9896C8] hover:text-[#443E8D] transition-colors"
            >
              Batal, kembali ke Live Meeting
            </NuxtLink>
          </div>
        </Transition>

      </main>
    </div>

    <!-- Sidebar overlay (mobile only) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-[rgba(15,23,42,0.15)] z-[150] hidden max-[900px]:block backdrop-blur-[2px]"
      @click="sidebarOpen = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StudentSidebar from '~/components/student/StudentSidebar.vue'

useSeoMeta({
  title: 'Booking Micro Session — Pixelnoid Academy',
  description: 'Pilih jadwal Micro Session bersama mentor. Tersedia setiap hari Senin–Minggu, 19.45–20.00 WIB.'
})

definePageMeta({ layout: 'dashboard' })

const sidebarOpen = ref(false)

/* ── Days ── */
const days = ref([
  { id: 'sen', short: 'SEN', name: 'Senin',  available: true,  slots: 3 },
  { id: 'sel', short: 'SEL', name: 'Selasa', available: true,  slots: 2 },
  { id: 'rab', short: 'RAB', name: 'Rabu',   available: false, slots: 0 },
  { id: 'kam', short: 'KAM', name: 'Kamis',  available: true,  slots: 4 },
  { id: 'jum', short: 'JUM', name: 'Jumat',  available: true,  slots: 1 },
  { id: 'sab', short: 'SAB', name: 'Sabtu',  available: true,  slots: 5 },
  { id: 'min', short: 'MIN', name: 'Minggu', available: true,  slots: 3 },
])

const selectedDay = ref<string | null>(null)
const selectedDayObj = computed(() => days.value.find(d => d.id === selectedDay.value) ?? null)

/* ── Topics ── */
const quickTopics = ref([
  'Debug Error',
  'Review Kode',
  'Tanya Konsep',
  'Review Project',
  'Stuck di Fitur',
  'Minta Feedback',
])
const selectedTopics = ref<string[]>([])
const toggleTopic = (topic: string) => {
  const idx = selectedTopics.value.indexOf(topic)
  if (idx >= 0) selectedTopics.value.splice(idx, 1)
  else selectedTopics.value.push(topic)
}

const notes = ref('')

/* ── Booking ── */
const isBooked = ref(false)
const isSubmitting = ref(false)
const bookingError = ref<string | null>(null)
const supabase = useSupabaseClient()

const confirmBooking = async () => {
  if (!selectedDayObj.value?.available || isSubmitting.value) return
  isSubmitting.value = true
  bookingError.value = null

  try {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token

    const headers: Record<string, string> = {}
    if (token) headers.Authorization = `Bearer ${token}`

    await $fetch('/api/student/mentorship-sessions/book', {
      method: 'POST',
      headers,
      body: {
        day: selectedDayObj.value.name,
        time: '19:45 – 20:15 WIB',
        topics: selectedTopics.value,
        notes: notes.value
      }
    })

    isBooked.value = true
  } catch (err: any) {
    console.error('Booking failed:', err)
    bookingError.value = err?.data?.statusMessage || err?.message || 'Gagal melakukan booking. Silakan coba lagi.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.slide-up-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
</style>
