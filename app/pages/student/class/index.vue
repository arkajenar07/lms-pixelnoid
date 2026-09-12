<template>
  <div
    class="flex min-h-screen bg-[#F7F7F9] antialiased relative overflow-x-hidden"
    style="font-family: 'Instrument Sans', Raleway, sans-serif"
  >
    <StudentSidebar :open="sidebarOpen" @update:open="sidebarOpen = $event" />

    <div class="flex-1 min-[901px]:ml-[210px] flex flex-col relative z-[1]">

      <!-- ── TOPBAR ── -->
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
            <h1 class="text-[0.95rem] sm:text-[1.1rem] font-semibold leading-snug tracking-[-0.02em] text-[#18181B] lg:text-[1.15rem]">
              {{ activeClass ? activeClass.name : 'Kelas Saya' }}
            </h1>
            <p class="mt-0.5 sm:mt-1 text-[0.7rem] sm:text-[0.82rem] leading-relaxed text-[#71717A] flex items-center gap-1.5">
              <AcademicCapIcon class="w-3.5 h-3.5" />
              {{ activeClass ? 'Learning Path' : 'Pilih kelas untuk mulai belajar' }}
            </p>
          </div>

          <!-- Class Switcher (jika lebih dari 1 kelas) -->
          <div v-if="enrolledClasses.length > 1" class="flex-shrink-0">
            <div class="relative">
              <button
                @click="switcherOpen = !switcherOpen"
                class="flex items-center gap-2 bg-[#FAFAFF] border border-[#443E8D]/20 px-3.5 py-2 rounded-xl text-[0.8rem] font-semibold text-[#443E8D] hover:bg-[#F0EFF9] transition-colors"
              >
                <ArrowsRightLeftIcon class="w-4 h-4" />
                <span class="hidden sm:inline">Ganti Kelas</span>
                <ChevronDownIcon class="w-3.5 h-3.5 transition-transform" :class="{ 'rotate-180': switcherOpen }" />
              </button>

              <!-- Dropdown -->
              <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div v-if="switcherOpen" class="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl border border-[#E4E4E7] shadow-xl z-50 overflow-hidden">
                  <div class="p-2">
                    <p class="text-[0.6rem] uppercase tracking-wider font-bold text-[#999] px-3 py-1.5">Kelas yang diikuti</p>
                    <button
                      v-for="cls in enrolledClasses"
                      :key="cls.class_id"
                      @click="selectClass(cls)"
                      class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-[0.85rem] transition-colors"
                      :class="activeClass?.class_id === cls.class_id
                        ? 'bg-[#443E8D] text-white font-semibold'
                        : 'text-[#333] hover:bg-[#F7F7F7]'"
                    >
                      <div
                        class="w-7 h-7 rounded-lg flex items-center justify-center text-[0.6rem] font-black flex-shrink-0"
                        :class="activeClass?.class_id === cls.class_id ? 'bg-white/20 text-white' : 'bg-[#443E8D]/10 text-[#443E8D]'"
                      >
                        {{ cls.name.charAt(0).toUpperCase() }}
                      </div>
                      <span class="truncate">{{ cls.name }}</span>
                      <CheckCircleIcon v-if="activeClass?.class_id === cls.class_id" class="w-4 h-4 ml-auto flex-shrink-0" />
                    </button>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
      </header>

      <!-- ── LOADING STATE ── -->
      <div v-if="isLoadingClasses" class="flex-1 flex flex-col items-center justify-center gap-4 py-24">
        <div class="w-10 h-10 border-[3px] border-[#443E8D]/20 border-t-[#443E8D] rounded-full animate-spin" />
        <p class="text-sm text-[#999]">Memuat data kelas...</p>
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
          <ExclamationTriangleIcon class="w-4 h-4 flex-shrink-0" />
          <span>Pendaftaran kelas dilakukan oleh admin.</span>
        </div>
      </div>

      <!-- ── CLASS SELECTION MODAL (jika lebih dari 1 kelas dan belum pilih) ── -->
      <Teleport to="body">
        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="showClassPicker" class="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" />
            <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <!-- Header -->
              <div class="px-6 pt-8 pb-6 text-center">
                <div class="w-14 h-14 rounded-2xl bg-[#443E8D] flex items-center justify-center mx-auto mb-4">
                  <AcademicCapIcon class="w-7 h-7 text-white" />
                </div>
                <h2 class="text-[1.1rem] font-bold text-[#18181B] mb-1">Pilih Kelas</h2>
                <p class="text-[0.85rem] text-[#71717A]">Kamu terdaftar di {{ enrolledClasses.length }} kelas. Pilih mana yang ingin kamu akses.</p>
              </div>
              <!-- Class list -->
              <div class="px-4 pb-6 space-y-2">
                <button
                  v-for="cls in enrolledClasses"
                  :key="cls.class_id"
                  @click="selectClass(cls)"
                  class="w-full flex items-center gap-4 p-4 rounded-2xl border border-[#E4E4E7] hover:border-[#443E8D]/30 hover:bg-[#FAFAFF] transition-all text-left group"
                >
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-[#443E8D] to-indigo-500 flex items-center justify-center text-white text-[1.1rem] font-black shadow-sm flex-shrink-0">
                    {{ cls.name.charAt(0).toUpperCase() }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[0.9rem] font-semibold text-[#18181B] truncate">{{ cls.name }}</p>
                    <p class="text-[0.75rem] text-[#999] mt-0.5">Learning Path</p>
                  </div>
                  <ArrowRightIcon class="w-4 h-4 text-[#CCC] group-hover:text-[#443E8D] transition-colors flex-shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- ── TAB SWITCHER (hanya tampil jika kelas sudah dipilih) ── -->
      <template v-if="activeClass">
        <div class="pt-7 px-8 max-[900px]:px-5 max-[900px]:pt-6">
          <div class="flex items-center gap-1 bg-white border border-[#E4E4E7] rounded-[12px] p-1 w-fit overflow-x-auto max-w-full">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="relative flex items-center gap-2 px-5 py-2.5 rounded-[9px] text-[0.8rem] font-semibold transition-all duration-200 whitespace-nowrap"
              :class="activeTab === tab.id
                ? 'bg-[#443E8D] text-white shadow-[0_1px_4px_rgba(68,62,141,0.2)]'
                : 'text-[#71717A] hover:text-[#18181B] hover:bg-[#FAFAFC]'"
            >
              <component :is="tab.icon" class="w-4 h-4 flex-shrink-0" />
              {{ tab.label }}
              <!-- Badge -->
              <span
                v-if="tab.badge"
                class="text-[0.58rem] font-bold px-1.5 py-0.5 rounded-[5px] leading-none"
                :class="activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-[#F4F4F5] text-[#52525B]'"
              >{{ tab.badge }}</span>
            </button>
          </div>
        </div>

        <!-- ── TAB CONTENT ── -->
        <div class="flex-1" @click="switcherOpen = false">
          <!-- Tab: Modul Belajar -->
          <ClassModules v-if="activeTab === 'modules'" :class-id="activeClass.class_id" />

          <!-- Tab: Live Meeting -->
          <ClassMeeting v-else-if="activeTab === 'meeting'" />

          <!-- Tab: Sumber Daya -->
          <ClassResources v-else-if="activeTab === 'resources'" :class-id="activeClass.class_id" />
        </div>
      </template>

    </div>

    <!-- Sidebar overlay (mobile only) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-[rgba(15,23,42,0.15)] z-[150] hidden max-[900px]:block backdrop-blur-[2px]"
      @click="sidebarOpen = false"
    ></div>

    <!-- Click outside switcher -->
    <div v-if="switcherOpen" class="fixed inset-0 z-40" @click="switcherOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, computed, onMounted } from 'vue'
import StudentSidebar from '~/components/student/StudentSidebar.vue'
import ClassModules from '~/components/student/class/ClassModules.vue'
import ClassMeeting from '~/components/student/class/ClassMeeting.vue'
import ClassResources from '~/components/student/class/ClassResources.vue'
import {
  Bars3Icon,
  AcademicCapIcon,
  BookOpenIcon,
  CalendarDaysIcon,
  FolderOpenIcon,
  ArrowsRightLeftIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  ArrowRightIcon,
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
const switcherOpen = ref(false)

interface EnrolledClass {
  member_id: number
  class_id: number
  name: string
}

const enrolledClasses = ref<EnrolledClass[]>([])
const activeClass = ref<EnrolledClass | null>(null)
const isLoadingClasses = ref(true)
const showClassPicker = ref(false)

const supabase = useSupabaseClient()

// ── Tabs ────────────────────────────────────────────────────────
const tabs = [
  { id: 'modules',   label: 'Modul Belajar', icon: BookOpenIcon,      badge: null },
  { id: 'meeting',   label: 'Live Meeting',  icon: CalendarDaysIcon,  badge: 2    },
  { id: 'resources', label: 'Sumber Daya',   icon: FolderOpenIcon,    badge: null },
] as const

// ── Fetch enrolled classes ───────────────────────────────────────
async function fetchEnrolledClasses() {
  isLoadingClasses.value = true
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    if (!token) return

    const data = await $fetch<{ classes: EnrolledClass[] }>('/api/student/classes', {
      headers: { Authorization: `Bearer ${token}` }
    })
    enrolledClasses.value = data.classes

    if (data.classes.length === 1) {
      // Auto-select if only 1 class
      activeClass.value = data.classes[0]
    } else if (data.classes.length > 1) {
      // Show picker modal
      showClassPicker.value = true
    }
  } catch (e) {
    console.error('Error fetching classes:', e)
  } finally {
    isLoadingClasses.value = false
  }
}

function selectClass(cls: EnrolledClass) {
  activeClass.value = cls
  showClassPicker.value = false
  switcherOpen.value = false
  // Reset to modules tab on switch
  activeTab.value = 'modules'
}

onMounted(fetchEnrolledClasses)
</script>