<template>
  <div
    class="flex min-h-screen bg-[#F7F7F9] antialiased relative overflow-x-hidden"
    style="font-family: 'Instrument Sans', Raleway, sans-serif"
  >
    <!-- Sidebar -->
    <StudentSidebar :open="sidebarOpen" @update:open="sidebarOpen = $event" />

    <!-- Main wrap -->
    <div class="flex-1 min-[901px]:ml-[210px] flex flex-col relative z-[1]">

      <!-- ── TOPBAR ── -->
      <header class="sticky top-0 z-[100] flex w-full items-center justify-between gap-4 px-8 py-5 max-[900px]:px-5 max-[900px]:py-4 bg-white/[0.92] backdrop-blur-[14px] [-webkit-backdrop-filter:blur(14px)] border-b border-[#E4E4E7]">
        <div class="flex items-center gap-3 sm:gap-4 w-full max-w-[1440px] mx-auto">
          <!-- Mobile hamburger -->
          <button
            class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E4E4E7] text-[#52525B] transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#CFCFE0] hover:text-[#443E8D] min-[900px]:hidden"
            @click="sidebarOpen = !sidebarOpen"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon class="h-5 w-5" />
          </button>

          <!-- Title -->
          <div class="min-w-0 flex-1">
            <h1 class="text-[0.95rem] sm:text-[1.1rem] font-semibold leading-snug tracking-[-0.02em] text-[#18181B] lg:text-[1.15rem]">
              Aktivitas
            </h1>
            <p class="mt-0.5 sm:mt-1 text-[0.7rem] sm:text-[0.82rem] leading-relaxed text-[#71717A]">
              Kelola tugas dan lihat catatan mentor dalam satu tempat.
            </p>
          </div>

          <!-- Right actions: summary chips -->
          <div class="flex items-center gap-3">
            <Transition name="chip-fade" mode="out-in">
              <div
                v-if="activeTab === 'tugas'"
                key="chip-tugas"
                class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[#FAFAFC] border border-[#E4E4E7] text-[#18181B]"
              >
                <div class="w-2 h-2 rounded-full bg-[#18181B]"></div>
                <span class="text-[0.72rem] font-bold">{{ taskSummaryText }}</span>
              </div>
              <div
                v-else
                key="chip-feedback"
                class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[#F0EFF9] border border-[#D8D6F0] text-[#443E8D]"
              >
                <div class="w-2 h-2 rounded-full bg-[#443E8D]"></div>
                <span class="text-[0.72rem] font-bold">{{ feedbackSummaryText }}</span>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <!-- ── MAIN CONTENT ── -->
      <main class="p-8 max-[900px]:p-5 flex flex-col gap-0 max-w-[1280px] mx-auto w-full">

        <!-- ── TAB SWITCHER ── -->
        <div class="flex items-center gap-1 mb-7 bg-white border border-[#E4E4E7] rounded-[12px] p-1 w-fit">
          <button
            v-for="tab in tabConfig"
            :key="tab.id"
            class="relative flex items-center gap-2 px-5 py-2.5 rounded-[9px] text-[0.8rem] font-semibold transition-all duration-200"
            :class="activeTab === tab.id
              ? tab.id === 'tugas'
                ? 'bg-[#18181B] text-white shadow-[0_1px_4px_rgba(0,0,0,0.12)]'
                : 'bg-[#443E8D] text-white shadow-[0_1px_4px_rgba(68,62,141,0.2)]'
              : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#FAFAFC]'"
            @click="switchTab(tab.id)"
          >
            <component :is="tab.icon" class="w-4 h-4 flex-shrink-0" />
            <span>{{ tab.label }}</span>
            <!-- Badge -->
            <span
              v-if="tab.badge !== null && tab.badge > 0"
              class="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-[5px] leading-none"
              :class="activeTab === tab.id
                ? 'bg-white/20 text-white'
                : tab.id === 'feedback' ? 'bg-[#F0EFF9] text-[#443E8D]' : 'bg-[#F4F4F5] text-[#52525B]'"
            >
              {{ tab.badge }}
            </span>
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
                Menampilkan catatan evaluasi mentor untuk tugas: <strong>{{ feedbackFromTask.assignments?.title || 'Tugas' }}</strong>
              </span>
            </div>
            <button
              class="text-[0.7rem] font-bold text-[#6B68A8] hover:text-[#443E8D] transition-colors whitespace-nowrap"
              @click="feedbackFromTask = null"
            >
              Hapus filter ✕
            </button>
          </div>
        </Transition>

        <!-- ── TAB CONTENT ── -->
        <Transition name="tab-slide" mode="out-in">
          <!-- TUGAS TAB -->
          <div v-if="activeTab === 'tugas'" key="tab-tugas">
            <AktivitasTugas @open-feedback="handleOpenFeedback" />
          </div>

          <!-- FEEDBACK TAB -->
          <div v-else key="tab-feedback">
            <AktivitasFeedback :highlight-task-id="feedbackFromTask?.id ?? null" />
          </div>
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

// Stats from API
const assignmentStats = ref({ total: 0, pending: 0, submitted: 0, reviewed: 0 })
const feedbackCount = ref(0)

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
      assignmentStats.value = assignRes.value.metrics
    }
    if (mentorRes.status === 'fulfilled' && mentorRes.value.allStudentReviews) {
      feedbackCount.value = mentorRes.value.allStudentReviews.length
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
    label: 'Catatan Mentor',
    icon: ChatBubbleLeftEllipsisIcon,
    badge: feedbackCount.value
  },
])

// ─── TOPBAR SUMMARY CHIPS ────────────────────────────────────
const taskSummaryText = computed(() => {
  return `${assignmentStats.value.reviewed}/${assignmentStats.value.total} Tugas Dinilai`
})

const feedbackSummaryText = computed(() => {
  return `${feedbackCount.value} Catatan Masuk`
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