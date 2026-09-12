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
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#F0EFF9] text-[0.6rem] font-bold tracking-wider uppercase text-[#443E8D]">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Mentorship
            </span>
          </div>
          <h1 class="text-[1.1rem] font-bold text-[#1A1830] m-0 tracking-tight">
            Sesi Belajar &amp; Check-in
          </h1>
        </div>

        <div class="flex-shrink-0 flex items-center gap-2 bg-[#F0EFF9] px-3.5 py-2 rounded-xl">
          <span class="text-[0.6rem] font-bold uppercase tracking-wider text-[#7B77B8]">Phase</span>
          <span class="text-[1.1rem] font-black leading-none text-[#443E8D]">{{ currentPhase }}</span>
        </div>
      </header>

      <!-- ── MAIN CONTENT ── -->
      <main class="py-8 px-10 max-[900px]:p-6 flex flex-col gap-8 max-w-[1200px] mx-auto w-full">

        <!-- Phase Progress Banner -->
        <section class="relative overflow-hidden rounded-2xl bg-[#443E8D] p-7 lg:p-8">
          <!-- Decorative circle -->
          <div class="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/5"></div>
          <div class="pointer-events-none absolute -bottom-10 right-32 w-40 h-40 rounded-full bg-white/5"></div>

          <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
            <!-- Phase Info -->
            <div class="flex flex-col gap-1 flex-1">
              <span class="text-[0.6rem] font-bold uppercase tracking-wider text-white/60">📍 Kamu sekarang di</span>
              <h2 class="text-[1.2rem] font-bold text-white tracking-tight m-0">Phase 2 — Build &amp; Debug</h2>
              <p class="text-[0.8rem] text-white/70 leading-relaxed m-0">Week 5–9 · Fokus: mulai bangun dari nol, belajar debugging, dan susun code yang rapi.</p>
            </div>

            <!-- Phase Steps + Progress -->
            <div class="flex flex-col gap-4 lg:min-w-[280px]">
              <div class="flex items-center gap-3 flex-wrap">
                <div
                  v-for="phase in phases"
                  :key="phase.id"
                  class="flex items-center gap-2"
                >
                  <div
                    class="w-6 h-6 rounded-full flex items-center justify-center text-[0.65rem] font-bold flex-shrink-0 transition-all"
                    :class="phase.id < currentPhase
                      ? 'bg-white text-[#443E8D]'
                      : phase.id === currentPhase
                        ? 'bg-white text-[#443E8D] ring-2 ring-white/40'
                        : 'bg-white/20 text-white/60'"
                  >
                    <svg v-if="phase.id < currentPhase" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    <span v-else>{{ phase.id }}</span>
                  </div>
                  <span class="text-[0.72rem] font-semibold" :class="phase.id === currentPhase ? 'text-white' : 'text-white/55'">{{ phase.name }}</span>
                  <span v-if="phase.id < phases.length" class="text-white/30 text-xs">·</span>
                </div>
              </div>
              <div>
                <div class="h-[5px] bg-white/20 rounded-full overflow-hidden mb-1.5">
                  <div class="h-full bg-white rounded-full transition-all" style="width: 44%"></div>
                </div>
                <span class="text-[0.68rem] text-white/60">Week 7 dari 16 · 44% selesai</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Booking Sesi -->
        <div class="flex flex-col gap-4">
          <div>
            <h2 class="text-[1rem] font-bold text-[#1A1830] tracking-tight m-0 mb-0.5">Booking Sesi</h2>
            <p class="text-[0.8rem] text-[#9896C8] m-0">Pilih tipe sesi sesuai kebutuhanmu minggu ini.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Main Class -->
            <div class="bg-white border border-[#EEEDF5] rounded-2xl p-5 flex items-start gap-4 hover:border-[#C4C1E8] transition-all">
              <div class="w-12 h-12 rounded-xl bg-[#F0EFF9] flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-[#443E8D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9 9h6M9 12h6M9 15h4"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <span class="inline-block text-[0.6rem] font-bold text-[#443E8D] bg-[#F0EFF9] px-2 py-0.5 rounded-full mb-2">60–90 menit</span>
                <h3 class="text-[0.9rem] font-bold text-[#1A1830] mb-1 m-0">Main Class</h3>
                <p class="text-[0.78rem] text-[#6B68A8] leading-relaxed m-0">Sesi utama belajar konsep, live coding, dan mulai bangun project. Materi dibedakan per track.</p>
              </div>
              <button class="shrink-0 self-center text-[0.75rem] font-bold px-3.5 py-2 rounded-xl bg-[#443E8D] text-white hover:bg-[#3A3478] transition-all shadow-sm shadow-[#443E8D]/20">
                Gabung
              </button>
            </div>

            <!-- Micro Session -->
            <div class="bg-white border border-[#EEEDF5] rounded-2xl p-5 flex items-start gap-4 hover:border-[#A7F3D0] transition-all">
              <div class="w-12 h-12 rounded-xl bg-[#ECFDF5] flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <span class="inline-block text-[0.6rem] font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full mb-2">30–45 menit · 2x/minggu</span>
                <h3 class="text-[0.9rem] font-bold text-[#1A1830] mb-1 m-0">Micro Session</h3>
                <p class="text-[0.78rem] text-[#6B68A8] leading-relaxed m-0">Check progress project, debug bareng mentor, dan selesaikan masalah yang bikin stuck.</p>
              </div>
              <NuxtLink
                to="/student/micro-session-booking"
                class="shrink-0 self-center text-[0.75rem] font-bold px-3.5 py-2 rounded-xl bg-[#10B981] text-white hover:bg-[#059669] transition-all shadow-sm shadow-[#10B981]/20"
              >
                Pilih Jadwal
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- Main Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">

          <!-- LEFT: Jadwal + Catatan Mentor -->
          <div class="flex flex-col gap-6">

            <!-- Jadwal Mendatang -->
            <div class="bg-white border border-[#EEEDF5] rounded-2xl overflow-hidden">
              <div class="flex items-center justify-between px-5 py-4 border-b border-[#F3F2FA]">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FEF9EC] text-[0.65rem] font-bold uppercase tracking-wider text-[#D97706]">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></span>
                  Jadwal Sesi Mendatang
                </span>
              </div>
              <div class="flex flex-col divide-y divide-[#F3F2FA]">
                <div v-for="session in upcomingSessions" :key="session.id" class="flex items-center gap-4 px-5 py-4 hover:bg-[#FAFAFA] transition-colors">
                  <!-- Date box -->
                  <div class="w-12 h-12 rounded-xl bg-white border border-[#EEEDF5] flex flex-col items-center justify-center flex-shrink-0 shadow-sm">
                    <span class="text-[1rem] font-black text-[#1A1830] leading-none">{{ session.day }}</span>
                    <span class="text-[0.55rem] font-bold text-[#443E8D] uppercase tracking-wider mt-0.5">{{ session.month }}</span>
                  </div>
                  <!-- Details -->
                  <div class="flex-1 min-w-0">
                    <span
                      class="inline-block text-[0.6rem] font-bold px-1.5 py-0.5 rounded mb-1"
                      :class="session.type === 'Main Class' ? 'bg-[#F0EFF9] text-[#443E8D]' : 'bg-[#ECFDF5] text-[#10B981]'"
                    >{{ session.type }}</span>
                    <h4 class="text-[0.85rem] font-bold text-[#1A1830] m-0 mb-1 truncate">{{ session.title }}</h4>
                    <div class="flex items-center gap-3 text-[0.72rem] text-[#9896C8]">
                      <span class="flex items-center gap-1">
                        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {{ session.time }}
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        {{ session.mentor }}
                      </span>
                    </div>
                  </div>
                  <button class="shrink-0 text-[0.72rem] font-bold px-3 py-1.5 rounded-lg bg-[#443E8D] text-white hover:bg-[#3A3478] transition-all">
                    Gabung
                  </button>
                </div>

                <div v-if="upcomingSessions.length === 0" class="flex items-center justify-center py-10 text-[0.82rem] text-[#B5B3D8]">
                  Belum ada sesi terjadwal. Yuk booking dulu! 👆
                </div>
              </div>
            </div>

            <!-- Catatan Mentor -->
            <div class="bg-white border border-[#EEEDF5] rounded-2xl overflow-hidden">
              <div class="flex items-center px-5 py-4 border-b border-[#F3F2FA]">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F0EFF9] text-[0.65rem] font-bold uppercase tracking-wider text-[#443E8D]">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#443E8D]"></span>
                  Catatan &amp; Feedback Mentor
                </span>
              </div>
              <div class="flex flex-col divide-y divide-[#F3F2FA]">
                <div v-for="note in mentorNotes" :key="note.id" class="p-5 flex flex-col gap-3">
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-[0.7rem] flex-shrink-0 bg-gradient-to-br from-[#443E8D] to-[#7B77B8]">
                        {{ note.init }}
                      </div>
                      <div>
                        <div class="text-[0.85rem] font-bold text-[#1A1830] leading-none mb-0.5">{{ note.mentor }}</div>
                        <div class="text-[0.68rem] text-[#9896C8]">{{ note.topic }}</div>
                      </div>
                    </div>
                    <span class="text-[0.65rem] text-[#B5B3D8] whitespace-nowrap">{{ note.date }}</span>
                  </div>
                  <p class="text-[0.8rem] text-[#4A476F] leading-relaxed m-0 border-l-2 border-[#443E8D]/25 pl-3 italic">"{{ note.note }}"</p>
                  <div class="flex flex-wrap gap-1.5">
                    <span v-for="tag in note.tags" :key="tag" class="text-[0.65rem] font-semibold text-[#6B68A8] bg-[#F0EFF9] px-2 py-0.5 rounded-md border border-[#D8D6F0]">{{ tag }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: Cara Kerja + Riwayat -->
          <div class="flex flex-col gap-6">

            <!-- Cara Kerja Program -->
            <div class="bg-white border border-[#EEEDF5] rounded-2xl overflow-hidden">
              <div class="flex items-center px-5 py-4 border-b border-[#F3F2FA]">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[0.65rem] font-bold uppercase tracking-wider text-[#2563EB]">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></span>
                  Cara Kerja Program
                </span>
              </div>
              <div class="flex flex-col divide-y divide-[#F3F2FA]">
                <div v-for="item in howItWorks" :key="item.title" class="flex items-start gap-3.5 px-5 py-3.5">
                  <div
                    class="w-9 h-9 rounded-xl flex items-center justify-center text-[1rem] flex-shrink-0"
                    :class="item.bgClass"
                  >{{ item.icon }}</div>
                  <div>
                    <div class="text-[0.83rem] font-bold text-[#1A1830] mb-0.5">{{ item.title }}</div>
                    <div class="text-[0.75rem] text-[#6B68A8] leading-relaxed">{{ item.desc }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Riwayat Sesi -->
            <div class="bg-white border border-[#EEEDF5] rounded-2xl overflow-hidden">
              <div class="flex items-center px-5 py-4 border-b border-[#F3F2FA]">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F3F4F6] text-[0.65rem] font-bold uppercase tracking-wider text-[#4B5563]">
                  <span class="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]"></span>
                  Riwayat Sesimu
                </span>
              </div>
              <div class="flex flex-col divide-y divide-[#F3F2FA]">
                <div v-for="h in historySessions" :key="h.id" class="flex items-center gap-3 px-5 py-3.5">
                  <div
                    class="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    :class="h.type === 'Main Class' ? 'bg-[#F0EFF9]' : 'bg-[#ECFDF5]'"
                  >
                    <svg v-if="h.type === 'Main Class'" class="w-4 h-4 text-[#443E8D]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9 9h6M9 12h6M9 15h4"/></svg>
                    <svg v-else class="w-4 h-4 text-[#10B981]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="text-[0.82rem] font-bold text-[#1A1830] m-0 mb-0.5 truncate">{{ h.topic }}</h4>
                    <p class="text-[0.68rem] text-[#9896C8] m-0">{{ h.date }} · {{ h.type }}</p>
                  </div>
                  <span
                    class="text-[0.6rem] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                    :class="h.status === 'Selesai' ? 'bg-[#ECFDF5] text-[#10B981]' : 'bg-[#FEF2F2] text-[#EF4444]'"
                  >{{ h.status }}</span>
                </div>
              </div>
              <div class="px-5 pb-4 pt-2">
                <button class="w-full py-2.5 rounded-xl text-[0.75rem] font-bold text-[#6B68A8] bg-[#F8F7FD] border border-[#EEEDF5] hover:bg-[#F0EFF9] transition-colors">
                  Lihat Lebih Banyak
                </button>
              </div>
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
import { ref } from 'vue'
import StudentSidebar from '~/components/student/StudentSidebar.vue'

useSeoMeta({
  title: 'Sesi Belajar – Pixelnoid Academy',
  description: 'Booking Main Class, Micro Session, dan pantau progress projectmu.'
})

definePageMeta({ layout: 'dashboard' })

const sidebarOpen = ref(false)
const currentPhase = ref(2)

const phases = ref([
  { id: 1, name: 'Foundation & Flow' },
  { id: 2, name: 'Build & Debug' },
  { id: 3, name: 'Real Project' },
])

const howItWorks = ref([
  {
    icon: '📚',
    title: 'Main Class',
    desc: 'Belajar konsep + live coding. Tiap sesi ditutup dengan arahan project.',
    bgClass: 'bg-[#F0EFF9]'
  },
  {
    icon: '⚡',
    title: 'Micro Session',
    desc: 'Cek progress, debug bareng, dan selesaikan masalah. 2x seminggu.',
    bgClass: 'bg-[#ECFDF5]'
  },
  {
    icon: '🛠️',
    title: 'Project-Based Flow',
    desc: 'Tiap minggu ada output kecil. Project = bukti nyata kamu belajar.',
    bgClass: 'bg-[#FEF9EC]'
  },
  {
    icon: '🗓️',
    title: 'Jadwal Fleksibel',
    desc: 'Pilih hari belajarmu sendiri. Tetap ada ritme dan target output.',
    bgClass: 'bg-[#EFF6FF]'
  }
])

const upcomingSessions = ref([
  {
    id: 1,
    day: '14', month: 'Mei',
    title: 'Logic & Function Dasar',
    time: '16:00 – 17:30 WIB',
    type: 'Main Class',
    mentor: 'Lead Mentor'
  },
  {
    id: 2,
    day: '16', month: 'Mei',
    title: 'Micro Session – Debug & Review Project',
    time: '19:30 – 20:15 WIB',
    type: 'Micro Session',
    mentor: 'Support Mentor'
  }
])

const mentorNotes = ref([
  {
    id: 1,
    init: 'LM', mentor: 'Lead Mentor',
    topic: 'Main Class · Logic Dasar',
    date: '09 Mei 2026',
    note: 'Kamu sudah paham cara nulis function dengan benar. Minggu depan coba terapkan ke fitur filter di project kamu. Kalau stuck, langsung muncul di Micro Session ya!',
    tags: ['Function', 'Project', 'Keep Going!']
  },
  {
    id: 2,
    init: 'SM', mentor: 'Support Mentor',
    topic: 'Micro Session · Debug',
    date: '07 Mei 2026',
    note: 'Error yang kamu temukan tadi itu karena variabel belum didefinisikan sebelum dipanggil. Coba biasakan baca pesan error dulu sebelum langsung tanya, itu latihan penting banget.',
    tags: ['Debugging', 'Soft-skill']
  }
])

const historySessions = ref([
  { id: 1, topic: 'Logic & Struktur Berpikir', date: '09 Mei 2026', type: 'Main Class', status: 'Selesai' },
  { id: 2, topic: 'Micro Session – Review Project', date: '07 Mei 2026', type: 'Micro Session', status: 'Selesai' },
  { id: 3, topic: 'Intro Function & Data', date: '02 Mei 2026', type: 'Main Class', status: 'Selesai' },
  { id: 4, topic: 'Micro Session – Debugging', date: '30 Apr 2026', type: 'Micro Session', status: 'Selesai' },
  { id: 5, topic: 'Template & Submission Pertama', date: '25 Apr 2026', type: 'Main Class', status: 'Missed' },
])
</script>