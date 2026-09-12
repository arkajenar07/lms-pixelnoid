<template>
  <main class="py-6 px-8 max-[900px]:px-5 flex flex-col gap-6 mx-auto w-full max-w-[1400px]">

    <!-- ── MAIN TWO-COLUMN LAYOUT ── -->
    <div class="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 items-start">

      <!-- ── LEFT: TABLE CARD (SEMUA JADWAL) ── -->
      <div class="bg-white rounded-2xl border border-[#E4E4E7] shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">

        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4.5 border-b border-[#F4F4F5] bg-white">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-[#F0EFF9] flex items-center justify-center text-[#443E8D] flex-shrink-0">
              <CalendarDaysIcon class="w-4 h-4" />
            </div>
            <div>
              <h2 class="text-[0.92rem] font-bold text-[#18181B] m-0 leading-tight">
                {{ selectedDate ? `Jadwal: ${formatDateOnly(selectedDate)}` : 'Semua Jadwal' }}
              </h2>
              <p class="text-[0.7rem] text-[#71717A] m-0 mt-0.5">
                {{ filteredSchedules.length }} sesi ditemukan
                <span v-if="userEmail" class="text-[#443E8D] font-medium">· untuk {{ userEmail }}</span>
              </p>
            </div>
          </div>

          <!-- Reset Filter Button if date selected -->
          <button
            v-if="selectedDate"
            @click="selectedDate = null"
            class="text-[0.72rem] font-semibold text-[#443E8D] hover:bg-[#F0EFF9] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <ArrowPathIcon class="w-3.5 h-3.5" />
            <span>Lihat Semua Jadwal</span>
          </button>
        </div>

        <!-- Table Container -->
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse min-w-[680px]">
            <!-- Table Header -->
            <thead>
              <tr class="border-b border-[#F4F4F5] bg-[#FAFAFC]">
                <th class="py-3 px-6 text-[0.68rem] font-bold text-[#A1A1AA] uppercase tracking-wider w-[36%]">
                  Judul
                </th>
                <th class="py-3 px-6 text-[0.68rem] font-bold text-[#A1A1AA] uppercase tracking-wider w-[24%]">
                  Waktu
                </th>
                <th class="py-3 px-6 text-[0.68rem] font-bold text-[#A1A1AA] uppercase tracking-wider w-[24%]">
                  Mentor / Student
                </th>
                <th class="py-3 px-6 text-[0.68rem] font-bold text-[#A1A1AA] uppercase tracking-wider w-[16%] text-center">
                  Google Sync
                </th>
              </tr>
            </thead>

            <!-- Table Body -->
            <tbody class="divide-y divide-[#F4F4F5]">
              <!-- Loading State -->
              <tr v-if="isLoading">
                <td colspan="4" class="py-16 text-center">
                  <div class="inline-flex items-center gap-3">
                    <div class="w-5 h-5 border-2 border-[#443E8D] border-t-transparent rounded-full animate-spin"></div>
                    <span class="text-[0.8rem] text-[#71717A] font-medium">Memuat jadwal mengajar...</span>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="filteredSchedules.length === 0">
                <td colspan="4" class="py-16 text-center px-6">
                  <div class="flex flex-col items-center gap-2 max-w-sm mx-auto">
                    <div class="w-12 h-12 rounded-2xl bg-[#F0EFF9] flex items-center justify-center text-xl text-[#443E8D]">
                      📅
                    </div>
                    <p class="text-[0.88rem] font-bold text-[#18181B] m-0">Tidak ada jadwal pada tanggal ini</p>
                    <p class="text-[0.75rem] text-[#71717A] m-0">
                      {{ selectedDate
                          ? 'Coba pilih tanggal lain pada kalender atau klik tombol di bawah untuk melihat seluruh jadwal.'
                          : 'Belum ada jadwal sesi yang ditujukan untuk email akun kamu.' }}
                    </p>
                    <button
                      v-if="selectedDate"
                      @click="selectedDate = null"
                      class="mt-2 text-[0.75rem] font-semibold px-3.5 py-1.5 rounded-lg bg-[#443E8D] text-white hover:bg-[#3A3478] transition-colors"
                    >
                      Tampilkan Semua Jadwal
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr
                v-for="item in filteredSchedules"
                :key="item.id"
                class="hover:bg-[#FAFAFC]/80 transition-colors group"
              >
                <!-- 1. Judul Column -->
                <td class="py-4.5 px-6 align-top">
                  <div class="flex items-start gap-3">
                    <!-- Color Dot -->
                    <span
                      class="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 shadow-xs"
                      :style="{ backgroundColor: getDotColor(item.color) }"
                    ></span>

                    <div class="min-w-0 flex-1">
                      <h4 class="text-[0.88rem] font-bold text-[#18181B] m-0 leading-snug group-hover:text-[#443E8D] transition-colors">
                        {{ item.title }}
                      </h4>

                      <!-- Description -->
                      <p
                        v-if="item.description"
                        class="text-[0.75rem] text-[#71717A] m-0 mt-0.5 leading-relaxed line-clamp-1"
                        :title="item.description"
                      >
                        {{ item.description }}
                      </p>

                      <!-- Meet Link Button if available -->
                      <div v-if="item.meet_link" class="flex items-center gap-2 mt-2">
                        <a
                          :href="item.meet_link"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#443E8D] text-white text-[0.7rem] font-semibold hover:bg-[#3A3478] transition-colors"
                        >
                          <VideoCameraIcon class="w-3.5 h-3.5" />
                          <span>Join Meet</span>
                        </a>
                        <button
                          @click="copyLink(item.meet_link, item.id)"
                          class="text-[0.68rem] text-[#71717A] hover:text-[#18181B] px-2 py-0.5 rounded border border-[#E4E4E7] bg-white transition-colors"
                        >
                          {{ copiedId === item.id ? 'Tersalin!' : 'Copy' }}
                        </button>
                      </div>

                      <!-- Notification badge -->
                      <div v-if="formatNotification(item.notifications)" class="mt-1.5 inline-flex items-center gap-1 text-[0.65rem] text-[#6B7280] bg-[#F4F4F5] px-2 py-0.5 rounded-md font-medium">
                        <span>🔔</span>
                        <span>{{ formatNotification(item.notifications) }}</span>
                      </div>
                    </div>
                  </div>
                </td>

                <!-- 2. Waktu Column -->
                <td class="py-4.5 px-6 align-top">
                  <!-- Recurring: tampilkan label perulangan (setiap hari / setiap jumat / dll) -->
                  <template v-if="isRecurring(item.recurrence)">
                    <div class="flex items-center gap-1.5 text-[0.82rem] font-semibold text-[#443E8D] leading-tight">
                      <ArrowPathIcon class="w-3.5 h-3.5 flex-shrink-0 text-[#443E8D]" />
                      <span>{{ formatRecurrenceLabel(item) }}</span>
                    </div>
                    <div class="text-[0.75rem] text-[#71717A] mt-0.5">
                      {{ formatTimeRange(item.start_at, item.end_at) }}
                    </div>
                  </template>
                  <!-- Non-recurring: tampilkan tanggal asli -->
                  <template v-else>
                    <div class="text-[0.82rem] font-semibold text-[#18181B] leading-tight">
                      {{ formatScheduleDate(item.start_at) }}
                    </div>
                    <div class="text-[0.75rem] text-[#71717A] mt-0.5">
                      {{ formatTimeRange(item.start_at, item.end_at) }}
                    </div>
                  </template>
                </td>

                <!-- 3. Mentor / Student Column -->
                <td class="py-4.5 px-6 align-top">
                  <!-- Mentor Email -->
                  <div class="text-[0.8rem] font-medium text-[#18181B] truncate max-w-[220px]" :title="item.mentor_email">
                    {{ item.mentor_email || '-' }}
                  </div>

                  <!-- Student Emails -->
                  <div
                    class="text-[0.72rem] text-[#71717A] truncate max-w-[220px] mt-0.5"
                    :title="(item.student_emails || []).join(', ')"
                  >
                    {{ (item.student_emails && item.student_emails.length > 0) ? item.student_emails.join(', ') : '-' }}
                  </div>
                </td>

                <!-- 4. Google Sync Column -->
                <td class="py-4.5 px-6 align-top text-center">
                  <span
                    v-if="item.google_sync_status === 'synced'"
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.72rem] font-semibold bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]/60 shadow-2xs"
                  >
                    <CheckCircleIcon class="w-3.5 h-3.5 text-[#059669]" />
                    <span>Synced</span>
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[0.7rem] font-medium bg-gray-100 text-gray-600"
                  >
                    {{ item.google_sync_status || 'Pending' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

      <!-- ── RIGHT: MINI CALENDAR CARD ── -->
      <div class="bg-white rounded-2xl border border-[#E4E4E7] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col gap-4 sticky top-24">

        <!-- Calendar Month Header -->
        <div class="flex items-center justify-between">
          <h3 class="text-[0.92rem] font-bold text-[#18181B] m-0">
            {{ currentMonthName }} {{ currentYear }}
          </h3>
          <div class="flex items-center gap-1">
            <button
              @click="prevMonth"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] transition-colors"
              aria-label="Bulan Sebelumnya"
            >
              <ChevronLeftIcon class="w-4 h-4" />
            </button>
            <button
              @click="nextMonth"
              class="w-7 h-7 rounded-lg flex items-center justify-center text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] transition-colors"
              aria-label="Bulan Selanjutnya"
            >
              <ChevronRightIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Weekday Headers -->
        <div class="grid grid-cols-7 text-center">
          <span
            v-for="d in ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']"
            :key="d"
            class="text-[0.7rem] font-semibold text-[#A1A1AA] py-1"
          >
            {{ d }}
          </span>
        </div>

        <!-- Calendar Day Grid -->
        <div class="grid grid-cols-7 gap-1 text-center">
          <!-- Leading empty blanks -->
          <div
            v-for="b in firstDayOfMonth"
            :key="'blank-' + b"
            class="h-8"
          />

          <!-- Day Cells -->
          <div
            v-for="day in daysInMonth"
            :key="'day-' + day"
            class="flex flex-col items-center justify-center h-8 relative cursor-pointer group"
            @click="toggleSelectDate(day)"
          >
            <div
              class="w-7 h-7 rounded-full flex items-center justify-center text-[0.78rem] font-semibold transition-all relative"
              :class="[
                isDateSelected(day)
                  ? 'bg-[#443E8D] text-white shadow-xs font-bold'
                  : isToday(day)
                    ? 'bg-[#F0EFF9] text-[#443E8D] font-bold ring-1 ring-[#443E8D]/30'
                    : 'text-[#3F3F46] hover:bg-[#F4F4F5]'
              ]"
            >
              <span>{{ day }}</span>

              <!-- Blue/Theme Dot for Dates with Schedules -->
              <span
                v-if="hasSchedule(day)"
                class="absolute -bottom-1 w-1.5 h-1.5 rounded-full transition-colors"
                :class="isDateSelected(day) ? 'bg-[#A5B4FC]' : 'bg-[#443E8D]'"
              ></span>
            </div>
          </div>
        </div>

        <!-- Bottom CTA -->
        <div class="pt-2 border-t border-[#F4F4F5] mt-1">
          <button
            v-if="selectedDate"
            @click="selectedDate = null"
            class="w-full py-2.5 rounded-xl border border-[#E4E4E7] text-[0.75rem] font-semibold text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#18181B] transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowPathIcon class="w-3.5 h-3.5" />
            <span>Tampilkan Semua Jadwal</span>
          </button>

          <NuxtLink
            v-else
            to="/student/casual-session-booking"
            class="w-full py-2.5 rounded-xl border border-[#E4E4E7] bg-white text-[0.75rem] font-semibold text-[#18181B] hover:bg-[#F4F4F5] hover:border-[#D4D4D8] transition-colors flex items-center justify-center gap-1.5 no-underline shadow-2xs"
          >
            <span>+ Buat Jadwal Baru</span>
          </NuxtLink>
        </div>

      </div>

    </div>

  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  CalendarDaysIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  VideoCameraIcon
} from '@heroicons/vue/24/outline'

interface ScheduleItem {
  id: string
  title: string
  description: string | null
  start_at: string
  end_at: string
  mentor_email: string | null
  student_emails: string[]
  guest_emails: string[]
  google_sync_status: string | null
  recurrence: string | null
  meet_link: string | null
  color: string | null
  status: string | null
  notifications: any[] | null
}

const supabase = useSupabaseClient()

// ── State ─────────────────────────────────────────────────────────────
const isLoading = ref(true)
const schedules = ref<ScheduleItem[]>([])
const userEmail = ref<string | null>(null)
const copiedId = ref<string | null>(null)

// ── Calendar Navigation State ─────────────────────────────────────────
// Default to September 2026 as per database schedules, or current date
const currentYear = ref(2026)
const currentMonth = ref(8) // 0-indexed: 8 = September
const selectedDate = ref<Date | null>(null)

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

const currentMonthName = computed(() => monthNames[currentMonth.value])

// Number of days in current view month
const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
})

// Day index for the 1st of current month (0 = Sunday, 1 = Monday, ...)
const firstDayOfMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 1).getDay()
})

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function toggleSelectDate(dayNum: number) {
  const clicked = new Date(currentYear.value, currentMonth.value, dayNum)
  if (
    selectedDate.value &&
    selectedDate.value.getFullYear() === clicked.getFullYear() &&
    selectedDate.value.getMonth() === clicked.getMonth() &&
    selectedDate.value.getDate() === clicked.getDate()
  ) {
    // Deselect if already selected
    selectedDate.value = null
  } else {
    selectedDate.value = clicked
  }
}

function isDateSelected(dayNum: number): boolean {
  if (!selectedDate.value) return false
  return (
    selectedDate.value.getFullYear() === currentYear.value &&
    selectedDate.value.getMonth() === currentMonth.value &&
    selectedDate.value.getDate() === dayNum
  )
}

function isToday(dayNum: number): boolean {
  const today = new Date()
  return (
    today.getFullYear() === currentYear.value &&
    today.getMonth() === currentMonth.value &&
    today.getDate() === dayNum
  )
}

// Check if a specific date in current calendar view has a schedule
function hasSchedule(dayNum: number): boolean {
  const date = new Date(currentYear.value, currentMonth.value, dayNum)
  return schedules.value.some(s => matchScheduleWithDate(s, date))
}

function isRecurring(recurrence?: string | null): boolean {
  if (!recurrence) return false
  const rec = recurrence.toLowerCase().trim()
  return rec !== '' && rec !== 'none' && rec !== 'does not repeat' && rec !== 'never'
}

function matchScheduleWithDate(s: ScheduleItem, targetDate: Date): boolean {
  if (!s.start_at) return false
  const sDate = new Date(s.start_at)

  // Normalize both to start of day (midnight) in local time
  const targetDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime()
  const sDay = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate()).getTime()

  // Sesi belum mulai jika tanggal target sebelum hari start_at
  if (targetDay < sDay) return false

  // Direct match on start date
  if (targetDay === sDay) return true

  if (!isRecurring(s.recurrence)) {
    return false
  }

  const rec = (s.recurrence || '').toLowerCase().trim()

  // 1. Every day (harian)
  if (
    rec === 'daily' ||
    rec === 'every day' ||
    rec === 'every_day' ||
    rec === 'everyday' ||
    rec.includes('daily') ||
    rec.includes('every day')
  ) {
    return true
  }

  // 2. Every weekday (Mon–Fri)
  if (
    rec === 'weekday' ||
    rec === 'weekdays' ||
    rec === 'every weekday' ||
    rec === 'every_weekday' ||
    rec.includes('weekday') ||
    rec.includes('mon–fri') ||
    rec.includes('mon-fri')
  ) {
    const dayOfWeek = targetDate.getDay() // 0 = Sun, 1 = Mon, ..., 5 = Fri, 6 = Sat
    return dayOfWeek >= 1 && dayOfWeek <= 5
  }

  // 3. Every week (mingguan di hari yang sama)
  if (
    rec === 'weekly' ||
    rec === 'every week' ||
    rec === 'every_week' ||
    rec.includes('week')
  ) {
    return targetDate.getDay() === sDate.getDay()
  }

  // 4. Every month (bulanan di tanggal yang sama)
  if (
    rec === 'monthly' ||
    rec === 'every month' ||
    rec === 'every_month' ||
    rec.includes('month')
  ) {
    return targetDate.getDate() === sDate.getDate()
  }

  // 5. Every year (tahunan)
  if (
    rec === 'yearly' ||
    rec === 'every year' ||
    rec === 'annually' ||
    rec.includes('year')
  ) {
    return targetDate.getMonth() === sDate.getMonth() && targetDate.getDate() === sDate.getDate()
  }

  return false
}

// ── Filtered Schedules ────────────────────────────────────────────────
const filteredSchedules = computed(() => {
  if (!selectedDate.value) return schedules.value
  return schedules.value.filter(s => matchScheduleWithDate(s, selectedDate.value!))
})

// ── Helpers ───────────────────────────────────────────────────────────
function getDotColor(color?: string | null): string {
  switch (color?.toLowerCase()) {
    case 'tomato': return '#EF4444' // red
    case 'sage': return '#10B981' // green
    case 'peacock': return '#3B82F6' // blue
    case 'banana': return '#F59E0B' // amber/yellow
    case 'flamingo': return '#EC4899' // pink
    case 'lavender': return '#8B5CF6' // purple
    case 'basil': return '#059669' // dark green
    default: return '#443E8D'
  }
}

function formatScheduleDate(isoStr?: string): string {
  if (!isoStr) return '-'
  const d = new Date(isoStr)
  return d.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function getDayName(isoStr?: string): string {
  if (!isoStr) return '-'
  const d = new Date(isoStr)
  return d.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'long'
  })
}

function formatRecurrenceLabel(item: ScheduleItem): string {
  if (!item.recurrence) return '-'
  const rec = item.recurrence.toLowerCase().trim()

  // Every day
  if (
    rec === 'daily' ||
    rec === 'every day' ||
    rec === 'every_day' ||
    rec === 'everyday' ||
    rec.includes('daily') ||
    rec.includes('every day')
  ) {
    return 'Setiap hari'
  }

  // Every weekday (Mon–Fri)
  if (
    rec === 'weekday' ||
    rec === 'weekdays' ||
    rec === 'every weekday' ||
    rec === 'every_weekday' ||
    rec.includes('weekday') ||
    rec.includes('mon–fri') ||
    rec.includes('mon-fri')
  ) {
    return 'Setiap hari kerja (Sen–Jum)'
  }

  // Every week
  if (
    rec === 'weekly' ||
    rec === 'every week' ||
    rec === 'every_week' ||
    rec.includes('week')
  ) {
    return `Setiap ${getDayName(item.start_at)}`
  }

  // Every month
  if (
    rec === 'monthly' ||
    rec === 'every month' ||
    rec === 'every_month' ||
    rec.includes('month')
  ) {
    if (item.start_at) {
      const d = new Date(item.start_at)
      return `Setiap bulan (tgl ${d.getDate()})`
    }
    return 'Setiap bulan'
  }

  // Every year
  if (
    rec === 'yearly' ||
    rec === 'every year' ||
    rec === 'annually' ||
    rec.includes('year')
  ) {
    return 'Setiap tahun'
  }

  return `Setiap ${item.recurrence}`
}

function formatDateOnly(d: Date): string {
  return d.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

function formatTimeRange(startIso?: string, endIso?: string): string {
  if (!startIso) return '-'
  const dStart = new Date(startIso)
  const startStr = dStart.toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(':', '.')

  if (!endIso) return startStr

  const dEnd = new Date(endIso)
  const endStr = dEnd.toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace(':', '.')

  return `${startStr} – ${endStr}`
}

function formatNotification(notifs: any): string | null {
  if (!notifs) return null
  try {
    const list = typeof notifs === 'string' ? JSON.parse(notifs) : notifs
    if (Array.isArray(list) && list.length > 0) {
      const first = list[0]
      if (first.minutes === 1440) return 'Email H-1'
      if (first.minutes === 60) return 'Email 1 jam'
      if (first.minutes === 30) return 'Email 30 menit'
      return `Email ${first.minutes}m`
    }
  } catch {
    return null
  }
  return null
}

function copyLink(url?: string | null, id?: string) {
  if (!url || !id) return
  navigator.clipboard.writeText(url)
  copiedId.value = id
  setTimeout(() => {
    copiedId.value = null
  }, 2000)
}

// ── Fetch Teaching Schedules ──────────────────────────────────────────
async function fetchSchedules() {
  isLoading.value = true
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token

    const headers: Record<string, string> = {}
    if (token) headers.Authorization = `Bearer ${token}`

    const res = await $fetch<{
      schedules: ScheduleItem[]
      userEmail: string | null
      total: number
    }>('/api/student/teaching-schedules', { headers })

    schedules.value = res.schedules || []
    userEmail.value = res.userEmail || null

    // If schedules exist, sync calendar view to the month of the first schedule
    if (schedules.value.length > 0 && schedules.value[0].start_at) {
      const firstDate = new Date(schedules.value[0].start_at)
      currentYear.value = firstDate.getFullYear()
      currentMonth.value = firstDate.getMonth()
    }
  } catch (err) {
    console.error('Gagal mengambil jadwal pengajaran:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchSchedules)
</script>