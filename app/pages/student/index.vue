<template>
  <div
    class="flex min-h-screen bg-[#F7F7F9] text-[#111827] antialiased overflow-x-clip"
    style="font-family: 'Instrument Sans', Raleway, sans-serif"
  >
    <Sidebar :open="sidebarOpen" @update:open="sidebarOpen = $event" />

    <!-- Sidebar Wrapper: Menggunakan breakpoint lg: bawaan Tailwind -->
    <div class="relative z-[1] flex-1 w-full min-w-0 lg:ml-[210px]">
      
      <!-- Header -->
      <!-- Header -->
      <header class="sticky top-0 z-[100] flex w-full flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4 px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8 lg:py-5 bg-white/[0.92] backdrop-blur-[14px] [-webkit-backdrop-filter:blur(14px)] border-b border-[#E4E4E7]">
        <div class="mx-auto flex w-full max-w-7xl flex-col gap-1 min-w-0">
          <!-- Baris 1: Tombol menu di kiri, judul di sebelahnya -->
          <div class="flex items-center gap-3 min-w-0">
            <!-- Tombol Hamburger (Hanya tampil di bawah ukuran lg) -->
            <button
              class="inline-flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-[#E4E4E7] text-[#52525B] transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#CFCFE0] hover:text-[#443E8D] lg:hidden cursor-pointer"
              @click="sidebarOpen = !sidebarOpen"
              aria-label="Toggle sidebar"
            >
              <Bars3Icon class="w-5 h-5" />
            </button>

            <!-- Judul Header -->
            <h1 class="truncate text-[1.05rem] sm:text-[1.15rem] font-semibold leading-snug tracking-tight text-[#171717] lg:text-xl">
              Halo, <span class="text-[#443E8D]">{{ studentName }}</span>
              <span class="hidden sm:inline">. Siap lanjut belajar hari ini?</span>
              <span class="sm:hidden">! 👋</span>
            </h1>
          </div>

          <!-- Baris 2: Subtitle / Tanggal selebar layar -->
          <p class="text-[0.75rem] sm:text-[0.82rem] leading-relaxed text-[#71717A] w-full m-0">
            {{ todayStr }}
          </p>
        </div>
      </header>

      <!-- Main Content -->
      <main class="mx-auto flex w-full max-w-7xl flex-col gap-6 p-5 lg:p-8">

        <!-- Progress Cards (Responsive Grid) -->
        <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <article
            v-for="stat in summaryStats"
            :key="stat.label"
            class="rounded-2xl border border-[#E4E4E7] bg-white p-4 shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-xs font-semibold uppercase tracking-wider text-[#71717A]">
                  {{ stat.label }}
                </p>
                <p class="mt-2 text-2xl font-semibold tracking-tight text-[#18181B]">
                  <span v-if="loading" class="animate-pulse text-[#E4E4E7]">—</span>
                  <span v-else>{{ stat.value }}</span>
                </p>
                <p class="mt-1 truncate text-xs text-[#71717A]">{{ stat.hint }}</p>
              </div>
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#ECECF1] bg-[#FAFAFB] text-[#443E8D]">
                <component :is="stat.icon" class="h-5 w-5" />
              </div>
            </div>
            <div v-if="stat.progress !== undefined" class="mt-3">
              <div class="h-1.5 w-full overflow-hidden rounded-full bg-[#F1F1F4]">
                <div
                  class="h-full rounded-full bg-[#443E8D] transition-all duration-700 ease-out"
                  :style="{ width: `${stat.progress}%` }"
                />
              </div>
            </div>
          </article>
        </section>

        <!-- Sesi & Tugas (Responsive Grid 2 Kolom di Desktop) -->
        <section class="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
          
          <!-- Reminders: Upcoming Sessions -->
          <article class="flex h-full flex-col rounded-2xl border border-[#E4E4E7] bg-white p-5 shadow-sm lg:p-6">
            <div class="mb-5 flex items-center gap-2 text-[#443E8D]">
              <CalendarIcon class="h-5 w-5" />
              <h2 class="text-base font-semibold text-[#18181B]">Sesi Mendatang</h2>
              <span v-if="!loading && upcomingSessions.length > 0" class="ml-auto rounded-full bg-[#443E8D]/10 px-2 py-0.5 text-xs font-semibold text-[#443E8D]">
                {{ upcomingSessions.length }} sesi
              </span>
            </div>

            <div v-if="loading" class="flex-1 space-y-3">
              <div v-for="i in 2" :key="i" class="h-16 rounded-xl bg-[#F4F4F6] animate-pulse" />
            </div>

            <div v-else-if="upcomingSessions.length === 0" class="flex flex-1 flex-col items-center justify-center py-8 text-center">
              <CalendarIcon class="mb-3 h-10 w-10 text-[#D4D4D8]" />
              <p class="text-sm font-medium text-[#71717A]">Belum ada sesi terjadwal</p>
              <p class="mt-1 text-xs text-[#A1A1AA]">Sesi baru akan muncul di sini</p>
            </div>

            <div v-else class="flex-1 space-y-3">
              <div
                v-for="session in upcomingSessions.slice(0, 4)"
                :key="session.id"
                class="group flex items-start gap-3 rounded-xl border border-[#ECECF1] bg-gradient-to-br from-[#FAFAFB] to-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#443E8D]/20 hover:shadow-sm"
              >
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#443E8D]/10 text-xs font-bold text-[#443E8D]">
                  {{ session.mentor_initials || '?' }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-[#18181B]">{{ session.topic }}</p>
                  <p class="mt-0.5 truncate text-xs text-[#71717A]">{{ session.mentor_name }}</p>
                  <div class="mt-1 flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                    <ClockIcon class="h-3.5 w-3.5 shrink-0" />
                    <span>{{ session.day }} · {{ session.time }}</span>
                  </div>
                </div>
                <span class="mt-0.5 shrink-0 rounded-md bg-[#443E8D]/10 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-[#443E8D]">
                  {{ session.type === 'main_class' ? 'Main' : session.type === 'micro_session' ? 'Micro' : 'Casual' }}
                </span>
              </div>
            </div>
          </article>

          <!-- Reminders: Pending Assignments -->
          <article class="flex h-full flex-col rounded-2xl border border-[#E4E4E7] bg-white p-5 shadow-sm lg:p-6">
            <div class="mb-5 flex items-center gap-2 text-[#443E8D]">
              <ClipboardDocumentCheckIcon class="h-5 w-5" />
              <h2 class="text-base font-semibold text-[#18181B]">Tugas Pending</h2>
              <span v-if="!loading && pendingAssignments.length > 0" class="ml-auto rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">
                {{ pendingAssignments.length }} tugas
              </span>
            </div>

            <div v-if="loading" class="flex-1 space-y-3">
              <div v-for="i in 3" :key="i" class="h-14 rounded-xl bg-[#F4F4F6] animate-pulse" />
            </div>

            <div v-else-if="pendingAssignments.length === 0" class="flex flex-1 flex-col items-center justify-center py-8 text-center">
              <CheckCircleIcon class="mb-3 h-10 w-10 text-emerald-300" />
              <p class="text-sm font-medium text-[#71717A]">Semua tugas selesai! 🎉</p>
              <p class="mt-1 text-xs text-[#A1A1AA]">Tidak ada tugas yang tertunda</p>
            </div>

            <div v-else class="flex-1 space-y-3">
              <div
                v-for="task in pendingAssignments.slice(0, 5)"
                :key="task.id"
                class="group flex items-start gap-3 rounded-xl border border-[#ECECF1] bg-gradient-to-br from-[#FAFAFB] to-white p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-sm"
              >
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <ClipboardDocumentCheckIcon class="h-5 w-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-[#18181B]">{{ task.assignments?.title || 'Tugas' }}</p>
                  <div class="mt-1 flex flex-wrap items-center gap-2">
                    <span class="rounded px-1.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide"
                      :class="task.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'">
                      {{ task.status === 'pending' ? 'Belum mulai' : 'Dikirim' }}
                    </span>
                    <span v-if="task.assignments?.due_date" class="text-xs text-[#A1A1AA]">
                      Tenggat: {{ formatDate(task.assignments.due_date) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </section>

        <!-- Assignment Progress Bar -->
        <section>
          <article class="rounded-2xl border border-[#E4E4E7] bg-white p-5 shadow-sm lg:p-6">
            <div class="mb-5 flex items-center justify-between gap-3">
              <div class="flex items-center gap-2 text-[#443E8D]">
                <ChartBarIcon class="h-5 w-5" />
                <h2 class="text-base font-semibold text-[#18181B]">Progress Tugas</h2>
              </div>
              <span v-if="!loading" class="text-sm font-semibold text-[#443E8D]">
                {{ metrics.reviewed }}/{{ metrics.total }} selesai
              </span>
            </div>

            <div v-if="loading" class="space-y-4">
              <div v-for="i in 3" :key="i" class="h-8 rounded-xl bg-[#F4F4F6] animate-pulse" />
            </div>

            <div v-else class="space-y-5">
              <div v-for="bar in progressBars" :key="bar.label">
                <div class="mb-2 flex items-center justify-between text-sm font-medium text-[#71717A]">
                  <span>{{ bar.label }}</span>
                  <span :class="bar.color.replace('bg-', 'text-')" class="font-semibold">{{ bar.value }} ({{ bar.pct }}%)</span>
                </div>
                <div class="h-2.5 w-full overflow-hidden rounded-full bg-[#F1F1F4]">
                  <div
                    class="h-full rounded-full transition-all duration-700 ease-out"
                    :class="bar.color"
                    :style="{ width: `${bar.pct}%` }"
                  />
                </div>
              </div>

              <div v-if="metrics.averageGrade !== null" class="mt-4 flex items-center justify-between border-t border-[#F1F1F4] pt-4">
                <span class="text-sm font-medium text-[#71717A]">Rata-rata nilai</span>
                <span class="text-lg font-bold text-[#443E8D]">{{ metrics.averageGrade }}/100</span>
              </div>
            </div>
          </article>
        </section>

      </main>
    </div>

    <!-- Overlay Sidebar untuk layar mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-[150] bg-slate-900/20 backdrop-blur-sm lg:hidden"
      @click="sidebarOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import Sidebar from '~/components/student/StudentSidebar.vue'
import {
  Bars3Icon,
  CalendarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
} from '@heroicons/vue/24/outline'

const supabase = useSupabaseClient()

useSeoMeta({
  title: 'Dashboard – Pixelnoid Academy',
  description: 'Pantau jadwal sesi, tugas, dan progress belajar di Pixelnoid Academy.',
})

definePageMeta({ layout: 'dashboard' })

const sidebarOpen = ref(false)
const loading = ref(true)

const studentName = ref('Siswa')

const todayStr = new Date().toLocaleDateString('id-ID', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
})

// Data from APIs
const upcomingSessions = ref<any[]>([])
const pendingAssignments = ref<any[]>([])
const metrics = ref({ total: 0, pending: 0, submitted: 0, reviewed: 0, averageGrade: null as number | null })

const formatDate = (d: string) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  
  studentName.value = user?.user_metadata?.fullname || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Siswa'
  const token = session?.access_token
  
  try {
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

    const [sessionsRes, assignmentsRes] = await Promise.allSettled([
      $fetch<any>('/api/student/mentorship-sessions', { headers }),$fetch<any>('/api/student/assignments', { headers }),
    ])

    if (sessionsRes.status === 'fulfilled') {
      upcomingSessions.value = sessionsRes.value?.upcomingSessions || []
    }

    if (assignmentsRes.status === 'fulfilled') {
      const data = assignmentsRes.value
      metrics.value = data?.metrics || metrics.value
      pendingAssignments.value = (data?.assignments || []).filter(
        (a: any) => a.status === 'pending' || a.status === 'submitted'
      )
    }
  } catch (e) {
    console.error('Dashboard fetch error:', e)
  } finally {
    loading.value = false
  }
})

const progressBars = computed(() => {
  const total = metrics.value.total || 1
  return [
    { label: 'Selesai (Reviewed)', value: metrics.value.reviewed, pct: Math.round((metrics.value.reviewed / total) * 100), color: 'bg-[#443E8D]' },
    { label: 'Dikumpulkan', value: metrics.value.submitted, pct: Math.round((metrics.value.submitted / total) * 100), color: 'bg-blue-400' },
    { label: 'Belum Dikerjakan', value: metrics.value.pending, pct: Math.round((metrics.value.pending / total) * 100), color: 'bg-orange-400' },
  ]
})

const summaryStats = computed(() => [
  {
    label: 'Total Tugas',
    value: loading.value ? '—' : String(metrics.value.total),
    hint: 'Semua tugas',
    icon: ClipboardDocumentCheckIcon,
    progress: metrics.value.total > 0 ? Math.round((metrics.value.reviewed / metrics.value.total) * 100) : 0,
  },
  {
    label: 'Selesai',
    value: loading.value ? '—' : String(metrics.value.reviewed),
    hint: 'Tugas diulas mentor',
    icon: CheckCircleIcon,
  },
  {
    label: 'Pending',
    value: loading.value ? '—' : String(metrics.value.pending),
    hint: 'Belum dikerjakan',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    label: 'Sesi Upcoming',
    value: loading.value ? '—' : String(upcomingSessions.value.length),
    hint: 'Sesi terjadwal',
    icon: CalendarIcon,
  },
])
</script>

<style scoped>
/* Scrollbar dihilangkan secara halus jika ada konten yang perlu digeser */
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
</style>