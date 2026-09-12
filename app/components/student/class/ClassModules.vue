<template>
  <main class="py-8 px-8 max-[900px]:px-5 flex flex-col gap-10 mx-auto w-full">

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
      <!-- Progress strip -->
      <section class="flex flex-col sm:flex-row sm:items-center gap-8 py-8 px-6 rounded-2xl bg-[#FAFAFF] border border-[#443E8D]/10">
        <div class="flex items-center gap-10">
          <!-- Ring -->
          <div class="relative w-32 h-32 flex-shrink-0">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" stroke="#F0F0F0" stroke-width="4" fill="none" />
              <circle cx="28" cy="28" r="22" stroke="#443E8D" stroke-width="4" fill="none"
                stroke-dasharray="138.2"
                :stroke-dashoffset="138.2 * (1 - overallProgress / 100)"
                stroke-linecap="round" class="transition-all duration-700" />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <span class="text-[1.5rem] font-bold text-[#443E8D]">{{ overallProgress }}%</span>
              <span class="text-[0.65rem] text-[#999] font-medium">Selesai</span>
            </div>
          </div>
          
          <!-- Stats -->
          <div class="flex gap-4 flex-wrap">
            <div class="rounded-lg bg-[#FAFAFF] border border-[#443E8D]/10 px-4 py-3 min-w-[140px]">
              <p class="text-[0.65rem] text-[#999] uppercase tracking-wider font-semibold mb-1">Modul Tersedia</p>
              <p class="text-[1.5rem] font-bold text-[#443E8D]">{{ modules.length }}<span class="text-[0.9rem] text-[#CCC] font-normal ml-1">modul</span></p>
              <p class="text-[0.7rem] text-[#BBB] mt-1">Dalam kelas ini</p>
            </div>
            
            <div class="rounded-lg bg-[#FAFAFF] border border-[#443E8D]/10 px-4 py-3 min-w-[140px]">
              <p class="text-[0.65rem] text-[#999] uppercase tracking-wider font-semibold mb-1">Total Pelajaran</p>
              <p class="text-[1.5rem] font-bold text-[#443E8D]">{{ totalLessons }}</p>
              <p class="text-[0.7rem] text-[#BBB] mt-1">Di semua modul</p>
            </div>
            
            <div class="rounded-lg bg-[#FAFAFF] border border-[#443E8D]/10 px-4 py-3 min-w-[140px]">
              <p class="text-[0.65rem] text-[#999] uppercase tracking-wider font-semibold mb-1">Total XP</p>
              <p class="text-[1.5rem] font-bold text-[#443E8D]">{{ totalXp }}</p>
              <p class="text-[0.7rem] text-[#BBB] mt-1">Bisa didapatkan</p>
            </div>

            <div class="rounded-lg bg-[#FAFAFF] border border-[#443E8D]/10 px-4 py-3 min-w-[140px]">
              <p class="text-[0.65rem] text-[#999] uppercase tracking-wider font-semibold mb-1">XP Didapat</p>
              <p class="text-[1.5rem] font-bold text-[#443E8D]">{{ xpEarned }} / {{ totalXp }}</p>
              <p class="text-[0.7rem] text-[#BBB] mt-1">Dari progres kelas</p>
            </div>
          </div>
        </div>

        <!-- Resume CTA -->
        <NuxtLink
          v-if="modules[0]"
          :to="`/student/class/${modules[0].slug}`"
          class="sm:ml-auto inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-[#443E8D] text-white text-[0.9rem] font-semibold hover:bg-[#3A3478] transition-colors no-underline shadow-sm"
        >
          Mulai Belajar: {{ modules[0].title }}
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

const supabase = useSupabaseClient()
const modules = ref<Module[]>([])
const isLoading = ref(false)
const errorMsg = ref('')

const totalLessons = computed(() => modules.value.reduce((s, m) => s + (m.module_lessons?.length ?? 0), 0))
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
const progressPercentage = ref(0)
const xpEarned = ref(0)
const overallProgress = computed(() => progressPercentage.value)

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} menit`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m ? `${h} jam ${m} menit` : `${h} jam`
}

async function fetchModules() {
  if (!props.classId) return
  isLoading.value = true
  errorMsg.value = ''
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token
    if (!token) {
      errorMsg.value = 'Sesi tidak ditemukan. Silakan login ulang.'
      return
    }

    const data = await $fetch<{ modules: Module[] }>(`/api/student/modules?class_id=${props.classId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    modules.value = data.modules
    await fetchClassProgress(token)
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage || e?.message || 'Terjadi kesalahan.'
  } finally {
    isLoading.value = false
  }
}

async function fetchClassProgress(token: string) {
  if (!props.classId) return
  try {
    const data = await $fetch<{ progressPercentage: number; totalXpEarned: number }>(`/api/student/class-progress`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: { class_id: props.classId }
    })
    progressPercentage.value = data.progressPercentage ?? 0
    xpEarned.value = data.totalXpEarned ?? 0
  } catch (e) {
    console.error('[ClassModules] fetchClassProgress error', e)
  }
}

watch(() => props.classId, () => fetchModules(), { immediate: true })
</script>