<!-- index_2.vue -->
<template>
  <div
    class="flex min-h-screen bg-[#F7F7F9] antialiased relative overflow-x-clip"
    style="font-family: 'Instrument Sans', Raleway, sans-serif"
  >
    <StudentSidebar :open="sidebarOpen" @update:open="sidebarOpen = $event" />

    <!-- STANDARISASI RESPONSIVE -->
    <div class="flex-1 lg:ml-[210px] flex flex-col relative z-[1] min-w-0">

      <!-- ── TOPBAR ── -->
      <!-- Padding disesuaikan dengan class utilitas Tailwind -->
      <header class="sticky top-0 z-[100] flex w-full flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4 px-4 py-3.5 sm:px-6 sm:py-4 lg:px-8 lg:py-5 bg-white/[0.92] backdrop-blur-[14px] [-webkit-backdrop-filter:blur(14px)] border-b border-[#E4E4E7]">
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4 w-full max-w-[1440px] mx-auto min-w-0">
          <!-- Baris 1 & 2: Menu + Judul, lalu Deskripsi selebar layar -->
          <div class="flex flex-col gap-1 min-w-0 flex-1">
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
                {{ activeClass ? activeClass.name : 'Kelas Saya' }}
              </h1>
            </div>
          </div>

          <!-- Baris 3: Class Switcher selebar layar di mobile -->
          <div v-if="enrolledClasses.length > 1" class="w-full lg:w-auto shrink-0 relative" ref="switcherRef">
            <button
              type="button"
              @click.stop="toggleSwitcher"
              class="w-full lg:w-auto flex items-center justify-center gap-2 bg-[#FAFAFF] border border-[#443E8D]/20 px-4 py-2.5 rounded-xl text-[0.8rem] font-semibold text-[#443E8D] hover:bg-[#F0EFF9] transition-colors cursor-pointer select-none shadow-xs"
            >
              <ArrowsRightLeftIcon class="w-4 h-4 shrink-0" />
              <span class="whitespace-nowrap">Ganti Kelas</span>
              <ChevronDownIcon class="w-3.5 h-3.5 shrink-0 transition-transform duration-200" :class="{ 'rotate-180': switcherOpen }" />
            </button>

            <!-- Dropdown Menu -->
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 translate-y-1 scale-95"
              enter-to-class="opacity-100 translate-y-0 scale-100"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 translate-y-0 scale-100"
              leave-to-class="opacity-0 translate-y-1 scale-95"
            >
              <div
                v-if="switcherOpen"
                @click.stop
                class="absolute right-0 top-full mt-2 w-full sm:w-72 bg-white rounded-2xl border border-[#E4E4E7] shadow-2xl z-[150] overflow-hidden py-1.5"
              >
                <div class="px-3.5 py-2.5 border-b border-[#F4F4F5] flex items-center justify-between">
                  <p class="text-[0.68rem] uppercase tracking-wider font-bold text-[#A1A1AA]">Kelas yang Diikuti</p>
                  <span class="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-[#F0EFF9] text-[#443E8D]">
                    {{ enrolledClasses.length }} Kelas
                  </span>
                </div>
                <div class="p-1.5 flex flex-col gap-1 max-h-[300px] overflow-y-auto">
                  <button
                    v-for="cls in enrolledClasses"
                    :key="cls.class_id"
                    type="button"
                    @click="selectClass(cls)"
                    class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[0.85rem] transition-colors cursor-pointer group"
                    :class="activeClass?.class_id === cls.class_id
                      ? 'bg-[#443E8D] text-white font-semibold shadow-sm'
                      : 'text-[#27272A] hover:bg-[#F4F4F8]'"
                  >
                    <div
                      class="w-8 h-8 rounded-lg flex items-center justify-center text-[0.7rem] font-black shrink-0 transition-colors"
                      :class="activeClass?.class_id === cls.class_id ? 'bg-white/20 text-white' : 'bg-[#443E8D]/10 text-[#443E8D] group-hover:bg-[#443E8D]/20'"
                    >
                      {{ cls.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="truncate leading-tight font-medium" :class="activeClass?.class_id === cls.class_id ? 'text-white' : 'text-[#18181B]'">
                        {{ cls.name }}
                      </p>
                      <p class="text-[0.6875rem] truncate mt-0.5" :class="activeClass?.class_id === cls.class_id ? 'text-white/70' : 'text-[#A1A1AA]'">
                        {{ activeClass?.class_id === cls.class_id ? 'Sedang Aktif' : 'Klik untuk berganti' }}
                      </p>
                    </div>
                    <CheckCircleIcon v-if="activeClass?.class_id === cls.class_id" class="w-4 h-4 ml-auto shrink-0 text-white" />
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <!-- ── LOADING STATE ── -->
      <div v-if="isLoadingClasses" class="flex-1 flex flex-col items-center justify-center gap-4 py-24">
        <div class="w-10 h-10 border-[3px] border-[#443E8D]/20 border-t-[#443E8D] rounded-full animate-spin" />
        <p class="text-sm text-[#71717A]">Memuat data kelas...</p>
      </div>

      <!-- ── NOT ENROLLED ── -->
      <div v-else-if="!isLoadingClasses && enrolledClasses.length === 0" class="flex-1 flex flex-col items-center justify-center gap-5 py-24 px-8 text-center">
        <div class="w-20 h-20 rounded-3xl bg-[#F0EFF9] flex items-center justify-center">
          <AcademicCapIcon class="w-10 h-10 text-[#443E8D]/40" />
        </div>
        <div>
          <h2 class="text-[1.2rem] font-bold text-[#18181B] mb-2">Kamu belum terdaftar di kelas manapun</h2>
          <p class="text-[0.9rem] text-[#71717A] leading-relaxed max-w-sm mx-auto">
            Hubungi admin atau mentor untuk mendaftarkan kamu ke kelas yang sesuai.
          </p>
        </div>
        <div class="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-[0.8rem] max-w-sm">
          <ExclamationTriangleIcon class="w-4 h-4 shrink-0" />
          <span>Pendaftaran kelas dilakukan oleh admin.</span>
        </div>
      </div>

      <!-- ── TAB SWITCHER ── -->
      <template v-if="activeClass">
        <div class="pt-5 pb-0 px-5 lg:px-8 lg:pt-6">
          <!-- Tab: icon + label side by side (horizontal pill style) -->
          <div class="flex items-stretch bg-[#F4F4F6] border border-[#E4E4E7] rounded-2xl overflow-hidden p-1 gap-1 w-full">
            <button
              v-for="(tab, index) in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
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

              <!-- Badge (Live Meeting) -->
              <div
                v-if="tab.badge"
                class="min-w-[16px] h-4 px-1 rounded-full text-[0.55rem] font-black flex items-center justify-center leading-none"
                :class="activeTab === tab.id ? 'bg-[#443E8D] text-white' : 'bg-[#EF4444] text-white'"
              >{{ tab.badge }}</div>
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
  { id: 'modules',   label: 'Modul',    icon: BookOpenIcon,      badge: null },
  { id: 'meeting',   label: 'Meeting',  icon: CalendarDaysIcon,  badge: null },
  { id: 'resources', label: 'Sumber',   icon: FolderOpenIcon,    badge: null },
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