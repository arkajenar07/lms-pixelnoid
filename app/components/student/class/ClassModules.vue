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
      <!-- Progress + Stats + CTA -->
      <section class="flex flex-col gap-5 py-6 px-6 rounded-2xl bg-[#FAFAFF] border border-[#443E8D]/10">

        <!-- ① Progress Bar -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <span class="text-[0.72rem] font-semibold text-[#443E8D] uppercase tracking-wider">Progress Belajar</span>
            <span class="text-[0.72rem] font-bold text-[#443E8D]">{{ overallProgress }}%</span>
          </div>
          <div class="w-full h-2.5 rounded-full bg-[#E8E6F5] overflow-hidden">
            <div
              class="h-full rounded-full bg-[#443E8D] transition-all duration-700"
              :style="{ width: overallProgress + '%' }"
            />
          </div>
          <p class="text-[0.7rem] text-[#AAA]">{{ completedLessons }} dari {{ totalLessons }} pelajaran selesai</p>
        </div>

        <!-- ② Stats Row -->
        <div class="flex gap-3 flex-wrap">
          <div class="rounded-lg bg-white border border-[#443E8D]/10 px-4 py-3 min-w-[130px] flex-1">
            <p class="text-[0.62rem] text-[#999] uppercase tracking-wider font-semibold mb-1">Modul Tersedia</p>
            <p class="text-[1.4rem] font-bold text-[#443E8D] leading-tight">{{ modules.length }}<span class="text-[0.85rem] text-[#CCC] font-normal ml-1">modul</span></p>
            <p class="text-[0.68rem] text-[#BBB] mt-1">Dalam kelas ini</p>
          </div>
          <div class="rounded-lg bg-white border border-[#443E8D]/10 px-4 py-3 min-w-[130px] flex-1">
            <p class="text-[0.62rem] text-[#999] uppercase tracking-wider font-semibold mb-1">Total Pelajaran</p>
            <p class="text-[1.4rem] font-bold text-[#443E8D] leading-tight">{{ totalLessons }}</p>
            <p class="text-[0.68rem] text-[#BBB] mt-1">Di semua modul</p>
          </div>
          <div class="rounded-lg bg-white border border-[#443E8D]/10 px-4 py-3 min-w-[130px] flex-1">
            <p class="text-[0.62rem] text-[#999] uppercase tracking-wider font-semibold mb-1">XP Didapat</p>
            <p class="text-[1.4rem] font-bold text-[#443E8D] leading-tight">{{ xpEarned }} <span class="text-[0.85rem] text-[#CCC] font-normal">/ {{ totalXp }}</span></p>
            <p class="text-[0.68rem] text-[#BBB] mt-1">Dari progres kelas</p>
          </div>
        </div>

        <!-- ③ Lanjut Belajar CTA -->
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
      <div class="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-10 items-start">

        <!-- Module list -->
        <div class="flex flex-col">
          <h2 class="text-[0.75rem] font-semibold text-[#999] uppercase tracking-wider mb-5">Materi ({{ modules.length }} Modul)</h2>

          <div class="flex flex-col">
            <div v-for="(mod, idx) in modules" :key="mod.slug" class="relative flex gap-4 pb-6 last:pb-0">

              <!-- Timeline line -->
              <div class="flex flex-col items-center gap-0 flex-shrink-0">
                <div
                  class="w-7 h-7 rounded-full flex items-center justify-center border-2 text-[0.6rem] flex-shrink-0 z-10 transition-colors"
                  :class="{
                    'bg-emerald-500 border-emerald-500 text-white shadow-sm': mod.is_completed,
                    'bg-white border-[#DDD] text-[#BBB]': !mod.is_completed && !mod.is_locked_default,
                    'bg-[#F7F7F7] border-[#EEE] text-[#CCC]': !mod.is_completed && mod.is_locked_default,
                  }"
                >
                  <CheckIcon v-if="mod.is_completed" class="w-3.5 h-3.5 stroke-[3]" />
                  <LockClosedIcon v-else-if="mod.is_locked_default" class="w-3 h-3" />
                  <span v-else class="text-[0.6rem] font-semibold">{{ idx + 1 }}</span>
                </div>
                <div v-if="idx < modules.length - 1" class="w-px flex-1 min-h-[24px] mt-1" :class="mod.is_completed ? 'bg-emerald-200' : 'bg-[#EEE]'"></div>
              </div>

              <!-- Card -->
              <div
                class="flex-1 rounded-xl border p-4 mb-1 transition-all"
                :class="{
                  'border-emerald-200 bg-emerald-50/20 hover:border-emerald-300': mod.is_completed,
                  'border-[#F0F0F0] bg-white hover:border-[#443E8D]/20': !mod.is_completed && !mod.is_locked_default,
                  'opacity-50 pointer-events-none border-[#F0F0F0] bg-white': mod.is_locked_default,
                }"
              >
                <div class="flex items-start justify-between gap-3 mb-2">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3
                      class="text-[0.875rem] font-medium m-0"
                      :class="mod.is_completed ? 'text-emerald-950 font-semibold' : 'text-[#111]'"
                    >
                      {{ mod.title }}
                    </h3>

                    <!-- Completed Badge -->
                    <span v-if="mod.is_completed" class="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1 border border-emerald-200">
                      <CheckIcon class="w-3 h-3 stroke-[3]" /> Selesai
                    </span>
                    <span v-else-if="mod.is_locked_default" class="text-[0.6rem] font-medium px-1.5 py-0.5 rounded-md bg-[#F7F7F7] text-[#999] flex items-center gap-1">
                      <LockClosedIcon class="w-2.5 h-2.5" />Terkunci
                    </span>
                  </div>

                  <span v-if="mod.xp_reward" class="text-[0.7rem] font-medium flex-shrink-0" :class="mod.is_completed ? 'text-emerald-600 font-bold' : 'text-[#999]'">
                    +{{ mod.xp_reward }} XP
                  </span>
                </div>

                <p v-if="mod.description" class="text-[0.78rem] text-[#888] leading-relaxed m-0 mb-3">{{ mod.description }}</p>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3 text-[0.7rem]" :class="mod.is_completed ? 'text-emerald-600 font-medium' : 'text-[#BBB]'">
                    <span v-if="mod.estimated_minutes">{{ formatDuration(mod.estimated_minutes) }}</span>
                    <span v-if="mod.estimated_minutes && mod.module_lessons?.length">·</span>
                    <span v-if="mod.module_lessons?.length">
                      {{ mod.completed_lessons !== undefined ? `${mod.completed_lessons} / ${mod.total_lessons || mod.module_lessons.length} pelajaran` : `${mod.module_lessons.length} pelajaran` }}
                    </span>
                  </div>

                  <NuxtLink
                    v-if="!mod.is_locked_default"
                    :to="`/student/class/${mod.slug}`"
                    class="text-[0.75rem] font-semibold transition-colors no-underline flex items-center gap-1"
                    :class="mod.is_completed ? 'text-emerald-700 hover:text-emerald-900' : 'text-[#999] hover:text-[#443E8D]'"
                  >
                    {{ mod.is_completed ? 'Buka Kembali →' : 'Mulai →' }}
                  </NuxtLink>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Bonus sidebar -->
        <div class="lg:sticky lg:top-[120px] flex flex-col gap-6">
          <div>
            <h2 class="text-[0.75rem] font-semibold text-[#999] uppercase tracking-wider mb-4">Info Kelas</h2>
            <div class="rounded-xl border border-[#F0F0F0] bg-white p-4 space-y-3">
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
  Square3Stack3DIcon, ExclamationCircleIcon, StarIcon
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