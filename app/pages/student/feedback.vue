<template>
  <div
    class="flex min-h-screen bg-[#F5F5F8] antialiased relative overflow-x-hidden"
    style="font-family: 'Instrument Sans', Raleway, sans-serif"
  >
    <!-- Sidebar -->
    <StudentSidebar :open="sidebarOpen" @update:open="sidebarOpen = $event" />

    <!-- Main wrap -->
    <div class="flex-1 lg:ml-[260px] flex flex-col relative z-[1]">

      <!-- ── TOPBAR ── -->
      <header class="sticky top-0 z-[100] flex items-center gap-4 px-10 py-4 max-[900px]:px-6 bg-white border-b border-[#EEEDF5]">
        <button
          class="hidden max-[900px]:flex w-9 h-9 border border-[#E8E7F2] bg-white cursor-pointer rounded-xl items-center justify-center text-[#443E8D] hover:bg-[#F0EFF9] transition-colors"
          @click="sidebarOpen = !sidebarOpen"
          aria-label="Toggle sidebar"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#F0EFF9] text-[0.6rem] font-bold tracking-wider uppercase text-[#443E8D]">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
              Feedback
            </span>
          </div>
          <h1 class="text-[1.1rem] font-bold text-[#1A1830] m-0 tracking-tight">
            Catatan Revisi
          </h1>
        </div>

        <div class="flex-shrink-0 flex items-center gap-2 bg-[#F0EFF9] px-3.5 py-2 rounded-xl">
          <span class="text-[0.6rem] font-bold uppercase tracking-wider text-[#7B77B8]">Total</span>
          <span class="text-[1.1rem] font-black leading-none text-[#443E8D]">{{ totalFeedback }}</span>
        </div>
      </header>

      <!-- ── MAIN CONTENT ── -->
      <main class="py-8 px-10 max-[900px]:p-6 flex flex-col gap-8 max-w-[1200px] mx-auto w-full">

        <!-- Stats -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white p-5 rounded-2xl border border-[#EEEDF5] flex flex-col gap-3">
            <div class="w-8 h-8 rounded-xl bg-[#F0EFF9] flex items-center justify-center">
              <svg class="w-4 h-4 text-[#443E8D]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
            </div>
            <div>
              <div class="text-[0.68rem] font-semibold text-[#9896C8] uppercase tracking-wider mb-1">Total Catatan</div>
              <div class="text-[1.75rem] font-black text-[#1A1830] tracking-tight leading-none">{{ totalFeedback }}</div>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-[#EEEDF5] flex flex-col gap-3">
            <div class="w-8 h-8 rounded-xl bg-[#ECFDF5] flex items-center justify-center">
              <svg class="w-4 h-4 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <div class="text-[0.68rem] font-semibold text-[#9896C8] uppercase tracking-wider mb-1">Sudah Diperbaiki</div>
              <div class="text-[1.75rem] font-black text-[#10B981] tracking-tight leading-none">{{ resolvedFeedback }}</div>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-[#EEEDF5] flex flex-col gap-3">
            <div class="w-8 h-8 rounded-xl bg-[#FEF9EC] flex items-center justify-center">
              <svg class="w-4 h-4 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <div class="text-[0.68rem] font-semibold text-[#9896C8] uppercase tracking-wider mb-1">Sedang Dikerjakan</div>
              <div class="text-[1.75rem] font-black text-[#F59E0B] tracking-tight leading-none">{{ pendingFeedback }}</div>
            </div>
          </div>

          <div class="bg-white p-5 rounded-2xl border border-[#EEEDF5] flex flex-col gap-3">
            <div class="w-8 h-8 rounded-xl bg-[#FEF2F2] flex items-center justify-center">
              <svg class="w-4 h-4 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <div>
              <div class="text-[0.68rem] font-semibold text-[#9896C8] uppercase tracking-wider mb-1">Kesalahan Sering</div>
              <div class="text-[1.75rem] font-black text-[#EF4444] tracking-tight leading-none">{{ repeatErrors.length }}</div>
            </div>
          </div>
        </div>

        <!-- Repeated Errors -->
        <div v-if="repeatErrors.length > 0" class="flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <h2 class="text-[1rem] font-bold text-[#1A1830] tracking-tight m-0">Kesalahan Sering Muncul</h2>
            <span class="text-[0.6rem] font-bold px-2 py-0.5 bg-[#F0EFF9] text-[#443E8D] rounded-full uppercase tracking-wider">Perhatikan</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="(error, idx) in repeatErrors"
              :key="idx"
              class="bg-white p-5 rounded-2xl border border-[#EEEDF5] flex flex-col gap-3 hover:border-[#C4C1E8] transition-colors"
            >
              <div class="flex justify-between items-start gap-3">
                <span class="text-[0.9rem] font-bold text-[#1A1830] tracking-tight leading-snug">{{ error.type }}</span>
                <span class="shrink-0 text-[0.6rem] font-bold px-2 py-0.5 bg-[#F0EFF9] text-[#443E8D] border border-[#D8D6F0] rounded-full tracking-wider">{{ error.count }}×</span>
              </div>
              <p class="text-[0.8rem] text-[#6B68A8] leading-relaxed m-0">{{ error.description }}</p>
              <div class="flex items-start gap-2.5 bg-[#F8F7FD] rounded-xl p-3.5 border border-[#EEEDF5]">
                <svg class="w-3.5 h-3.5 text-[#443E8D] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                <span class="text-[0.75rem] text-[#443E8D] font-medium leading-relaxed">{{ error.suggestion }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- All Feedback List -->
        <div class="flex flex-col gap-5">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 class="text-[1rem] font-bold text-[#1A1830] tracking-tight m-0">Daftar Catatan Mentor</h2>
            <div class="flex gap-2.5 w-full sm:w-auto">
              <div class="relative flex-1 sm:w-60">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9896C8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                <input
                  v-model="feedbackSearch"
                  type="text"
                  placeholder="Cari catatan..."
                  class="w-full pl-9 pr-4 py-2 bg-white border border-[#E8E7F2] rounded-xl text-[0.82rem] font-medium text-[#1A1830] placeholder-[#B5B3D8] focus:border-[#443E8D] focus:ring-2 focus:ring-[#443E8D]/10 outline-none transition-all"
                >
              </div>
              <select
                v-model="feedbackSort"
                class="px-3 py-2 bg-white border border-[#E8E7F2] rounded-xl text-[0.82rem] font-medium text-[#1A1830] focus:border-[#443E8D] focus:ring-2 focus:ring-[#443E8D]/10 outline-none transition-all cursor-pointer"
              >
                <option value="newest">Terbaru</option>
                <option value="oldest">Terlama</option>
                <option value="by-mentor">Mentor</option>
              </select>
            </div>
          </div>

          <div class="flex flex-col gap-3">
            <div
              v-for="fb in filteredFeedbacks"
              :key="fb.id"
              class="bg-white border border-[#EEEDF5] rounded-2xl overflow-hidden hover:border-[#C4C1E8] transition-all"
            >
              <!-- Card header -->
              <div class="flex justify-between items-center px-5 pt-5 pb-4 gap-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-9 h-9 rounded-xl flex items-center justify-center font-black text-[0.8rem] text-white shrink-0"
                    :style="{ background: fb.avatarBg }"
                  >
                    {{ fb.mentorInit }}
                  </div>
                  <div class="flex flex-col gap-0.5">
                    <div class="font-bold text-[#1A1830] text-[0.88rem] tracking-tight leading-none">{{ fb.mentorName }}</div>
                    <div class="text-[0.68rem] font-medium text-[#B5B3D8] leading-none">{{ fb.date }}</div>
                  </div>
                </div>

                <span
                  class="text-[0.6rem] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border shrink-0"
                  :class="fb.status === 'pending'
                    ? 'bg-[#FEF9EC] text-[#D97706] border-[#FCD34D]/50'
                    : 'bg-[#ECFDF5] text-[#059669] border-[#6EE7B7]/50'"
                >
                  {{ fb.statusLabel }}
                </span>
              </div>

              <!-- Divider -->
              <div class="h-px bg-[#F3F2FA] mx-5"></div>

              <!-- Card body -->
              <div class="px-5 py-4 flex flex-col gap-3">
                <!-- Tags -->
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-[0.65rem] font-semibold text-[#443E8D] bg-[#F0EFF9] px-2 py-0.5 rounded-md border border-[#D8D6F0]">{{ fb.project }}</span>
                  <span class="text-[0.65rem] font-semibold text-[#6B68A8] bg-[#F8F7FD] px-2 py-0.5 rounded-md border border-[#EEEDF5]">{{ fb.category }}</span>
                </div>

                <!-- Comment -->
                <p class="text-[0.82rem] text-[#4A476F] leading-relaxed m-0 border-l-2 border-[#443E8D]/25 pl-3">{{ fb.comment }}</p>
              </div>

              <!-- Card footer -->
              <div class="px-5 pb-5 flex justify-end">
                <button
                  @click="markAsResolved(fb.id)"
                  class="text-[0.75rem] font-bold px-4 py-2 rounded-xl transition-all"
                  :class="fb.status === 'completed'
                    ? 'bg-[#F8F7FD] text-[#6B68A8] border border-[#EEEDF5] hover:bg-[#F0EFF9]'
                    : 'bg-[#443E8D] text-white hover:bg-[#3A3478] shadow-sm shadow-[#443E8D]/20'"
                >
                  {{ fb.status === 'completed' ? '✓ Sudah diperbaiki' : 'Tandai Selesai' }}
                </button>
              </div>
            </div>

            <div
              v-if="filteredFeedbacks.length === 0"
              class="flex flex-col items-center justify-center py-16 gap-3 border border-dashed border-[#D8D6F0] rounded-2xl bg-[#F8F7FD]"
            >
              <div class="w-10 h-10 rounded-2xl bg-[#F0EFF9] flex items-center justify-center">
                <svg class="w-5 h-5 text-[#9896C8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <span class="text-[0.82rem] font-medium text-[#9896C8]">Tidak ada catatan yang ditemukan.</span>
            </div>
          </div>
        </div>

      </main>
    </div>

    <!-- Sidebar overlay (mobile only) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-[rgba(15,23,42,0.15)] z-[150] hidden max-[900px]:block backdrop-blur-[2px]"
      @click="sidebarOpen = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import StudentSidebar from '~/components/student/StudentSidebar.vue'

useSeoMeta({
  title: 'Catatan Revisi — Pixelnoid Academy',
  description: 'Kelola catatan dari mentor, revisi proyek, dan lihat kesalahan yang sering muncul supaya makin jago.'
})

definePageMeta({ layout: 'dashboard' })

/* Sidebar state */
const sidebarOpen = ref(false)
const showFilters = ref(false)

/* Date */
const todayStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

/* Search & Sort */
const feedbackSearch = ref('')
const feedbackSort = ref('newest')
const activeRevisionTab = ref('pending')

/* All Feedback Data — simplified for students */
const allFeedbacks = reactive([
  {
    id: 1,
    mentorName: 'Kak Yudha',
    mentorInit: 'KY',
    avatarBg: 'linear-gradient(135deg,#443E8D,#7B77B8)',
    date: '2 hari lalu',
    rating: 4,
    project: 'Landing Page Produk',
    category: 'Kode',
    comment: 'Struktur HTML sudah rapi, tapi coba pisahkan CSS ke file terpisah ya. Jangan lupa tambahkan komentar di bagian yang rumit.',
    tags: ['HTML', 'CSS', 'Rapi'],
    status: 'pending',
    statusLabel: 'Sedang Dikerjakan'
  },
  {
    id: 2,
    mentorName: 'Kak Siti',
    mentorInit: 'KS',
    avatarBg: 'linear-gradient(135deg,#ec4899,#f472b6)',
    date: '5 hari lalu',
    rating: 5,
    project: 'Landing Page Produk',
    category: 'Tampilan',
    comment: 'Desainnya sudah sesuai sama yang diminta! Warna dan jarak antar elemen pas. Pertahankan ya!',
    tags: ['Desain', 'Warna', 'Spacing'],
    status: 'completed',
    statusLabel: 'Sudah Diperbaiki'
  },
  {
    id: 3,
    mentorName: 'Kak Bambang',
    mentorInit: 'KB',
    avatarBg: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
    date: '1 minggu lalu',
    rating: 3,
    project: 'Aplikasi CRUD',
    category: 'Logika',
    comment: 'Fungsi tambah data sudah jalan, tapi belum ada pengecekan kalau inputnya kosong. Tambahkan validasi ya.',
    tags: ['PHP', 'Validasi', 'Form'],
    status: 'pending',
    statusLabel: 'Sedang Dikerjakan'
  },
  {
    id: 4,
    mentorName: 'Kak Yudha',
    mentorInit: 'KY',
    avatarBg: 'linear-gradient(135deg,#443E8D,#7B77B8)',
    date: '1 minggu lalu',
    rating: 4,
    project: 'UI Design App Kasir',
    category: 'Dokumentasi',
    comment: 'Flow desain sudah bagus. Coba tambahkan penjelasan singkat di setiap layar supaya tim developer paham.',
    tags: ['Figma', 'Dokumentasi'],
    status: 'completed',
    statusLabel: 'Sudah Diperbaiki'
  },
  {
    id: 5,
    mentorName: 'Kak Siti',
    mentorInit: 'KS',
    avatarBg: 'linear-gradient(135deg,#ec4899,#f472b6)',
    date: '10 hari lalu',
    rating: 3,
    project: 'Landing Page Produk',
    category: 'Aksesibilitas',
    comment: 'Beberapa tombol belum ada tulisan alternatif untuk pembaca layar. Tambahkan atribut alt ya.',
    tags: ['Aksesibilitas', 'HTML'],
    status: 'pending',
    statusLabel: 'Sedang Dikerjakan'
  },
  {
    id: 6,
    mentorName: 'Kak Bambang',
    mentorInit: 'KB',
    avatarBg: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
    date: '2 minggu lalu',
    rating: 4,
    project: 'Aplikasi CRUD',
    category: 'Keamanan',
    comment: 'Bagian login belum aman dari serangan SQL injection. Gunakan prepared statements ya.',
    tags: ['Keamanan', 'PHP', 'SQL'],
    status: 'completed',
    statusLabel: 'Sudah Diperbaiki'
  }
])

/* Computed: Total & Pending Count */
const totalFeedback = computed(() => allFeedbacks.length)
const resolvedFeedback = computed(() => allFeedbacks.filter(f => f.status === 'completed').length)
const pendingFeedback = computed(() => allFeedbacks.filter(f => f.status === 'pending').length)

/* Revision Tabs */
const revisionTabs = computed(() => [
  { id: 'pending', label: 'Sedang Dikerjakan', count: pendingFeedback.value },
  { id: 'done', label: 'Sudah Selesai', count: resolvedFeedback.value }
])

/* Pending & Completed Revisions */
const pendingRevisions = computed(() => allFeedbacks.filter(f => f.status === 'pending').map((f, idx) => ({
  id: f.id,
  title: f.category,
  mentorName: f.mentorName,
  date: f.date,
  message: f.comment,
  project: f.project,
  priority: idx === 0 ? 'high' : idx === 1 ? 'medium' : 'low',
  priorityLabel: idx === 0 ? 'Penting' : idx === 1 ? 'Sedang' : 'Biasa'
})))

const completedRevisions = computed(() => allFeedbacks.filter(f => f.status === 'completed').map(f => ({
  id: f.id,
  title: f.category,
  mentorName: f.mentorName,
  completedDate: f.date,
  message: f.comment,
  project: f.project
})))

/* Repeat Errors — simplified for students */
const repeatErrors = reactive([
  {
    type: 'CSS Belum Rapi',
    count: 3,
    severity: 'medium',
    description: 'Kadang masih menulis CSS langsung di tag HTML atau campur-campur di satu file.',
    projects: ['Landing Page', 'Portfolio'],
    suggestion: 'Pisahkan CSS ke file .css tersendiri. Gunakan class yang jelas dan konsisten.'
  },
  {
    type: 'Validasi Input',
    count: 3,
    severity: 'high',
    description: 'Form sering tidak dicek dulu sebelum dikirim, bisa bikin error.',
    projects: ['Aplikasi CRUD', 'Landing Page'],
    suggestion: 'Selalu cek apakah input kosong atau formatnya salah sebelum diproses.'
  },
  {
    type: 'Komentar Kode',
    count: 2,
    severity: 'low',
    description: 'Kode yang rumit belum diberi penjelasan, susah dibaca ulang.',
    projects: ['Aplikasi CRUD', 'Portfolio'],
    suggestion: 'Tambahkan komentar singkat di bagian yang rumit supaya mudah dipahami nanti.'
  },
  {
    type: 'Responsive Design',
    count: 2,
    severity: 'medium',
    description: 'Tampilan di HP belum diperhatikan, kadang jadi berantakan.',
    projects: ['Landing Page', 'UI Design'],
    suggestion: 'Cek tampilan di HP dengan inspect element. Gunakan media query CSS.'
  }
])

/* Project Feedbacks — aligned with Academy projects */
const projectFeedbacks = reactive([
  {
    id: 'landing-page',
    name: 'Landing Page Produk',
    icon: '🌐',
    tech: 'HTML, CSS, JavaScript',
    feedbackCount: 3,
    pendingCount: 2,
    completedCount: 1,
    mentors: ['Kak Yudha', 'Kak Siti']
  },
  {
    id: 'crud',
    name: 'Aplikasi CRUD',
    icon: '🗄️',
    tech: 'PHP, MySQL',
    feedbackCount: 2,
    pendingCount: 1,
    completedCount: 1,
    mentors: ['Kak Bambang']
  },
  {
    id: 'ui-design',
    name: 'UI Design App Kasir',
    icon: '🎨',
    tech: 'Figma',
    feedbackCount: 1,
    pendingCount: 0,
    completedCount: 1,
    mentors: ['Kak Yudha']
  }
])

/* Search & Filter Feedbacks */
const filteredFeedbacks = computed(() => {
  let results = [...allFeedbacks]

  if (feedbackSearch.value) {
    const query = feedbackSearch.value.toLowerCase()
    results = results.filter(f =>
      f.mentorName.toLowerCase().includes(query) ||
      f.project.toLowerCase().includes(query) ||
      f.comment.toLowerCase().includes(query) ||
      f.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  if (feedbackSort.value === 'newest') {
    results.sort((a, b) => b.id - a.id)
  } else if (feedbackSort.value === 'oldest') {
    results.sort((a, b) => a.id - b.id)
  } else if (feedbackSort.value === 'by-mentor') {
    results.sort((a, b) => a.mentorName.localeCompare(b.mentorName))
  }

  return results
})

/* Actions */
const markAsResolved = (feedbackId: number) => {
  const feedback = allFeedbacks.find(f => f.id === feedbackId)
  if (feedback) {
    feedback.status = feedback.status === 'pending' ? 'completed' : 'pending'
    feedback.statusLabel = feedback.status === 'pending' ? 'Sedang Dikerjakan' : 'Sudah Diperbaiki'
  }
}

const toggleRevision = (revisionId: number) => {
  const feedback = allFeedbacks.find(f => f.id === revisionId)
  if (feedback) {
    feedback.status = 'completed'
    feedback.statusLabel = 'Sudah Diperbaiki'
  }
}
</script>

<style>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>