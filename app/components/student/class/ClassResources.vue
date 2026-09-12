<template>
  <main class="py-8 px-8 max-[900px]:px-5 flex flex-col gap-7 mx-auto w-full max-w-[1280px]">

    <!-- ── FILTER SECTION ── -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

      <!-- Kiri: Filter Tipe (Icon Pills) -->
      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          v-for="cat in typeCategories"
          :key="cat.id"
          class="whitespace-nowrap flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[0.75rem] font-semibold transition-all border"
          :class="activeType === cat.id
            ? 'bg-[#443E8D] border-[#443E8D] text-white shadow-sm'
            : 'bg-white border-[#E4E4E7] text-[#71717A] hover:border-[#D4D4D8] hover:text-[#18181B]'"
          @click="activeType = cat.id"
        >
          <span>{{ cat.emoji }}</span>
          <span>{{ cat.label }}</span>
          <span
            v-if="cat.count !== undefined"
            class="text-[0.62rem] font-bold px-1.5 rounded-full"
            :class="activeType === cat.id ? 'bg-white/20 text-white' : 'bg-[#F4F4F5] text-[#71717A]'"
          >{{ cat.count }}</span>
        </button>
      </div>

      <!-- Kanan: Search -->
      <div class="relative flex-shrink-0 w-full sm:w-64">
        <MagnifyingGlassIcon class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Cari materi..."
          class="w-full pl-10 pr-4 py-2 bg-[#FAFAFC] border border-[#E4E4E7] rounded-xl text-[0.8rem] text-[#18181B] placeholder-[#A1A1AA] focus:bg-white focus:border-[#443E8D] focus:ring-2 focus:ring-[#443E8D]/10 outline-none transition-all"
        />
      </div>
    </div>

    <!-- ── LOADING STATE ── -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 gap-3">
      <div class="w-8 h-8 border-2 border-[#443E8D] border-t-transparent rounded-full animate-spin"></div>
      <p class="text-[0.8rem] text-[#71717A] font-medium">Memuat materi belajar...</p>
    </div>

    <!-- ── EMPTY STATE ── -->
    <div
      v-else-if="filteredResources.length === 0"
      class="flex flex-col items-center justify-center py-20 gap-3 text-center px-4"
    >
      <div class="w-14 h-14 rounded-2xl bg-[#F0EFF9] flex items-center justify-center text-[1.5rem]">
        {{ activeType === 'all' ? '📚' : typeCategories.find(c => c.id === activeType)?.emoji || '📂' }}
      </div>
      <h3 class="text-[0.95rem] font-bold text-[#18181B] m-0">Belum Ada Materi</h3>
      <p class="text-[0.78rem] text-[#71717A] max-w-sm m-0">
        {{ searchQuery
            ? 'Tidak ada materi yang cocok dengan pencarianmu.'
            : 'Materi untuk kelas ini sedang disiapkan oleh mentor. Pantau terus ya!' }}
      </p>
      <button
        v-if="searchQuery || activeType !== 'all'"
        class="mt-1 text-[0.75rem] font-semibold text-[#443E8D] hover:underline"
        @click="resetFilters"
      >
        Reset Filter
      </button>
    </div>

    <!-- ── RESOURCE GRID ── -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      <div
        v-for="res in filteredResources"
        :key="res.id"
        class="group bg-white rounded-2xl border border-[#E4E4E7] overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-[#D4D4D8] transition-all duration-200 flex flex-col"
      >
        <!-- Card Top: Type Icon Banner -->
        <div
          class="h-[68px] flex items-center px-5 gap-3.5 flex-shrink-0 relative overflow-hidden"
          :class="getTypeBgClass(res.type)"
        >
          <!-- Decorative shape -->
          <div class="absolute -right-4 -top-6 w-20 h-20 rounded-full opacity-20"
            :class="getTypeAccentClass(res.type)"></div>

          <!-- Type Icon -->
          <div class="w-10 h-10 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center text-[1.2rem] shadow-sm flex-shrink-0 relative z-10">
            {{ getTypeEmoji(res.type) }}
          </div>

          <!-- Type Label + Class Badge -->
          <div class="flex-1 min-w-0 relative z-10">
            <span class="text-[0.62rem] font-black uppercase tracking-wider block mb-0.5" :class="getTypeTextClass(res.type)">
              {{ getTypeLabel(res.type) }}
            </span>
            <span
              v-if="res.class_name"
              class="text-[0.6rem] font-semibold px-2 py-0.5 rounded-md bg-black/10 text-current truncate max-w-full inline-block"
              :class="getTypeTextClass(res.type)"
            >
              {{ res.class_name }}
            </span>
            <span
              v-else
              class="text-[0.6rem] font-semibold px-2 py-0.5 rounded-md bg-black/10 text-current inline-block"
              :class="getTypeTextClass(res.type)"
            >
              Umum / Semua Kelas
            </span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-5 flex flex-col gap-2 flex-1">
          <h3 class="text-[0.92rem] font-bold text-[#18181B] tracking-tight m-0 leading-snug group-hover:text-[#443E8D] transition-colors">
            {{ res.title }}
          </h3>
          <p class="text-[0.78rem] text-[#52525B] leading-relaxed m-0 line-clamp-2 flex-1">
            {{ res.description || 'Materi belajar dari mentor kamu.' }}
          </p>
        </div>

        <!-- Card Footer -->
        <div class="px-5 pb-5 flex items-center gap-2 border-t border-[#F4F4F5] pt-4 mt-auto">
          <!-- Primary: Buka Materi -->
          <a
            :href="res.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[0.75rem] font-bold transition-colors"
            :class="getActionBtnClass(res.type)"
          >
            <ArrowTopRightOnSquareIcon class="w-3.5 h-3.5" />
            <span>Buka Materi</span>
          </a>

          <!-- Secondary: Copy Link -->
          <button
            class="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[0.75rem] font-bold bg-[#F4F4F5] text-[#52525B] hover:bg-[#E4E4E7] transition-colors border border-transparent hover:border-[#D4D4D8] flex-shrink-0"
            :title="copiedId === res.id ? 'Tersalin!' : 'Salin Link'"
            @click="copyLink(res)"
          >
            <ClipboardDocumentCheckIcon v-if="copiedId === res.id" class="w-3.5 h-3.5 text-[#059669]" />
            <ClipboardDocumentIcon v-else class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- ── EMPTY / NO DATA FROM MENTOR BANNER ── -->
    <div
      v-if="!isLoading && resources.length === 0"
      class="bg-[#F0EFF9] border border-[#D8D6F0] rounded-2xl p-6 flex items-start gap-4"
    >
      <div class="w-10 h-10 rounded-xl bg-[#443E8D] text-white flex items-center justify-center flex-shrink-0 text-[1.1rem]">
        💡
      </div>
      <div>
        <h3 class="text-[0.95rem] font-bold text-[#18181B] m-0 mb-1">Materi Sedang Disiapkan</h3>
        <p class="text-[0.78rem] text-[#4A476F] leading-relaxed m-0">
          Mentor sedang mempersiapkan materi belajar untuk kelas ini. Periksa kembali nanti ya!
          Sementara itu, kamu bisa mulai mengerjakan modul yang tersedia.
        </p>
      </div>
    </div>

  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/vue/24/outline'

// ── Props ─────────────────────────────────────────────────────────────
const props = defineProps<{
  classId?: number | null
}>()

const supabase = useSupabaseClient()

// ── State ─────────────────────────────────────────────────────────────
const isLoading = ref(true)
const resources = ref<any[]>([])
const activeType = ref('all')
const searchQuery = ref('')
const copiedId = ref<number | null>(null)

// ── Fetch Resources ───────────────────────────────────────────────────
async function fetchResources() {
  isLoading.value = true
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token

    const headers: Record<string, string> = {}
    if (token) headers.Authorization = `Bearer ${token}`

    const params: Record<string, string> = {}
    if (props.classId) params.class_id = String(props.classId)

    const res = await $fetch<{
      classes: any[]
      resources: any[]
      total: number
    }>('/api/student/resources', { headers, query: params })

    resources.value = res.resources || []
  } catch (err) {
    console.error('Error fetching resources:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchResources)

watch(() => props.classId, () => {
  fetchResources()
})

// ── Computed ──────────────────────────────────────────────────────────
const typeCategories = computed(() => {
  const counts: Record<string, number> = {}
  for (const r of resources.value) {
    counts[r.type] = (counts[r.type] || 0) + 1
  }
  return [
    { id: 'all',        emoji: '📘', label: 'Semua',             count: resources.value.length },
    { id: 'ebook',      emoji: '📖', label: 'E-Book & PDF',      count: counts.ebook      || 0 },
    { id: 'template',   emoji: '🎨', label: 'Template & Figma',  count: counts.template   || 0 },
    { id: 'video',      emoji: '🎥', label: 'Video Tutorial',    count: counts.video      || 0 },
    { id: 'cheatsheet', emoji: '⚡', label: 'Cheatsheet',        count: counts.cheatsheet || 0 },
    { id: 'tool',       emoji: '🛠️', label: 'Tools & Software',  count: counts.tool       || 0 },
    { id: 'github',     emoji: '💻', label: 'Source Code',       count: counts.github     || 0 },
    { id: 'other',      emoji: '📂', label: 'Lainnya',           count: counts.other      || 0 },
  ].filter(c => c.id === 'all' || c.count > 0)
})

const filteredResources = computed(() => {
  let list = [...resources.value]

  if (activeType.value !== 'all') {
    list = list.filter(r => r.type === activeType.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(r =>
      r.title?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q) ||
      r.class_name?.toLowerCase().includes(q)
    )
  }

  return list
})

function resetFilters() {
  activeType.value = 'all'
  searchQuery.value = ''
}

async function copyLink(res: any) {
  try {
    await navigator.clipboard.writeText(res.url)
    copiedId.value = res.id
    setTimeout(() => { copiedId.value = null }, 2000)
  } catch {
    // Fallback
    const ta = document.createElement('textarea')
    ta.value = res.url
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copiedId.value = res.id
    setTimeout(() => { copiedId.value = null }, 2000)
  }
}

// ── Type Helpers ──────────────────────────────────────────────────────
function getTypeEmoji(type: string) {
  const map: Record<string, string> = {
    ebook: '📖', template: '🎨', video: '🎥',
    cheatsheet: '⚡', tool: '🛠️', github: '💻', other: '📂'
  }
  return map[type] || '📂'
}

function getTypeLabel(type: string) {
  const map: Record<string, string> = {
    ebook: 'E-Book / PDF', template: 'Template & Figma',
    video: 'Video Tutorial', cheatsheet: 'Cheatsheet',
    tool: 'Tools & Software', github: 'Source Code / GitHub', other: 'Lainnya'
  }
  return map[type] || 'Materi'
}

function getTypeBgClass(type: string) {
  const map: Record<string, string> = {
    ebook:      'bg-gradient-to-r from-[#FEF9EC] to-[#FEF3C7]',
    template:   'bg-gradient-to-r from-[#F3E8FF] to-[#EDE9FE]',
    video:      'bg-gradient-to-r from-[#FEF2F2] to-[#FEE2E2]',
    cheatsheet: 'bg-gradient-to-r from-[#ECFDF5] to-[#D1FAE5]',
    tool:       'bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE]',
    github:     'bg-gradient-to-r from-[#F9FAFB] to-[#F3F4F6]',
    other:      'bg-gradient-to-r from-[#F0EFF9] to-[#E0DEFA]',
  }
  return map[type] || map.other
}

function getTypeAccentClass(type: string) {
  const map: Record<string, string> = {
    ebook: 'bg-[#F59E0B]', template: 'bg-[#7C3AED]', video: 'bg-[#EF4444]',
    cheatsheet: 'bg-[#10B981]', tool: 'bg-[#3B82F6]', github: 'bg-[#374151]', other: 'bg-[#443E8D]'
  }
  return map[type] || map.other
}

function getTypeTextClass(type: string) {
  const map: Record<string, string> = {
    ebook: 'text-[#B45309]', template: 'text-[#6D28D9]', video: 'text-[#DC2626]',
    cheatsheet: 'text-[#047857]', tool: 'text-[#1D4ED8]', github: 'text-[#374151]', other: 'text-[#443E8D]'
  }
  return map[type] || map.other
}

function getActionBtnClass(type: string) {
  const map: Record<string, string> = {
    ebook:      'bg-[#FEF3C7] text-[#B45309] hover:bg-[#FDE68A]',
    template:   'bg-[#EDE9FE] text-[#6D28D9] hover:bg-[#DDD6FE]',
    video:      'bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FECACA]',
    cheatsheet: 'bg-[#D1FAE5] text-[#047857] hover:bg-[#A7F3D0]',
    tool:       'bg-[#DBEAFE] text-[#1D4ED8] hover:bg-[#BFDBFE]',
    github:     'bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]',
    other:      'bg-[#E0DEFA] text-[#443E8D] hover:bg-[#C4BFEF]',
  }
  return map[type] || map.other
}
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>