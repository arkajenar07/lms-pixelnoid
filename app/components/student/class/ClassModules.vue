<template>
  <main class="py-5 px-8 max-[900px]:px-5 flex flex-col gap-6 mx-auto w-full">

    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 gap-4">
      <div class="w-10 h-10 border-3 border-[#443E8D]/20 border-t-[#443E8D] rounded-full animate-spin" />
      <p class="text-sm text-[#999]">Memuat modul...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="errorMsg" class="flex flex-col items-center justify-center py-24 gap-3 text-center">
      <div class="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center">
        <ExclamationCircleIcon class="w-7 h-7 text-rose-400" />
      </div>
      <p class="text-[0.95rem] font-semibold text-[#333]">Gagal memuat modul</p>
      <p class="text-sm text-[#999]">{{ errorMsg }}</p>
      <button @click="fetchModules" class="mt-2 px-4 py-2 rounded-xl bg-[#443E8D] text-white text-sm font-medium">
        Coba Lagi
      </button>
    </div>

    <!-- No Modules -->
    <div v-else-if="modules.length === 0" class="flex flex-col items-center justify-center py-24 gap-3 text-center">
      <div class="w-14 h-14 rounded-2xl bg-[#F0EFF9] flex items-center justify-center">
        <BookOpenIcon class="w-7 h-7 text-[#443E8D]/40" />
      </div>
      <p class="text-[0.95rem] font-semibold text-[#333]">Belum ada modul</p>
      <p class="text-sm text-[#999]">Mentor belum menambahkan modul untuk kelas ini.</p>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Progress + CTA -->
      <section class="flex flex-col gap-5 py-6 px-6 rounded-2xl bg-[#FAFAFF] border border-[#443E8D]/10">

        <!-- Progress Bar with XP inline -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="text-[0.72rem] font-semibold text-[#443E8D] uppercase tracking-wider">Progress Belajar</span>
            <div class="flex items-center gap-3">
              <span v-if="totalXp" class="text-[0.72rem] text-[#A1A1AA]">
                <span class="font-bold text-[#443E8D]">{{ xpEarned }}</span> / {{ totalXp }} XP
              </span>
              <span class="text-[0.72rem] font-bold text-[#443E8D]">{{ overallProgress }}%</span>
            </div>
          </div>
          <div class="w-full h-2.5 rounded-full bg-[#E8E6F5] overflow-hidden">
            <div
              class="h-full rounded-full bg-[#443E8D] transition-all duration-700"
              :style="{ width: overallProgress + '%' }"
            />
          </div>
          <p class="text-[0.7rem] text-[#AAA]">{{ completedLessons }} dari {{ totalLessons }} pelajaran selesai · {{ modules.length }} modul</p>
        </div>

        <!-- Lanjut Belajar CTA -->
        <NuxtLink
          v-if="activeModuleToStudy"
          :to="`/student/class/${activeModuleToStudy.slug}`"
          class="inline-flex items-center gap-2 self-start px-6 py-3 rounded-xl bg-[#443E8D] text-white text-[0.88rem] font-semibold hover:bg-[#3A3478] transition-colors no-underline shadow-sm"
        >
          {{ (activeModuleToStudy.completed_lessons || 0) > 0 ? 'Lanjut Belajar:' : 'Mulai Belajar:' }} {{ activeModuleToStudy.title }}
          <ArrowRightIcon class="w-4 h-4" />
        </NuxtLink>
      </section>

      <!-- Two-column layout -->
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 items-start">

        <!-- Module Cards Grid -->
        <div class="flex flex-col">
          <div class="flex items-center justify-between gap-3 mb-5">
            <div>
              <h2 class="text-[0.88rem] sm:text-[0.98rem] font-bold text-[#18181B] tracking-tight">Pilih Materi Belajar</h2>
              <p class="text-[0.72rem] sm:text-[0.78rem] text-[#71717A] mt-0.5">Bebas pilih materi apa saja yang ingin kamu pelajari</p>
            </div>
            <span class="text-[0.7rem] sm:text-[0.75rem] font-bold text-[#443E8D] bg-[#F0EFF9] border border-[#443E8D]/15 px-3 py-1 rounded-full whitespace-nowrap">
              {{ modules.length }} Modul
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5">
            <template v-for="(mod, idx) in modules" :key="mod.slug">
              <!-- Unlocked Card (Clickable NuxtLink) -->
              <NuxtLink
                v-if="!mod.is_locked_default"
                :to="`/student/class/${mod.slug}`"
                class="group relative flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden no-underline transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#443E8D]/12 hover:border-[#443E8D]/30"
              >
                <!-- Thumbnail -->
                <div
                  v-if="mod.thumbnail_url"
                  class="relative h-40 overflow-hidden bg-slate-900"
                >
                  <img
                    :src="mod.thumbnail_url"
                    :alt="mod.title"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <!-- Badges overlay -->
                  <div class="absolute top-3 left-3 right-3 flex items-start justify-between">
                    <span class="text-[0.65rem] font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30">
                      Modul {{ idx + 1 }}
                    </span>
                    <span v-if="mod.xp_reward" class="text-[0.65rem] font-black px-2.5 py-1 rounded-full bg-amber-500 text-white flex items-center gap-1">
                      <StarIcon class="w-3 h-3 fill-white" />+{{ mod.xp_reward }} XP
                    </span>
                  </div>
                </div>

                <!-- No Thumbnail — colored accent header -->
                <div
                  v-else
                  class="relative px-5 pt-5 pb-4"
                >
                  <!-- Top badge row -->
                  <div class="flex items-center justify-between mb-3">
                    <span
                      class="text-[0.63rem] font-bold px-2.5 py-1 rounded-full border"
                      :class="mod.is_completed
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : (mod.completed_lessons || 0) > 0
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-[#F0EFF9] text-[#443E8D] border-[#443E8D]/20'"
                    >
                      {{ mod.is_completed ? '✓ Selesai' : (mod.completed_lessons || 0) > 0 ? '● Sedang Belajar' : `Modul ${idx + 1}` }}
                    </span>
                    <span v-if="mod.xp_reward" class="text-[0.63rem] font-black px-2.5 py-1 rounded-full bg-amber-500 text-white flex items-center gap-1">
                      <StarIcon class="w-3 h-3 fill-white" />+{{ mod.xp_reward }} XP
                    </span>
                  </div>
                </div>

                <!-- Card Body -->
                <div class="flex flex-col flex-1 px-5 pb-5" :class="mod.thumbnail_url ? 'pt-4' : 'pt-0'">
                  <!-- Title with left accent bar -->
                  <div class="flex gap-3 mb-2">
                    <div
                      class="w-1 rounded-full flex-shrink-0 mt-0.5"
                      :class="mod.is_completed ? 'bg-emerald-500' : (mod.completed_lessons || 0) > 0 ? 'bg-indigo-500' : 'bg-[#443E8D]'"
                      style="min-height: 1.4rem"
                    />
                    <h3 class="text-[1rem] font-bold leading-snug line-clamp-2 text-slate-900 group-hover:text-[#443E8D] transition-colors m-0">
                      {{ mod.title }}
                    </h3>
                  </div>

                  <!-- Description -->
                  <p v-if="mod.description" class="text-[0.78rem] text-slate-500 line-clamp-2 leading-relaxed m-0 mb-4">
                    {{ mod.description }}
                  </p>
                  <div v-else class="mb-4" />

                  <!-- Spacer to push footer down -->
                  <div class="flex-1" />

                  <!-- Meta row: star rating style + lessons count -->
                  <div class="flex items-center gap-3 mb-3 text-[0.75rem] text-slate-500">
                    <span class="flex items-center gap-1">
                      <StarIcon class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span class="font-bold text-slate-700">
                        {{ mod.is_completed ? '100%' : Math.round(((mod.completed_lessons || 0) / (mod.total_lessons || mod.module_lessons?.length || 1)) * 100) + '%' }}
                      </span>
                    </span>
                    <span class="text-slate-300">|</span>
                    <span v-if="mod.estimated_minutes" class="flex items-center gap-1">
                      <ClockIcon class="w-3.5 h-3.5 text-slate-400" />
                      {{ formatDuration(mod.estimated_minutes) }}
                    </span>
                    <span v-else>{{ mod.module_lessons?.length || 0 }} Pelajaran</span>
                    <span class="text-slate-300">|</span>
                    <span class="font-semibold" :class="mod.completed_lessons ? 'text-[#443E8D]' : 'text-slate-400'">
                      {{ mod.completed_lessons || 0 }}/{{ mod.total_lessons || mod.module_lessons?.length || 0 }} selesai
                    </span>
                  </div>

                  <!-- Progress bar -->
                  <div v-if="(mod.total_lessons || mod.module_lessons?.length)" class="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mb-4">
                    <div
                      class="h-full rounded-full transition-all duration-500"
                      :class="mod.is_completed ? 'bg-emerald-500' : 'bg-[#443E8D]'"
                      :style="{ width: Math.min(100, Math.round(((mod.completed_lessons || 0) / (mod.total_lessons || mod.module_lessons?.length || 1)) * 100)) + '%' }"
                    />
                  </div>

                  <!-- CTA Button — primary brand color -->
                  <div
                    class="w-full py-2.5 px-5 rounded-xl text-[0.82rem] font-bold flex items-center justify-between transition-all duration-200 group-hover:scale-[1.02]"
                    :class="mod.is_completed
                      ? 'bg-slate-100 text-slate-600 group-hover:bg-[#443E8D] group-hover:text-white'
                      : (mod.completed_lessons || 0) > 0
                        ? 'bg-[#312C6A] text-white'
                        : 'bg-[#443E8D] text-white'"
                  >
                    <span>{{ mod.is_completed ? 'Buka Kembali' : ((mod.completed_lessons || 0) > 0 ? 'Lanjut Belajar' : 'Mulai Belajar') }}</span>
                    <ArrowRightIcon class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </NuxtLink>

              <!-- Locked Card (Non-clickable) -->
              <div
                v-else
                class="relative flex flex-col bg-[#FAFAFA] rounded-2xl border border-slate-200 overflow-hidden opacity-55 cursor-not-allowed select-none"
              >
                <!-- Locked header pill -->
                <div class="px-5 pt-5 pb-3">
                  <span class="text-[0.63rem] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1 w-fit">
                    <LockClosedIcon class="w-3 h-3" /> Terkunci
                  </span>
                </div>

                <div class="flex flex-col flex-1 px-5 pb-5">
                  <div class="flex gap-3 mb-2">
                    <div class="w-1 rounded-full bg-slate-300 flex-shrink-0 mt-0.5" style="min-height: 1.4rem" />
                    <h3 class="text-[1rem] font-semibold text-slate-500 line-clamp-2 leading-snug m-0">
                      {{ mod.title }}
                    </h3>
                  </div>
                  <p v-if="mod.description" class="text-[0.78rem] text-slate-400 line-clamp-2 leading-relaxed m-0 mb-4">
                    {{ mod.description }}
                  </p>
                  <div class="flex-1" />
                  <div class="flex items-center justify-between text-[0.72rem] text-slate-400 mb-3">
                    <span>{{ mod.module_lessons?.length || 0 }} Pelajaran</span>
                    <span class="italic">Belum Tersedia</span>
                  </div>
                  <div class="w-full py-2.5 px-5 rounded-xl text-[0.82rem] font-bold bg-slate-100 text-slate-400 flex items-center justify-between">
                    <span>Terkunci</span>
                    <LockClosedIcon class="w-4 h-4" />
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:sticky lg:top-[120px] flex flex-col gap-6">
          <div>
            <h2 class="text-[0.75rem] font-semibold text-[#999] uppercase tracking-wider mb-4">Info Kelas</h2>
            <div class="rounded-xl border border-[#F0F0F0] bg-white p-4 space-y-3 shadow-xs">
              <div class="flex items-center gap-2 text-[0.8rem] text-[#555]">
                <Square3Stack3DIcon class="w-4 h-4 text-[#443E8D]" />
                <span>{{ modules.length }} Modul</span>
              </div>
              <div class="flex items-center gap-2 text-[0.8rem] text-[#555]">
                <BookOpenIcon class="w-4 h-4 text-[#443E8D]" />
                <span>{{ totalLessons }} Pelajaran</span>
              </div>
              <div v-if="totalXp" class="flex items-center gap-2 text-[0.8rem] text-[#555]">
                <StarIcon class="w-4 h-4 text-amber-400" />
                <span>{{ totalXp }} XP Total</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </template>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  ArrowRightIcon, CheckIcon, BookOpenIcon, LockClosedIcon,
  Square3Stack3DIcon, ExclamationCircleIcon, StarIcon, ClockIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  classId: number
}>()

interface LessonSummary {
  id: number
  title: string
  slug: string
  type: string
  sort_order: number
  xp_reward?: number | null
  is_completed?: boolean
}

interface Module {
  id: number
  title: string
  slug: string
  description: string | null
  thumbnail_url: string | null
  xp_reward: number | null
  estimated_minutes: number | null
  sort_order: number
  is_locked_default: boolean
  is_published: boolean
  class_id: number
  module_lessons: LessonSummary[]
  total_lessons?: number
  completed_lessons?: number
  is_completed?: boolean
}

interface CachedModuleData {
  modules: Module[]
  progressPercentage?: number
  totalXpEarned?: number
  savedAt: number
}

// Module-level in-memory cache shared across component mounts
const memoryModulesCache = new Map<number, CachedModuleData>()

function getCachedData(classId: number): CachedModuleData | null {
  if (memoryModulesCache.has(classId)) {
    return memoryModulesCache.get(classId)!
  }
  if (import.meta.client) {
    try {
      const raw = sessionStorage.getItem(`px_mod_cache_${classId}`)
      if (raw) {
        const parsed = JSON.parse(raw)
        memoryModulesCache.set(classId, parsed)
        return parsed
      }
    } catch {}
  }
  return null
}

const supabase = useSupabaseClient()
const initialCached = getCachedData(props.classId)
const modules = ref<Module[]>(initialCached?.modules || [])
const backendXp = ref<number | null>(initialCached?.totalXpEarned ?? null)
const isLoading = ref(!initialCached || initialCached.modules.length === 0)
const errorMsg = ref('')

const totalLessons = computed(() => modules.value.reduce((s, m) => s + (m.module_lessons?.length ?? 0), 0))
const completedLessons = computed(() => modules.value.reduce((s, m) => s + (m.completed_lessons ?? 0), 0))
const activeModuleToStudy = computed(() => modules.value.find(m => !m.is_completed) || modules.value[0])

const totalXp = computed(() => {
  let lessonsXpSum = 0
  let hasLessonXp = false
  for (const m of modules.value) {
    for (const l of m.module_lessons || []) {
      if (l.xp_reward !== undefined && l.xp_reward !== null && Number(l.xp_reward) > 0) {
        hasLessonXp = true
        lessonsXpSum += Number(l.xp_reward)
      }
    }
  }
  if (hasLessonXp && lessonsXpSum > 0) return lessonsXpSum
  return modules.value.reduce((s, m) => s + (m.xp_reward ?? 0), 0)
})

// Progress is derived directly from module lessons in this class (0-100%)
const overallProgress = computed(() => {
  if (totalLessons.value === 0) return 0
  return Math.min(100, Math.round((completedLessons.value / totalLessons.value) * 100))
})

// XP earned is calculated directly from completed lessons
const calculatedXpEarned = computed(() => {
  let earned = 0
  for (const m of modules.value) {
    const lessons = m.module_lessons || []
    const hasLessonXp = lessons.some((l: any) => Number(l.xp_reward || 0) > 0)
    if (hasLessonXp) {
      for (const l of lessons) {
        if ((l as any).is_completed) {
          earned += Number(l.xp_reward || 0)
        }
      }
    } else {
      const modXp = Number(m.xp_reward || 0)
      const count = m.total_lessons || lessons.length || 1
      const done = m.completed_lessons || 0
      if (modXp > 0 && count > 0) {
        earned += Math.round((done / count) * modXp)
      }
    }
  }
  return earned
})

const xpEarned = computed(() => backendXp.value !== null ? backendXp.value : calculatedXpEarned.value)

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} menit`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h} jam ${m} menit` : `${h} jam`
}

async function fetchModules(showLoading = true) {
  if (!props.classId) return
  if (showLoading && modules.value.length === 0) {
    isLoading.value = true
  }
  errorMsg.value = ''
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    if (!token) {
      if (modules.value.length === 0) {
        errorMsg.value = 'Sesi tidak ditemukan. Silakan login ulang.'
      }
      return
    }

    // Single unified API endpoint: returns modules + progress + XP in 1 fast query
    const data = await $fetch<{
      modules: Module[]
      progressPercentage?: number
      totalXpEarned?: number
    }>(`/api/student/modules?class_id=${props.classId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    modules.value = data.modules || []
    if (data.totalXpEarned !== undefined) {
      backendXp.value = data.totalXpEarned
    }

    // Save to memory and session storage
    const cachePayload: CachedModuleData = {
      modules: modules.value,
      progressPercentage: data.progressPercentage,
      totalXpEarned: data.totalXpEarned,
      savedAt: Date.now()
    }
    memoryModulesCache.set(props.classId, cachePayload)
    if (import.meta.client) {
      try {
        sessionStorage.setItem(`px_mod_cache_${props.classId}`, JSON.stringify(cachePayload))
      } catch {}
    }
  } catch (e: any) {
    if (modules.value.length === 0) {
      errorMsg.value = e?.data?.statusMessage || e?.message || 'Terjadi kesalahan.'
    }
  } finally {
    isLoading.value = false
  }
}

watch(() => props.classId, (newId) => {
  if (!newId) return
  const cached = getCachedData(newId)
  if (cached && cached.modules.length > 0) {
    modules.value = cached.modules
    backendXp.value = cached.totalXpEarned ?? null
    isLoading.value = false
    // Background revalidation
    fetchModules(false)
  } else {
    fetchModules(true)
  }
}, { immediate: true })
</script>