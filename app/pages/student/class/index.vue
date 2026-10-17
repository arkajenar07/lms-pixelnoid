<!-- index_2.vue -->
<template>
  <div
    class="flex min-h-screen bg-[#F7F7F9] antialiased relative overflow-x-hidden"
    style="font-family: 'Instrument Sans', Raleway, sans-serif"
  >
    <StudentSidebar :open="sidebarOpen" @update:open="sidebarOpen = $event" />

    <!-- STANDARISASI RESPONSIVE -->
    <div class="flex-1 lg:ml-[210px] flex flex-col relative z-[1] min-w-0">

      <!-- ── TOPBAR ── -->
      <!-- Padding disesuaikan dengan class utilitas Tailwind -->
      <header class="sticky top-0 z-[100] flex w-full items-center justify-between gap-4 px-5 py-4 lg:px-8 lg:py-5 bg-white/[0.92] backdrop-blur-[14px] [-webkit-backdrop-filter:blur(14px)] border-b border-[#E4E4E7]">
        <div class="flex items-center gap-3 sm:gap-4 w-full max-w-[1440px] mx-auto min-w-0">
          <button
            class="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E4E4E7] text-[#52525B] transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#CFCFE0] hover:text-[#443E8D] lg:hidden"
            @click="sidebarOpen = !sidebarOpen"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon class="h-5 w-5" />
          </button>
          
          <!-- PENCEGAHAN OVERFLOW PADA JUDUL KELAS -->
          <div class="min-w-0 flex-1">
            <h1 class="text-[0.95rem] sm:text-[1.1rem] lg:text-[1.15rem] font-semibold leading-snug tracking-[-0.02em] text-[#18181B] truncate">
              {{ activeClass ? activeClass.name : 'Kelas Saya' }}
            </h1>
            <p class="mt-0.5 sm:mt-1 text-[0.7rem] sm:text-[0.82rem] leading-relaxed text-[#71717A] flex items-center gap-1.5 truncate">
              <AcademicCapIcon class="w-3.5 h-3.5 shrink-0" />
              <span class="truncate">{{ activeClass ? 'Learning Path' : 'Pilih kelas untuk mulai belajar' }}</span>
            </p>
          </div>

          <!-- Class Switcher -->
          <div v-if="enrolledClasses.length > 1" class="flex-shrink-0 relative" ref="switcherRef">
            <button
              type="button"
              @click.stop="toggleSwitcher"
              class="flex items-center gap-2 bg-[#FAFAFF] border border-[#443E8D]/20 px-3.5 py-2 rounded-xl text-[0.8rem] font-semibold text-[#443E8D] hover:bg-[#F0EFF9] transition-colors cursor-pointer select-none shadow-xs"
            >
              <ArrowsRightLeftIcon class="w-4 h-4 shrink-0" />
              <span class="hidden sm:inline whitespace-nowrap">Ganti Kelas</span>
              <ChevronDownIcon class="w-3.5 h-3.5 shrink-0 transition-transform duration-200" :class="{ 'rotate-180': switcherOpen }" />
            </button>

            <!-- Dropdown Menu Tetap Sama ... -->
          </div>
        </div>
      </header>

      <!-- ── KONTEN LAINNYA ── -->
      <!-- [Loading State dan State Not Enrolled Tetap Sama...] -->

      <!-- ── TAB SWITCHER ── -->
      <template v-if="activeClass">
        <div class="pt-6 pb-5 px-5 lg:px-8 lg:pt-7">
          <!-- Overflow scrollbar disembunyikan agar rapi -->
          <div class="flex items-center gap-1 bg-white border border-[#E4E4E7] rounded-[12px] p-1 w-full overflow-x-auto scrollbar-none sm:w-fit">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="relative flex items-center gap-2 px-5 py-2.5 rounded-[9px] text-[0.8rem] font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer shrink-0"
              :class="activeTab === tab.id
                ? 'bg-[#443E8D] text-white shadow-[0_1px_4px_rgba(68,62,141,0.2)]'
                : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#FAFAFC]'"
            >
              <component :is="tab.icon" class="w-4 h-4 flex-shrink-0" />
              {{ tab.label }}
              <span
                v-if="tab.badge"
                class="text-[0.58rem] font-bold px-1.5 py-0.5 rounded-[5px] leading-none shrink-0"
                :class="activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-[#F4F4F5] text-[#52525B]'"
              >{{ tab.badge }}</span>
            </button>
          </div>
        </div>

        <!-- ── TAB CONTENT ── -->
        <div class="flex-1">
          <ClassModules v-if="activeTab === 'modules'" :key="'modules-' + activeClass.class_id" :class-id="activeClass.class_id" />
          <ClassMeeting v-else-if="activeTab === 'meeting'" :key="'meeting-' + activeClass.class_id" />
          <ClassResources v-else-if="activeTab === 'resources'" :key="'resources-' + activeClass.class_id" :class-id="activeClass.class_id" />
        </div>
      </template>

    </div>

    <!-- Sidebar overlay (mobile only) -->
    <!-- STANDARISASI RESPONSIVE OVERLAY -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-[rgba(15,23,42,0.15)] z-[150] lg:hidden backdrop-blur-[2px]"
      @click="sidebarOpen = false"
    ></div>
  </div>
</template>

<style scoped>
/* Menghilangkan scrollbar bawaan di tab navigation tetapi tetap bisa di-scroll secara horizontal */
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
</style>

<script setup lang="ts">
import { ref, defineAsyncComponent, onMounted, onBeforeUnmount } from 'vue'
import StudentSidebar from '~/components/student/StudentSidebar.vue'
import ClassModules from '~/components/student/class/ClassModules.vue'
// Lazy-load tab yang tidak ditampilkan saat pertama (hemat bundle awal)
const ClassMeeting = defineAsyncComponent(() => import('~/components/student/class/ClassMeeting.vue'))
const ClassResources = defineAsyncComponent(() => import('~/components/student/class/ClassResources.vue'))
import {
  Bars3Icon,
  AcademicCapIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  FolderOpenIcon,
  ArrowsRightLeftIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'

useSeoMeta({
  title: 'Kelas — Pixelnoid Academy',
  description: 'Pusat belajar: modul materi, jadwal sesi, dan sumber daya pendukung.'
})

definePageMeta({ layout: 'dashboard' })

// ── State ───────────────────────────────────────────────────────
const route = useRoute()
const sidebarOpen = ref(false)
const initialTab = (route.query.tab as string) || 'modules'
const activeTab = ref<'modules' | 'meeting' | 'resources'>(
  ['modules', 'meeting', 'resources'].includes(initialTab) ? initialTab as any : 'modules'
)
const switcherRef = ref<HTMLElement | null>(null)
const switcherOpen = ref(false)

function toggleSwitcher() {
  switcherOpen.value = !switcherOpen.value
}

function onDocumentClick(e: MouseEvent) {
  if (switcherOpen.value && switcherRef.value && !switcherRef.value.contains(e.target as Node)) {
    switcherOpen.value = false
  }
}

interface EnrolledClass {
  member_id: number
  class_id: number
  name: string
}

const CACHE_CLASSES_KEY = 'px_cached_enrolled_classes'
const CACHE_ACTIVE_CLASS_ID = 'px_student_active_class_id'

// Instant SWR: restore cached classes immediately so UI renders in 0ms without waterfall
let initialClasses: EnrolledClass[] = []
let initialActiveClass: EnrolledClass | null = null
if (import.meta.client) {
  try {
    const raw = sessionStorage.getItem(CACHE_CLASSES_KEY) || localStorage.getItem(CACHE_CLASSES_KEY)
    if (raw) {
      initialClasses = JSON.parse(raw)
      const savedClassId = localStorage.getItem(CACHE_ACTIVE_CLASS_ID)
      initialActiveClass = (savedClassId ? initialClasses.find(c => String(c.class_id) === savedClassId) : null) || initialClasses[0] || null
    }
  } catch {}
}

const enrolledClasses = ref<EnrolledClass[]>(initialClasses)
const activeClass = ref<EnrolledClass | null>(initialActiveClass)
const isLoadingClasses = ref(initialClasses.length === 0)

const supabase = useSupabaseClient()

// ── Tabs ────────────────────────────────────────────────────────
const tabs = [
  { id: 'modules',   label: 'Modul Belajar', icon: BookOpenIcon,      badge: null },
  { id: 'meeting',   label: 'Live Meeting',  icon: CalendarDaysIcon,  badge: 2    },
  { id: 'resources', label: 'Sumber Daya',   icon: FolderOpenIcon,    badge: null },
] as const

// ── Resilient Auth Token ─────────────────────────────────────────
async function getAuthToken(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) return session.access_token
    const { data: refreshData } = await supabase.auth.refreshSession()
    return refreshData?.session?.access_token || null
  } catch {
    return null
  }
}

// ── Fetch enrolled classes ───────────────────────────────────────
async function fetchEnrolledClasses() {
  if (enrolledClasses.value.length === 0) {
    isLoadingClasses.value = true
  }
  try {
    const token = await getAuthToken()
    if (!token) return

    const data = await $fetch<{ classes: EnrolledClass[] }>('/api/student/classes', {
      headers: { Authorization: `Bearer ${token}` }
    })
    const fetched = data.classes || []
    enrolledClasses.value = fetched

    if (import.meta.client) {
      try {
        sessionStorage.setItem(CACHE_CLASSES_KEY, JSON.stringify(fetched))
        localStorage.setItem(CACHE_CLASSES_KEY, JSON.stringify(fetched))
      } catch {}
    }

    if (fetched.length > 0) {
      const savedClassId = import.meta.client ? localStorage.getItem(CACHE_ACTIVE_CLASS_ID) : null
      const matched = savedClassId ? fetched.find(c => String(c.class_id) === savedClassId) : null
      activeClass.value = matched || fetched[0]
    } else {
      activeClass.value = null
    }
  } catch (e) {
    console.error('Error fetching classes:', e)
  } finally {
    isLoadingClasses.value = false
  }
}

function selectClass(cls: EnrolledClass) {
  activeClass.value = cls
  if (import.meta.client) {
    localStorage.setItem(CACHE_ACTIVE_CLASS_ID, String(cls.class_id))
    sessionStorage.setItem(CACHE_ACTIVE_CLASS_ID, String(cls.class_id))
  }
  switcherOpen.value = false
  // Reset to modules tab on switch
  activeTab.value = 'modules'
}

onMounted(() => {
  fetchEnrolledClasses()
  if (import.meta.client) {
    document.addEventListener('click', onDocumentClick)
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.removeEventListener('click', onDocumentClick)
  }
})
</script>