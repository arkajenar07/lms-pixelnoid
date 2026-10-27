<template>
  <main class="py-6 px-4 sm:px-6 lg:px-8 flex flex-col gap-6 mx-auto w-full max-w-[1400px]">

    <!-- ── TOP: WEEKLY CALENDAR STRIP CARD ── -->
    <div class="bg-white rounded-2xl border border-[#E4E4E7] p-4 sm:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-4">

      <!-- Week Header: Navigation Controls & CTA -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <!-- Week Range Title -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#F0EFF9] flex items-center justify-center text-[#443E8D] shrink-0">
            <CalendarDaysIcon class="w-5 h-5" />
          </div>
          <div>
            <h2 class="text-base sm:text-[1.05rem] font-bold text-[#18181B] m-0 leading-tight">
              {{ weekRangeLabel }}
            </h2>
            <p class="text-xs text-[#71717A] m-0 mt-0.5">
              Pilih tanggal dalam minggu ini untuk memfilter jadwal bimbingan
            </p>
          </div>
        </div>

        <!-- Controls: Prev, Current, Next, New Schedule -->
        <div class="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <!-- Reset Selected Date (if filtered) -->
          <button
            v-if="selectedDate"
            @click="selectedDate = null"
            class="h-9 px-3 rounded-xl border border-[#443E8D]/30 bg-[#F0EFF9] text-xs font-semibold text-[#443E8D] hover:bg-[#E5E3F5] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowPathIcon class="w-3.5 h-3.5" />
            <span>Semua Jadwal</span>
          </button>

          <!-- Prev Week -->
          <button
            @click="prevWeek"
            class="h-9 px-2.5 sm:px-3 rounded-xl border border-[#E4E4E7] text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer"
            title="Minggu Sebelumnya"
          >
            <ChevronLeftIcon class="w-4 h-4" />
            <span class="hidden sm:inline">Sebelumnya</span>
          </button>

          <!-- Current Week -->
          <button
            @click="goToCurrentWeek"
            class="h-9 px-3 rounded-xl border border-[#E4E4E7] text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-all text-xs font-semibold cursor-pointer"
          >
            Minggu Ini
          </button>

          <!-- Next Week -->
          <button
            @click="nextWeek"
            class="h-9 px-2.5 sm:px-3 rounded-xl border border-[#E4E4E7] text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer"
            title="Minggu Selanjutnya"
          >
            <span class="hidden sm:inline">Selanjutnya</span>
            <ChevronRightIcon class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- 7 Days Grid (Senin s/d Minggu) -->
      <div class="grid grid-cols-7 gap-1.5 sm:gap-2 text-center pt-2">
        <button
          v-for="d in weekDays"
          :key="d.date.toISOString()"
          type="button"
          @click="toggleSelectWeekDate(d.date)"
          class="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all cursor-pointer relative group border"
          :class="[
            d.isSelected
              ? 'bg-[#443E8D] text-white border-[#443E8D] shadow-sm shadow-[#443E8D]/25 font-bold scale-[1.02]'
              : d.isToday
                ? 'bg-[#F0EFF9] text-[#443E8D] border-[#D8D6F0] font-bold'
                : 'bg-[#FAFAFC] text-[#3F3F46] border-[#E4E4E7] hover:bg-white hover:border-[#D4D4D8]'
          ]"
        >
          <!-- Day Name (Sen, Sel, Rab, Kam, Jum, Sab, Min) -->
          <span
            class="text-[0.68rem] font-semibold uppercase tracking-wider mb-1"
            :class="d.isSelected ? 'text-white/80' : d.isToday ? 'text-[#443E8D]' : 'text-[#71717A]'"
          >
            {{ d.dayName }}
          </span>

          <!-- Day Number (14, 15, 16, ...) -->
          <span
            class="text-base sm:text-lg font-bold leading-none"
            :class="d.isSelected ? 'text-white' : d.isToday ? 'text-[#443E8D]' : 'text-[#18181B]'"
          >
            {{ d.dayNumber }}
          </span>

          <!-- Dot indicator for schedules -->
          <div class="h-2 flex items-center justify-center mt-1">
            <span
              v-if="d.hasSchedule"
              class="w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-125"
              :class="d.isSelected ? 'bg-white' : 'bg-[#443E8D]'"
            ></span>
          </div>
        </button>
      </div>
    </div>

    <!-- ── BOTTOM: SCHEDULE CARDS SECTION (MOBILE-FRIENDLY) ── -->
    <div class="flex flex-col gap-4">

      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h3 class="text-[0.95rem] sm:text-base font-bold text-[#18181B] m-0">
            {{ selectedDate ? `Jadwal: ${formatDateOnly(selectedDate)}` : 'Semua Jadwal' }}
          </h3>
          <p class="text-xs text-[#71717A] m-0 mt-0.5">
            {{ filteredSchedules.length }} sesi ditemukan
            <span v-if="userEmail" class="text-[#443E8D] font-medium">· untuk {{ userEmail }}</span>
          </p>
        </div>

        <button
          v-if="selectedDate"
          @click="selectedDate = null"
          class="text-xs font-semibold text-[#443E8D] hover:underline self-start sm:self-auto cursor-pointer flex items-center gap-1"
        >
          <ArrowPathIcon class="w-3.5 h-3.5" />
          <span>Lihat Semua Jadwal</span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white rounded-2xl border border-[#E4E4E7] p-12 flex flex-col items-center justify-center gap-3">
        <div class="w-6 h-6 border-2 border-[#443E8D] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-xs text-[#71717A] font-medium">Memuat jadwal mengajar...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredSchedules.length === 0" class="bg-white rounded-2xl border border-[#E4E4E7] p-10 sm:p-14 text-center">
        <div class="w-14 h-14 rounded-2xl bg-[#F0EFF9] flex items-center justify-center text-2xl text-[#443E8D] mx-auto mb-3">
          📅
        </div>
        <p class="text-sm font-bold text-[#18181B] m-0">Tidak ada jadwal pada tanggal ini</p>
        <p class="text-xs text-[#71717A] mt-1 max-w-sm mx-auto leading-relaxed">
          {{ selectedDate
              ? 'Coba pilih tanggal lain pada kalender mingguan atau klik tombol di bawah untuk melihat seluruh jadwal.'
              : 'Belum ada jadwal sesi yang ditujukan untuk email akun kamu.' }}
        </p>
        <button
          v-if="selectedDate"
          @click="selectedDate = null"
          class="mt-4 text-xs font-semibold px-4 py-2 rounded-xl bg-[#443E8D] text-white hover:bg-[#373273] transition-colors cursor-pointer"
        >
          Tampilkan Semua Jadwal
        </button>
      </div>

      <!-- Schedule Cards List -->
      <div v-else class="grid grid-cols-1 gap-3.5">
        <div
          v-for="item in filteredSchedules"
          :key="item.id"
          class="bg-white rounded-2xl border border-[#E4E4E7] p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:border-[#D4D4D8] hover:shadow-md transition-all flex flex-col gap-4 group"
        >
          <!-- Top Row: Time Badge, Recurring Info & Google Sync Status -->
          <div class="flex items-center justify-between gap-2 flex-wrap">
            <div class="flex items-center gap-2 flex-wrap">
              <!-- Color Indicator Dot -->
              <span
                class="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                :style="{ backgroundColor: getDotColor(item.color) }"
              ></span>

              <!-- Waktu / Recurring Badge -->
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F0EFF9] text-[#443E8D]">
                <ArrowPathIcon v-if="isRecurring(item.recurrence)" class="w-3.5 h-3.5 shrink-0" />
                <CalendarDaysIcon v-else class="w-3.5 h-3.5 shrink-0" />
                <span>{{ isRecurring(item.recurrence) ? formatRecurrenceLabel(item) : formatScheduleDate(item.start_at) }}</span>
              </span>

              <!-- Clock Time Range -->
              <span class="text-xs text-[#71717A] font-medium flex items-center gap-1">
                <ClockIcon class="w-3.5 h-3.5 text-[#A1A1AA] shrink-0" />
                <span>{{ formatTimeRange(item.start_at, item.end_at) }}</span>
              </span>
            </div>


          </div>

          <!-- Middle Row: Title & Description -->
          <div>
            <h4 class="text-sm sm:text-base font-bold text-[#18181B] leading-snug group-hover:text-[#443E8D] transition-colors m-0">
              {{ item.title }}
            </h4>
            <p v-if="item.description" class="text-xs text-[#71717A] mt-1.5 leading-relaxed m-0">
              {{ item.description }}
            </p>
          </div>

          <!-- Subtle Divider -->
          <div class="h-px bg-[#F4F4F5] -mx-4 sm:-mx-5"></div>

          <!-- Bottom Row: Mentor/Student Details & Action Buttons -->
          <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pt-0.5">
            <!-- Mentor & Students stacked -->
            <div class="flex flex-col gap-1.5 min-w-0 flex-1">
              <!-- Mentor row -->
              <div v-if="item.mentor || item.mentor_email" class="flex items-center gap-2">
                <span class="text-[0.65rem] font-bold uppercase tracking-wider text-[#A1A1AA] w-12 shrink-0">Mentor</span>
                <span class="w-6 h-6 rounded-full bg-[#443E8D] text-white font-bold text-[0.6rem] flex items-center justify-center shrink-0 overflow-hidden">
                  <img v-if="item.mentor?.avatar_url" :src="item.mentor.avatar_url" class="w-full h-full object-cover" />
                  <span v-else>{{ (item.mentor?.fullname || item.mentor_email || 'M')[0].toUpperCase() }}</span>
                </span>
                <span class="text-[0.82rem] font-semibold text-[#18181B]">{{ item.mentor?.fullname || item.mentor_email }}</span>
              </div>

              <!-- Students row -->
              <div v-if="(item.students && item.students.length > 0) || item.student_emails?.length" class="flex items-center gap-2 flex-wrap">
                <span class="text-[0.65rem] font-bold uppercase tracking-wider text-[#A1A1AA] w-12 shrink-0">Murid</span>
                <template v-if="item.students && item.students.length > 0">
                  <div v-for="st in item.students" :key="st.email || st.fullname" class="flex items-center gap-1.5">
                    <span class="w-6 h-6 rounded-full bg-[#E8E7F5] text-[#443E8D] font-bold text-[0.6rem] flex items-center justify-center shrink-0 overflow-hidden">
                      <img v-if="st.avatar_url" :src="st.avatar_url" class="w-full h-full object-cover" />
                      <span v-else>{{ (st.fullname || 'S')[0].toUpperCase() }}</span>
                    </span>
                    <span class="text-[0.82rem] font-medium text-[#18181B]">{{ st.fullname }}</span>
                  </div>
                </template>
                <template v-else>
                  <div v-for="email in item.student_emails" :key="email" class="flex items-center gap-1.5">
                    <span class="w-6 h-6 rounded-full bg-[#E8E7F5] text-[#443E8D] font-bold text-[0.6rem] flex items-center justify-center shrink-0">?</span>
                    <span class="text-[0.82rem] font-medium text-[#18181B]">{{ email }}</span>
                  </div>
                </template>
              </div>
            </div>

            <!-- Action Buttons: Meet Link & Copy -->
            <div v-if="item.meet_link" class="flex items-center gap-2 shrink-0">
              <a
                :href="item.meet_link"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#443E8D] text-white text-xs font-semibold hover:bg-[#373273] transition-all shadow-xs hover:-translate-y-0.5 no-underline"
              >
                <VideoCameraIcon class="w-4 h-4" />
                <span>Join Meet</span>
              </a>
              <button
                type="button"
                @click="copyLink(item.meet_link, item.id)"
                class="px-3 py-2 rounded-xl border border-[#E4E4E7] bg-white text-xs font-semibold text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F4F5] transition-colors cursor-pointer"
              >
                {{ copiedId === item.id ? 'Tersalin!' : 'Copy' }}
              </button>
            </div>
          </div>
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
  ArrowPathIcon,
  VideoCameraIcon,
  ClockIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

interface UserProfileSummary {
  id?: string
  fullname?: string
  username?: string
  email: string
  avatar_url?: string | null
  whatsapp?: string | null
  pekerjaan?: string | null
  instansi?: string | null
}

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
  mentor?: UserProfileSummary | null
  students?: UserProfileSummary[]
}

const supabase = useSupabaseClient()

// ── State ─────────────────────────────────────────────────────────────
const isLoading = ref(true)
const schedules = ref<ScheduleItem[]>([])
const userEmail = ref<string | null>(null)
const copiedId = ref<string | null>(null)

// ── Weekly Calendar Navigation State ───────────────────────────────────
// Mengambil awal minggu (Senin sebagai hari pertama)
function getStartOfWeek(d: Date): Date {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const day = date.getDay() // 0 = Sun, 1 = Mon, ..., 6 = Sat
  // Menjadikan Senin sebagai hari pertama (0 = Mon, 6 = Sun)
  const diff = (day === 0 ? -6 : 1) - day
  date.setDate(date.getDate() + diff)
  date.setHours(0, 0, 0, 0)
  return date
}

const currentWeekStart = ref<Date>(getStartOfWeek(new Date()))
const selectedDate = ref<Date | null>(null)

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

// Label rentang minggu (misal: "14 – 20 September 2026")
const weekRangeLabel = computed(() => {
  const start = currentWeekStart.value
  const end = new Date(start)
  end.setDate(end.getDate() + 6)

  const startMonth = monthNames[start.getMonth()]
  const endMonth = monthNames[end.getMonth()]

  if (start.getFullYear() !== end.getFullYear()) {
    return `${start.getDate()} ${startMonth} ${start.getFullYear()} – ${end.getDate()} ${endMonth} ${end.getFullYear()}`
  }
  if (start.getMonth() !== end.getMonth()) {
    return `${start.getDate()} ${startMonth} – ${end.getDate()} ${endMonth} ${start.getFullYear()}`
  }
  return `${start.getDate()} – ${end.getDate()} ${startMonth} ${start.getFullYear()}`
})

// Daftar 7 hari dalam minggu aktif
const weekDays = computed(() => {
  const days: {
    date: Date
    dayName: string
    dayNumber: number
    isToday: boolean
    isSelected: boolean
    hasSchedule: boolean
  }[] = []

  const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
  const todayStr = new Date().toDateString()
  const selectedStr = selectedDate.value ? selectedDate.value.toDateString() : null

  for (let i = 0; i < 7; i++) {
    const d = new Date(currentWeekStart.value)
    d.setDate(d.getDate() + i)
    days.push({
      date: d,
      dayName: dayNames[i],
      dayNumber: d.getDate(),
      isToday: d.toDateString() === todayStr,
      isSelected: selectedStr === d.toDateString(),
      hasSchedule: schedules.value.some(s => matchScheduleWithDate(s, d))
    })
  }
  return days
})

function prevWeek() {
  const d = new Date(currentWeekStart.value)
  d.setDate(d.getDate() - 7)
  currentWeekStart.value = d
}

function nextWeek() {
  const d = new Date(currentWeekStart.value)
  d.setDate(d.getDate() + 7)
  currentWeekStart.value = d
}

function goToCurrentWeek() {
  currentWeekStart.value = getStartOfWeek(new Date())
}

function toggleSelectWeekDate(targetDate: Date) {
  if (selectedDate.value && selectedDate.value.toDateString() === targetDate.toDateString()) {
    // Klik lagi untuk reset ke semua jadwal
    selectedDate.value = null
  } else {
    selectedDate.value = targetDate
  }
}

// ── Match Schedule with Date ──────────────────────────────────────────
function isRecurring(recurrence?: string | null): boolean {
  if (!recurrence) return false
  const rec = recurrence.toLowerCase().trim()
  return rec !== '' && rec !== 'none' && rec !== 'does not repeat' && rec !== 'never'
}

function matchScheduleWithDate(s: ScheduleItem, targetDate: Date): boolean {
  if (!s.start_at) return false
  const sDate = new Date(s.start_at)

  // Normalize to start of day (midnight) in local time
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

  if (
    rec === 'weekly' ||
    rec === 'every week' ||
    rec === 'every_week' ||
    rec.includes('week')
  ) {
    return `Setiap ${getDayName(item.start_at)}`
  }

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

    // Jika ada jadwal, arahkan kalender mingguan ke minggu terdekat yang memiliki jadwal
    if (schedules.value.length > 0 && schedules.value[0].start_at) {
      const firstDate = new Date(schedules.value[0].start_at)
      currentWeekStart.value = getStartOfWeek(firstDate)
    }
  } catch (err) {
    console.error('Gagal mengambil jadwal pengajaran:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchSchedules)
</script>