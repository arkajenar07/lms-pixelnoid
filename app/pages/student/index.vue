<template>
  <div
    class="flex min-h-screen bg-[#F7F7F9] text-[#111827] antialiased overflow-x-hidden"
    style="font-family: 'Instrument Sans', Raleway, sans-serif"
  >
    <Sidebar :open="sidebarOpen" @update:open="sidebarOpen = $event" />

    <div class="flex-1 w-full min-w-0 min-[900px]:ml-[210px] relative z-[1]">
      <header class="sticky top-0 z-[100] flex w-full items-center justify-between gap-4 px-8 py-5 max-[900px]:px-5 max-[900px]:py-4 bg-white/[0.92] backdrop-blur-[14px] [-webkit-backdrop-filter:blur(14px)] border-b border-[#E4E4E7]">
        <div class="flex items-center gap-3 sm:gap-4 w-full max-w-[1440px] mx-auto">
          <button
            class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E4E4E7] text-[#52525B] transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#CFCFE0] hover:text-[#443E8D] min-[900px]:hidden"
            @click="sidebarOpen = !sidebarOpen"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon class="h-5 w-5" />
          </button>

          <div class="min-w-0 flex-1">
            <h1 class="text-[0.95rem] sm:text-[1.1rem] font-semibold leading-snug tracking-[-0.02em] text-[#171717] lg:text-[1.15rem]">
              Halo, <span class="text-[#443E8D]">{{ studentName }}</span><span class="hidden sm:inline">. Siap lanjut belajar hari ini?</span>
              <span class="sm:hidden">! 👋</span>
            </h1>
            <p class="mt-0.5 sm:mt-1 text-[0.7rem] sm:text-[0.82rem] leading-relaxed text-[#71717A]">
              {{ todayStr }}
            </p>
          </div>
        </div>
      </header>

      <main class="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-8 max-[900px]:p-5">

        <!-- Progress Cards -->
        <section class="grid gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="stat in summaryStats"
            :key="stat.label"
            class="rounded-2xl border border-[#E4E4E7] bg-white p-4 transition-transform duration-200 hover:-translate-y-0.5 shadow-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-[0.65rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#71717A]">
                  {{ stat.label }}
                </p>
                <p class="mt-1.5 sm:mt-2 text-[1.35rem] font-semibold tracking-[-0.03em] text-[#18181B]">
                  <span v-if="loading" class="animate-pulse text-[#E4E4E7]">—</span>
                  <span v-else>{{ stat.value }}</span>
                </p>
                <p class="mt-0.5 sm:mt-1 text-[0.75rem] sm:text-[0.8rem] text-[#71717A]">{{ stat.hint }}</p>
              </div>
              <div class="flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center rounded-2xl border border-[#ECECF1] bg-[#FAFAFB] text-[#443E8D] shrink-0">
                <component :is="stat.icon" class="h-4 sm:h-5 w-4 sm:w-5" />
              </div>
            </div>
            <div v-if="stat.progress !== undefined" class="mt-3">
              <div class="h-1.5 rounded-full bg-[#F1F1F4]">
                <div
                  class="h-full rounded-full bg-[#443E8D] transition-[width] duration-700 ease-out"
                  :style="{ width: `${stat.progress}%` }"
                />
              </div>
            </div>
          </article>
        </section>

        <section class="grid gap-5 lg:grid-cols-2 lg:gap-4">
          <!-- Reminders: Upcoming Sessions -->
          <article class="rounded-2xl border border-[#E4E4E7] bg-white p-4 sm:p-5 lg:p-6 shadow-sm">
            <div class="flex items-center gap-2 text-[#443E8D] mb-5">
              <CalendarIcon class="h-5 w-5" />
              <h2 class="text-[0.95rem] font-semibold">Sesi Mendatang</h2>
              <span v-if="!loading && upcomingSessions.length > 0" class="ml-auto text-[0.7rem] font-semibold bg-[#443E8D]/10 text-[#443E8D] px-2 py-0.5 rounded-full">
                {{ upcomingSessions.length }} sesi
              </span>
            </div>

            <div v-if="loading" class="space-y-3">
              <div v-for="i in 2" :key="i" class="h-16 rounded-xl bg-[#F4F4F6] animate-pulse" />
            </div>

            <div v-else-if="upcomingSessions.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
              <CalendarIcon class="h-10 w-10 text-[#D4D4D8] mb-3" />
              <p class="text-[0.85rem] font-medium text-[#71717A]">Belum ada sesi terjadwal</p>
              <p class="text-[0.75rem] text-[#A1A1AA] mt-1">Sesi baru akan muncul di sini</p>
            </div>

            <div v-else class="space-y-3">
              <div
                v-for="session in upcomingSessions.slice(0, 4)"
                :key="session.id"
                class="group flex items-start gap-3 rounded-xl border border-[#ECECF1] bg-gradient-to-br from-[#FAFAFB] to-white p-3 transition-all duration-200 hover:border-[#443E8D]/20 hover:shadow-sm hover:-translate-y-0.5"
              >
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#443E8D]/10 text-[#443E8D] font-bold text-[0.8rem]">
                  {{ session.mentor_initials || '?' }}
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-[0.85rem] font-semibold text-[#18181B] truncate">{{ session.topic }}</p>
                  <p class="mt-0.5 text-[0.72rem] text-[#71717A]">{{ session.mentor_name }}</p>
                  <div class="mt-1 flex items-center gap-1.5 text-[0.68rem] text-[#A1A1AA]">
                    <ClockIcon class="h-3 w-3 shrink-0" />
                    <span>{{ session.day }} · {{ session.time }}</span>
                  </div>
                </div>
                <span class="mt-0.5 rounded-md bg-[#443E8D]/10 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide text-[#443E8D] whitespace-nowrap">
                  {{ session.type === 'main_class' ? 'Main' : session.type === 'micro_session' ? 'Micro' : 'Casual' }}
                </span>
              </div>
            </div>
          </article>

          <!-- Reminders: Pending Assignments -->
          <article class="rounded-2xl border border-[#E4E4E7] bg-white p-4 sm:p-5 lg:p-6 shadow-sm">
            <div class="flex items-center gap-2 text-[#443E8D] mb-5">
              <ClipboardDocumentCheckIcon class="h-5 w-5" />
              <h2 class="text-[0.95rem] font-semibold">Tugas Pending</h2>
              <span v-if="!loading && pendingAssignments.length > 0" class="ml-auto text-[0.7rem] font-semibold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                {{ pendingAssignments.length }} tugas
              </span>
            </div>

            <div v-if="loading" class="space-y-3">
              <div v-for="i in 3" :key="i" class="h-14 rounded-xl bg-[#F4F4F6] animate-pulse" />
            </div>

            <div v-else-if="pendingAssignments.length === 0" class="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircleIcon class="h-10 w-10 text-emerald-300 mb-3" />
              <p class="text-[0.85rem] font-medium text-[#71717A]">Semua tugas selesai! 🎉</p>
              <p class="text-[0.75rem] text-[#A1A1AA] mt-1">Tidak ada tugas yang tertunda</p>
            </div>

            <div v-else class="space-y-2.5">
              <div
                v-for="task in pendingAssignments.slice(0, 5)"
                :key="task.id"
                class="group flex items-start gap-3 rounded-xl border border-[#ECECF1] bg-gradient-to-br from-[#FAFAFB] to-white p-3 transition-all duration-200 hover:border-orange-200 hover:shadow-sm hover:-translate-y-0.5"
              >
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                  <ClipboardDocumentCheckIcon class="h-4 w-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-[0.85rem] font-semibold text-[#18181B] truncate">{{ task.assignments?.title || 'Tugas' }}</p>
                  <div class="mt-0.5 flex items-center gap-2">
                    <span class="text-[0.68rem] font-medium uppercase tracking-wide rounded px-1.5 py-0.5"
                      :class="task.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'">
                      {{ task.status === 'pending' ? 'Belum mulai' : 'Dikirim' }}
                    </span>
                    <span v-if="task.assignments?.due_date" class="text-[0.68rem] text-[#A1A1AA]">
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
          <article class="rounded-2xl border border-[#E4E4E7] bg-white p-4 sm:p-5 lg:p-6 shadow-sm">
            <div class="flex items-center justify-between gap-3 mb-5">
              <div class="flex items-center gap-2 text-[#443E8D]">
                <ChartBarIcon class="h-5 w-5" />
                <h2 class="text-[0.95rem] font-semibold">Progress Tugas</h2>
              </div>
              <span v-if="!loading" class="text-[0.75rem] font-semibold text-[#443E8D]">
                {{ metrics.reviewed }}/{{ metrics.total }} selesai
              </span>
            </div>

            <div v-if="loading" class="space-y-4">
              <div v-for="i in 3" :key="i" class="h-8 rounded-xl bg-[#F4F4F6] animate-pulse" />
            </div>

            <div v-else class="space-y-4">
              <div v-for="bar in progressBars" :key="bar.label">
                <div class="mb-2 flex items-center justify-between text-[0.75rem] font-semibold text-[#71717A]">
                  <span>{{ bar.label }}</span>
                  <span :class="bar.color.replace('bg-', 'text-')">{{ bar.value }} ({{ bar.pct }}%)</span>
                </div>
                <div class="h-2 rounded-full bg-[#F1F1F4]">
                  <div
                    class="h-full rounded-full transition-[width] duration-700 ease-out"
                    :class="bar.color"
                    :style="{ width: `${bar.pct}%` }"
                  />
                </div>
              </div>

              <div v-if="metrics.averageGrade !== null" class="pt-3 border-t border-[#F1F1F4] flex items-center justify-between">
                <span class="text-[0.78rem] text-[#71717A]">Rata-rata nilai</span>
                <span class="text-[0.85rem] font-bold text-[#443E8D]">{{ metrics.averageGrade }}/100</span>
              </div>
            </div>
          </article>
        </section>

      </main>
    </div>

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-[150] bg-[rgba(15,23,42,0.14)] backdrop-blur-[2px] min-[900px]:hidden"
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
  // Get session for auth headers
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  studentName.value = user?.user_metadata?.fullname || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Siswa'
  const token = session?.access_token
  try {
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}

    const [sessionsRes, assignmentsRes] = await Promise.allSettled([
      $fetch<any>('/api/student/mentorship-sessions', { headers }),
      $fetch<any>('/api/student/assignments', { headers }),
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
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
</style>
