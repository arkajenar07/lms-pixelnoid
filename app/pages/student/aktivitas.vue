<template>
  <div
    class="flex min-h-screen bg-[#F7F7F9] antialiased relative overflow-x-clip"
    style="font-family: 'Instrument Sans', Raleway, sans-serif"
  >
    <!-- Sidebar -->
    <StudentSidebar :open="sidebarOpen" @update:open="sidebarOpen = $event" />

    <!-- Main wrap -->
    <div class="flex-1 w-full min-w-0 max-w-full min-[901px]:ml-[210px] flex flex-col relative z-[1]">

      <!-- ── TOPBAR ── -->
      <header class="sticky top-0 z-[100] flex w-full flex-col min-[901px]:flex-row min-[901px]:items-center min-[901px]:justify-between gap-3 min-[901px]:gap-4 px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8 lg:py-5 bg-white/[0.92] backdrop-blur-[14px] [-webkit-backdrop-filter:blur(14px)] border-b border-[#E4E4E7]">
        <div class="flex flex-col min-[901px]:flex-row min-[901px]:items-center min-[901px]:justify-between gap-3 min-[901px]:gap-4 w-full max-w-[1440px] mx-auto min-w-0">
          
          <!-- Baris 1 & 2: Menu + Judul, lalu Deskripsi selebar layar -->
          <div class="flex flex-col gap-1 min-w-0 flex-1">
            <!-- Baris 1: Tombol menu di kiri, judul di sebelahnya -->
            <div class="flex items-center gap-3 min-w-0">
              <button
                class="inline-flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-[#E4E4E7] text-[#52525B] transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#CFCFE0] hover:text-[#443E8D] min-[901px]:hidden cursor-pointer"
                @click="sidebarOpen = !sidebarOpen"
                aria-label="Toggle sidebar"
              >
                <Bars3Icon class="w-5 h-5" />
              </button>
              <h1 class="text-[1.05rem] sm:text-[1.15rem] font-semibold leading-snug tracking-[-0.02em] text-[#18181B] truncate">
                Aktivitas
              </h1>
            </div>
          </div>

          <!-- Right actions: summary chips -->
          <div class="hidden sm:flex items-center gap-3 shrink-0">
            <Transition name="chip-fade" mode="out-in">
              <div
                v-if="activeTab === 'tugas'"
                key="chip-tugas"
                class="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[#FAFAFC] border border-[#E4E4E7] text-[#18181B]"
              >
                <div class="w-2 h-2 rounded-full bg-[#18181B]"></div>
                <span class="text-[0.72rem] font-bold">{{ taskSummaryText }}</span>
              </div>
              <div
                v-else
                key="chip-feedback"
                class="flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[#F0EFF9] border border-[#D8D6F0] text-[#443E8D]"
              >
                <div class="w-2 h-2 rounded-full bg-[#443E8D]"></div>
                <span class="text-[0.72rem] font-bold">{{ feedbackSummaryText }}</span>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <!-- ── MAIN CONTENT ── -->
      <main class="p-4 sm:p-8 flex flex-col gap-0 max-w-[1280px] mx-auto w-full min-w-0 max-w-full">

        <!-- ── TAB SWITCHER (style sama dengan tab kelas) ── -->
        <div class="flex items-stretch bg-[#F4F4F6] border border-[#E4E4E7] rounded-2xl overflow-hidden p-1 gap-1 w-full mb-6">
          <button
            v-for="(tab, index) in tabConfig"
            :key="tab.id"
            @click="switchTab(tab.id)"
            :title="tab.label"
            class="group relative flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-center transition-all duration-200 cursor-pointer focus:outline-none"
            :class="
              activeTab === tab.id
                ? 'bg-white shadow-sm text-[#443E8D]'
                : 'text-[#A1A1AA] hover:text-[#443E8D]'
            "
          >
            <!-- Icon — inline, same color as label -->
            <component :is="tab.icon" class="w-4 h-4 flex-shrink-0" />

            <!-- Label -->
            <span class="text-[0.78rem] font-bold leading-none whitespace-nowrap">{{ tab.label }}</span>
          </button>
        </div>

        <!-- ── FEEDBACK FROM TASK cross-link banner ── -->
        <Transition name="banner-fade">
          <div
            v-if="feedbackFromTask && activeTab === 'feedback'"
            class="mb-6 flex items-center justify-between gap-4 px-4 py-3 bg-[#F0EFF9] border border-[#D8D6F0] rounded-[12px]"
          >
            <div class="flex items-center gap-2">
              <ChatBubbleBottomCenterTextIcon class="w-4 h-4 text-[#443E8D] flex-shrink-0" />
              <span class="text-[0.78rem] font-semibold text-[#443E8D]">
                Ingin berkonsultasi seputar tugas <strong>{{ feedbackFromTask.assignments?.title || 'Tugas' }}</strong>? Hubungi mentor di bawah untuk chat langsung.
              </span>
            </div>
            <button
              class="text-[0.7rem] font-bold text-[#6B68A8] hover:text-[#443E8D] transition-colors whitespace-nowrap cursor-pointer"
              @click="feedbackFromTask = null"
            >
              Tutup ✕
            </button>
          </div>
        </Transition>

        <!-- ── TAB CONTENT ── -->
        <Transition name="tab-slide" mode="out-in">
          <KeepAlive>
            <component
              :is="activeTab === 'tugas' ? AktivitasTugas : AktivitasFeedback"
              :key="activeTab"
              :highlight-task-id="activeTab === 'feedback' ? (feedbackFromTask?.id ?? null) : undefined"
              @open-feedback="handleOpenFeedback"
              @stats-updated="onStatsUpdated"
              @feedback-count-updated="onFeedbackCountUpdated"
            />
          </KeepAlive>
        </Transition>

      </main>
    </div>

    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-[rgba(15,23,42,0.2)] z-[150] hidden max-[900px]:block backdrop-blur-[2px]"
      @click="sidebarOpen = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import StudentSidebar from '~/components/student/StudentSidebar.vue'
import AktivitasTugas from '~/components/student/aktivitas/AktivitasTugas.vue'
import AktivitasFeedback from '~/components/student/aktivitas/AktivitasFeedback.vue'
import {
  Bars3Icon,
  CheckCircleIcon,
  ChatBubbleLeftEllipsisIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/vue/24/outline'

useSeoMeta({
  title: 'Aktivitas — Pixelnoid Academy',
  description: 'Pantau semua tugas dan catatan mentor dalam satu halaman terpadu.'
})

definePageMeta({ layout: 'dashboard' })

const supabase = useSupabaseClient()

// ─── UI STATE ───────────────────────────────────────────────
const sidebarOpen = ref(false)
const activeTab = ref<'tugas' | 'feedback'>('tugas')
const feedbackFromTask = ref<any | null>(null)

// Stats with instant SWR cache from sessionStorage
const STATS_CACHE_KEY = 'px_cached_aktivitas_stats'
const FEEDBACK_CACHE_KEY = 'px_cached_feedback_count'

let initialStats = { total: 0, pending: 0, submitted: 0, reviewed: 0 }
let initialFeedbackCount = 0

if (import.meta.client) {
  try {
    const rawStats = sessionStorage.getItem(STATS_CACHE_KEY)
    if (rawStats) initialStats = JSON.parse(rawStats)
    const rawFb = sessionStorage.getItem(FEEDBACK_CACHE_KEY)
    if (rawFb) initialFeedbackCount = Number(rawFb) || 0
  } catch {}
}

const assignmentStats = ref(initialStats)
const feedbackCount = ref(initialFeedbackCount)

function onStatsUpdated(newMetrics: typeof initialStats) {
  if (newMetrics) {
    assignmentStats.value = newMetrics
    if (import.meta.client) {
      try { sessionStorage.setItem(STATS_CACHE_KEY, JSON.stringify(newMetrics)) } catch {}
    }
  }
}

function onFeedbackCountUpdated(count: number) {
  feedbackCount.value = count
  if (import.meta.client) {
    try { sessionStorage.setItem(FEEDBACK_CACHE_KEY, String(count)) } catch {}
  }
}

async function fetchStats() {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    const headers: Record<string, string> = {}
    if (token) headers.Authorization = `Bearer ${token}`

    const [assignRes, mentorRes] = await Promise.allSettled([
      $fetch<{ metrics: typeof assignmentStats.value }>('/api/student/assignments', { headers }),
      $fetch<{ allStudentReviews: any[] }>('/api/student/mentors', { headers })
    ])

    if (assignRes.status === 'fulfilled' && assignRes.value.metrics) {
      onStatsUpdated(assignRes.value.metrics)
    }
    if (mentorRes.status === 'fulfilled' && mentorRes.value.allStudentReviews) {
      onFeedbackCountUpdated(mentorRes.value.allStudentReviews.length)
    }
  } catch (err) {
    console.error('Error fetching tab stats:', err)
  }
}

onMounted(() => {
  fetchStats()
})

// ─── TAB CONFIG ─────────────────────────────────────────────
const tabConfig = computed(() => [
  {
    id: 'tugas' as const,
    label: 'Tugas',
    icon: CheckCircleIcon,
    badge: assignmentStats.value.pending
  },
  {
    id: 'feedback' as const,
    label: 'Kontak Mentor',
    icon: ChatBubbleLeftEllipsisIcon,
    badge: 0
  },
])

// ─── TOPBAR SUMMARY CHIPS ────────────────────────────────────
const taskSummaryText = computed(() => {
  return `${assignmentStats.value.reviewed}/${assignmentStats.value.total} Tugas Dinilai`
})

const feedbackSummaryText = computed(() => {
  return `${feedbackCount.value || 2} Mentor Siap Bimbing`
})

// ─── CROSS-NAV: TUGAS → FEEDBACK ────────────────────────────
function handleOpenFeedback(task: any) {
  feedbackFromTask.value = task
  activeTab.value = 'feedback'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function switchTab(tabId: 'tugas' | 'feedback') {
  if (tabId !== 'feedback') feedbackFromTask.value = null
  activeTab.value = tabId
}
</script>

<style scoped>
/* Tab slide transition */
.tab-slide-enter-active, .tab-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.tab-slide-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.tab-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Chip fade */
.chip-fade-enter-active, .chip-fade-leave-active { transition: all 0.18s ease; }
.chip-fade-enter-from, .chip-fade-leave-to { opacity: 0; transform: scale(0.95); }

/* Banner fade */
.banner-fade-enter-active, .banner-fade-leave-active { transition: all 0.2s ease; overflow: hidden; }
.banner-fade-enter-from, .banner-fade-leave-to { opacity: 0; max-height: 0; }
.banner-fade-enter-to, .banner-fade-leave-from { opacity: 1; max-height: 80px; }
</style>