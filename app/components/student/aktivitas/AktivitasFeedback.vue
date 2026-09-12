<template>
  <div class="flex flex-col gap-8">

    <!-- ── 1. STATS ROW ── -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-[0.68rem] font-bold uppercase tracking-wider text-[#71717A]">Total Catatan</span>
          <div class="w-8 h-8 rounded-xl bg-[#F0EFF9] border border-[#D8D6F0] flex items-center justify-center text-[#443E8D]">
            <ChatBubbleBottomCenterTextIcon class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-3">
          <div class="text-[1.75rem] font-black text-[#18181B] tracking-tight leading-none">
            {{ totalReviews }}
          </div>
          <p class="text-[0.7rem] text-[#A1A1AA] font-medium mt-1 mb-0">Evaluasi mentor masuk</p>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-[0.68rem] font-bold uppercase tracking-wider text-[#71717A]">Rata-rata Skor</span>
          <div class="w-8 h-8 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">
            <TrophyIcon class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-3">
          <div class="text-[1.75rem] font-black text-[#059669] tracking-tight leading-none">
            {{ averageScore !== null ? averageScore : '-' }}
            <span v-if="averageScore !== null" class="text-[0.9rem] font-semibold text-[#A1A1AA]">/100</span>
          </div>
          <p class="text-[0.7rem] text-[#A1A1AA] font-medium mt-1 mb-0">Performa pengerjaan tugas</p>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-[0.68rem] font-bold uppercase tracking-wider text-[#71717A]">Tugas Selesai</span>
          <div class="w-8 h-8 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
            <CheckBadgeIcon class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-3">
          <div class="text-[1.75rem] font-black text-[#18181B] tracking-tight leading-none">
            {{ totalReviews }}
          </div>
          <p class="text-[0.7rem] text-[#A1A1AA] font-medium mt-1 mb-0">Telah diperiksa mentor</p>
        </div>
      </div>

      <div class="bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-[0.68rem] font-bold uppercase tracking-wider text-[#71717A]">Mentor Pembimbing</span>
          <div class="w-8 h-8 rounded-xl bg-[#FDF2F8] border border-[#FBCFE8] flex items-center justify-center text-[#DB2777]">
            <UserGroupIcon class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-3">
          <div class="text-[1.75rem] font-black text-[#18181B] tracking-tight leading-none">
            {{ mentors.length }}
          </div>
          <p class="text-[0.7rem] text-[#A1A1AA] font-medium mt-1 mb-0">Aktif membimbing kelas</p>
        </div>
      </div>
    </section>

    <!-- ── 2. DIREKTORI MENTOR KELAS ── -->
    <section class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-[1.05rem] font-bold text-[#18181B] tracking-tight m-0">Direktori Mentor</h2>
          <p class="text-[0.78rem] text-[#71717A] m-0">Mentor pengampu yang siap membimbing dan mereview karyamu.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="mentor in mentors"
          :key="mentor.id"
          class="bg-white rounded-2xl border border-[#E4E4E7] p-5 shadow-sm flex flex-col justify-between gap-4 transition-all hover:border-[#D4D4D8] hover:shadow-md"
        >
          <div class="flex items-start gap-4">
            <!-- Mentor Avatar -->
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#443E8D] to-[#6366F1] flex items-center justify-center text-white font-black text-[1.1rem] shadow-sm flex-shrink-0">
              {{ (mentor.fullname || 'M')[0].toUpperCase() }}
            </div>

            <!-- Mentor Details -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-[0.95rem] font-bold text-[#18181B] m-0 truncate">
                  {{ mentor.fullname }}
                </h3>
                <span class="text-[0.62rem] font-bold px-2 py-0.5 rounded-md bg-[#F0EFF9] text-[#443E8D] border border-[#D8D6F0]">
                  {{ mentor.specialty }}
                </span>
              </div>
              <p class="text-[0.75rem] text-[#71717A] leading-relaxed mt-1.5 mb-0 font-medium">
                {{ mentor.bio }}
              </p>
            </div>
          </div>

          <!-- Contact Actions -->
          <div class="flex items-center justify-between pt-3 border-t border-[#F4F4F5] gap-3">
            <span class="text-[0.7rem] text-[#A1A1AA] font-semibold">
              {{ mentor.reviewCount }} tugas diperiksa
            </span>
            <div class="flex items-center gap-2">
              <a
                v-if="mentor.contactWhatsApp"
                :href="mentor.contactWhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.72rem] font-bold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] hover:bg-[#D1FAE5] transition-colors"
              >
                <span>WhatsApp</span>
              </a>
              <a
                v-if="mentor.contactEmail"
                :href="mentor.contactEmail"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.72rem] font-bold text-[#443E8D] bg-[#F0EFF9] border border-[#D8D6F0] hover:bg-[#E0DEFA] transition-colors"
              >
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── 3. RIWAYAT PENILAIAN & EVALUASI TUGAS ── -->
    <section class="space-y-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h2 class="text-[1.05rem] font-bold text-[#18181B] tracking-tight m-0">Riwayat Catatan &amp; Feedback</h2>
          <p class="text-[0.78rem] text-[#71717A] m-0">Evaluasi mendalam dari mentor untuk peningkatan skill kamu.</p>
        </div>

        <!-- Filter / Search Controls -->
        <div class="flex items-center gap-2.5 w-full sm:w-auto">
          <div class="relative flex-1 sm:w-64">
            <MagnifyingGlassIcon class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari tugas atau catatan..."
              class="w-full pl-10 pr-4 py-2 bg-white border border-[#E4E4E7] rounded-xl text-[0.78rem] text-[#18181B] placeholder-[#A1A1AA] focus:ring-2 focus:ring-[#18181B]/10 focus:border-[#18181B] outline-none transition-all"
            />
          </div>
          <select
            v-model="mentorFilter"
            class="px-3 py-2 bg-white border border-[#E4E4E7] rounded-xl text-[0.78rem] font-medium text-[#18181B] outline-none cursor-pointer focus:ring-2 focus:ring-[#18181B]/10 focus:border-[#18181B] transition-all"
          >
            <option value="all">Semua Mentor</option>
            <option v-for="m in mentors" :key="m.id" :value="m.id">
              {{ m.fullname }}
            </option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-[#E4E4E7] gap-3">
        <div class="w-8 h-8 border-2 border-[#18181B] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-[0.8rem] text-[#71717A] font-medium">Memuat catatan mentor...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredReviews.length === 0" class="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-[#E4E4E7] gap-3 text-center px-4">
        <div class="w-12 h-12 rounded-2xl bg-[#F4F4F5] flex items-center justify-center text-[#A1A1AA]">
          <ChatBubbleBottomCenterTextIcon class="w-6 h-6" />
        </div>
        <h3 class="text-[0.95rem] font-bold text-[#18181B] m-0">Belum Ada Catatan Mentor</h3>
        <p class="text-[0.78rem] text-[#71717A] max-w-sm m-0">
          Kumpulkan tugasmu di tab Tugas. Mentor akan memberikan nilai dan feedback setelah memeriksa hasil karyamu.
        </p>
      </div>

      <!-- Review Cards List -->
      <div v-else class="space-y-4">
        <div
          v-for="review in filteredReviews"
          :key="review.id"
          class="bg-white rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:shadow-md flex flex-col gap-4"
          :class="isHighlighted(review) ? 'border-[#443E8D] ring-2 ring-[#443E8D]/15 bg-[#FCFBFF]' : 'border-[#E4E4E7] hover:border-[#D4D4D8]'"
        >
          <!-- Top Row: Assignment Title, Grade & Type -->
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2.5 flex-wrap">
              <!-- Type Badge -->
              <span
                class="px-2.5 py-0.5 rounded-lg text-[0.62rem] font-bold uppercase tracking-wider border"
                :class="getTypeBadgeClass(review.assignments?.type)"
              >
                {{ getTypeLabel(review.assignments?.type) }}
              </span>

              <!-- Assignment Title -->
              <h3 class="text-[0.95rem] font-bold text-[#18181B] m-0">
                {{ review.assignments?.title || 'Tugas' }}
              </h3>

              <span
                v-if="isHighlighted(review)"
                class="text-[0.62rem] font-bold px-2 py-0.5 rounded-full bg-[#443E8D] text-white"
              >
                Dipilih
              </span>
            </div>

            <!-- Grade Display -->
            <div class="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#047857]">
              <TrophyIcon class="w-4 h-4 text-[#059669]" />
              <span class="text-[0.85rem] font-black leading-none">{{ review.grade ?? 0 }}</span>
              <span class="text-[0.68rem] font-bold text-[#059669]/80">/100</span>
            </div>
          </div>

          <!-- Feedback Box -->
          <div class="p-4 bg-[#FAFAFC] border border-[#E4E4E7] rounded-xl relative">
            <p class="text-[0.82rem] text-[#18181B] leading-relaxed m-0 italic">
              "{{ review.feedback }}"
            </p>
          </div>

          <!-- Footer Row: Reviewer info & Student link -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F4F4F5]">
            <!-- Mentor Details -->
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-[#443E8D] text-white font-bold flex items-center justify-center text-[0.72rem]">
                {{ getMentorName(review.feedback_by)[0].toUpperCase() }}
              </div>
              <div class="text-[0.75rem]">
                <span class="font-bold text-[#18181B]">{{ getMentorName(review.feedback_by) }}</span>
                <span class="text-[#A1A1AA] ml-1.5">· {{ formatTimestamp(review.feedback_at) }}</span>
              </div>
            </div>

            <!-- Submission URL Link -->
            <div v-if="review.submission_url">
              <a
                :href="review.submission_url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-[0.75rem] font-bold text-[#2563EB] hover:underline"
              >
                <ArrowTopRightOnSquareIcon class="w-3.5 h-3.5" />
                <span>Buka Link Karya</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  ChatBubbleBottomCenterTextIcon,
  TrophyIcon,
  CheckBadgeIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  highlightTaskId?: number | null
}>()

const supabase = useSupabaseClient()

// ── State ─────────────────────────────────────────────────────────────
const isLoading = ref(true)
const mentors = ref<any[]>([])
const reviews = ref<any[]>([])
const searchQuery = ref('')
const mentorFilter = ref('all')

// ── Data Fetching ─────────────────────────────────────────────────────
async function fetchMentorData() {
  isLoading.value = true
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token

    const headers: Record<string, string> = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const res = await $fetch<{
      mentors: any[]
      allStudentReviews: any[]
    }>('/api/student/mentors', { headers })

    mentors.value = res.mentors || []
    reviews.value = res.allStudentReviews || []
  } catch (err) {
    console.error('Error fetching mentor data:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchMentorData()
})

// ── Computed & Helpers ────────────────────────────────────────────────
const totalReviews = computed(() => reviews.value.length)

const averageScore = computed(() => {
  const scores = reviews.value.map(r => Number(r.grade)).filter(g => !isNaN(g))
  if (scores.length === 0) return null
  return Math.round((scores.reduce((acc, curr) => acc + curr, 0) / scores.length) * 10) / 10
})

const filteredReviews = computed(() => {
  let list = [...reviews.value]

  // Filter by highlighted task if set
  if (props.highlightTaskId) {
    list.sort((a, b) => {
      if (a.id === props.highlightTaskId || a.assignment_id === props.highlightTaskId) return -1
      if (b.id === props.highlightTaskId || b.assignment_id === props.highlightTaskId) return 1
      return 0
    })
  }

  // Filter by selected mentor
  if (mentorFilter.value !== 'all') {
    list = list.filter(r => r.feedback_by === mentorFilter.value)
  }

  // Search query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(r => {
      const title = (r.assignments?.title || '').toLowerCase()
      const fb = (r.feedback || '').toLowerCase()
      const mentor = getMentorName(r.feedback_by).toLowerCase()
      return title.includes(q) || fb.includes(q) || mentor.includes(q)
    })
  }

  return list
})

function isHighlighted(review: any) {
  if (!props.highlightTaskId) return false
  return review.id === props.highlightTaskId || review.assignment_id === props.highlightTaskId
}

function getMentorName(feedbackBy?: string) {
  if (!feedbackBy) return 'Mentor'
  const found = mentors.value.find(m => m.id === feedbackBy)
  return found?.fullname || 'Senior Mentor'
}

function getTypeLabel(type?: string) {
  switch (type) {
    case 'quizizz': return 'Quizizz'
    case 'practice': return 'Praktek'
    case 'case_study': return 'Studi Kasus'
    default: return 'Tugas'
  }
}

function getTypeBadgeClass(type?: string) {
  switch (type) {
    case 'quizizz': return 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]'
    case 'practice': return 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]'
    case 'case_study': return 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
    default: return 'bg-[#F4F4F5] text-[#52525B] border-[#E4E4E7]'
  }
}

function formatTimestamp(dateStr?: string) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return dateStr
  }
}
</script>