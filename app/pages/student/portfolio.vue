<template>
  <div class="min-h-screen bg-[#F7F7F9] font-['Instrument_Sans','Raleway',sans-serif] relative overflow-x-hidden">

    <StudentSidebar :open="sidebarOpen" @update:open="sidebarOpen = $event" />

    <div class="min-[901px]:ml-[210px] flex-1 min-w-0 relative z-10 flex flex-col">
      <!-- Topbar -->
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
              Portfolio Builder
            </h1>
            <p class="mt-0.5 sm:mt-1 text-[0.7rem] sm:text-[0.82rem] leading-relaxed text-[#71717A]">
              Susun project terbaikmu, siap untuk direkrut.
            </p>
          </div>

          <div class="hidden sm:flex items-center gap-3">
            <button class="px-4 py-2 bg-white border border-[#E4E4E7] rounded-xl text-[0.85rem] font-bold text-[#18181B] hover:bg-[#F4F4F5] transition-colors shadow-sm">
              Preview
            </button>
            <button class="px-4 py-2 bg-[#443E8D] text-white rounded-xl text-[0.85rem] font-bold hover:bg-[#3A3478] shadow-sm transition-colors flex items-center gap-2">
              Publish <ArrowUpRightIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main class="p-8 max-[900px]:p-5 flex flex-col gap-8 w-full max-w-[1440px] mx-auto">
        <!-- Publish / Export Section -->
        <section>
          <div class="bg-white rounded-2xl border border-[#E4E4E7] p-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm relative overflow-hidden group">
            <div class="absolute top-0 right-0 w-64 h-64 bg-[#443E8D]/[0.02] blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-125 transition-transform duration-700"></div>
            
            <div class="flex flex-col gap-4 relative z-10">
              <div class="flex items-center gap-2.5 text-[0.6875rem] font-black uppercase tracking-widest text-[#443E8D]">
                <span class="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
                Portfolio Publikmu Siap Dibagikan
              </div>
              <div class="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-2 pl-4 pr-2">
                <span class="text-[0.6875rem] font-bold text-gray-400 uppercase tracking-widest">Link:</span>
                <a href="#" class="font-mono text-[0.875rem] font-bold text-[#443E8D] hover:underline">pixelnoid.id/p/arka-jenar</a>
                <button class="p-2 bg-white border border-gray-100 rounded-lg text-gray-500 hover:text-[#443E8D] hover:border-[#443E8D]/20 transition-all shadow-sm" title="Salin Link">
                  <ClipboardDocumentIcon class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div class="flex items-center gap-8 relative z-10">
              <div class="flex gap-6">
                <div class="text-center">
                  <span class="block text-2xl font-black text-gray-900 leading-none">{{ projects.filter(p => p.published).length }}</span>
                  <span class="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Publik</span>
                </div>
                <div class="w-px h-10 bg-gray-100"></div>
                <div class="text-center">
                  <span class="block text-2xl font-black text-gray-900 leading-none">{{ projects.length }}</span>
                  <span class="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest mt-1.5">Approved</span>
                </div>
              </div>
              <div class="flex gap-3">
                <button class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-[0.8125rem] font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                  <ArrowDownTrayIcon class="w-4 h-4" />
                  PDF
                </button>
                <button class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#443E8D] text-[0.8125rem] font-bold text-white hover:bg-[#373275] transition-all shadow-lg shadow-[#443E8D]/20">
                  <EyeIcon class="w-4 h-4" />
                  Live View
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Projects Section -->
        <section class="flex flex-col gap-6">
          <div class="flex flex-col gap-1">
            <h2 class="text-xl font-bold text-gray-900 tracking-tight">Katalog Proyek Terverifikasi</h2>
            <p class="text-[0.875rem] text-gray-500 font-light">Pilih project yang sudah selesai di-review mentor untuk dijadikan Case Study portfoliomu.</p>
          </div>

          <div class="flex flex-col gap-4">
            <div v-for="project in projects" :key="project.id" class="bg-white rounded-2xl border border-[#E4E4E7] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300" :class="{ 'ring-2 ring-[#443E8D]/10 border-[#443E8D]/20': activeProjectId === project.id }">
              
              <!-- Project Header -->
              <div class="flex items-center gap-4 p-5 cursor-pointer select-none" @click="toggleProject(project.id)">
                <div class="w-14 h-14 rounded-xl flex items-center justify-center text-white text-lg font-black shadow-lg" :style="{ background: project.bg }">
                  {{ project.initial }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-3 mb-1">
                    <h3 class="text-[1rem] font-bold text-gray-900 tracking-tight truncate">{{ project.name }}</h3>
                    <span class="text-[0.625rem] font-black uppercase tracking-widest px-2 py-0.5 rounded-md" :class="project.published ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-100 text-gray-400 border border-gray-200'">
                      {{ project.published ? 'Live / Publish' : 'Draft' }}
                    </span>
                  </div>
                  <p class="text-[0.8125rem] text-gray-400 font-medium leading-none">{{ project.role }} · {{ project.date }}</p>
                  <div class="flex flex-wrap gap-1.5 mt-2.5">
                    <span v-for="tag in project.tech" :key="tag" class="text-[0.625rem] font-bold font-mono px-2 py-0.5 bg-gray-50 text-gray-500 rounded border border-gray-100">
                      {{ tag }}
                    </span>
                  </div>
                </div>
                <button class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 transition-all hover:bg-[#443E8D]/5 hover:text-[#443E8D]" :class="{ 'rotate-180 bg-[#443E8D]/10 text-[#443E8D]': activeProjectId === project.id }">
                  <ChevronDownIcon class="w-5 h-5 transition-transform duration-300" />
                </button>
              </div>

              <!-- Project Builder -->
              <Transition
                enter-active-class="transition duration-300 ease-out"
                enter-from-class="transform -translate-y-4 opacity-0"
                enter-to-class="transform translate-y-0 opacity-100"
                leave-active-class="transition duration-200 ease-in"
                leave-from-class="transform translate-y-0 opacity-100"
                leave-to-class="transform -translate-y-4 opacity-0"
              >
                <div v-if="activeProjectId === project.id" class="border-t border-gray-50 bg-[#FAFAFA]/50">
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
                    <!-- Setup Column -->
                    <div class="flex flex-col gap-6">
                      <div class="flex flex-col gap-2">
                        <label class="text-[0.75rem] font-bold text-gray-900 uppercase tracking-widest">Judul Tampilan (Display Title)</label>
                        <input type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#443E8D]/10 focus:border-[#443E8D] outline-none transition-all text-[0.875rem] font-bold" v-model="project.displayName" placeholder="E.g. ThreadMark E-Commerce">
                      </div>
                      <div class="flex flex-col gap-2">
                        <label class="text-[0.75rem] font-bold text-gray-900 uppercase tracking-widest">Deskripsi Singkat (Elevator Pitch)</label>
                        <textarea class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#443E8D]/10 focus:border-[#443E8D] outline-none transition-all text-[0.875rem] resize-none" rows="3" v-model="project.shortDesc" placeholder="Jelaskan dalam 1-2 kalimat apa yang proyek ini selesaikan..."></textarea>
                      </div>

                      <!-- Project Links Section -->
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="flex flex-col gap-2">
                          <label class="text-[0.75rem] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            Github Link
                          </label>
                          <input type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#443E8D]/10 focus:border-[#443E8D] outline-none transition-all text-[0.8125rem] font-mono" v-model="project.githubLink" placeholder="https://github.com/...">
                        </div>
                        <div class="flex flex-col gap-2">
                          <label class="text-[0.75rem] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                            <LinkIcon class="w-3.5 h-3.5" />
                            Live Demo Link
                          </label>
                          <input type="text" class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-[#443E8D]/10 focus:border-[#443E8D] outline-none transition-all text-[0.8125rem] font-mono" v-model="project.liveLink" placeholder="https://...">
                        </div>
                      </div>
                      
                      <div class="flex items-center gap-3 cursor-pointer select-none group mt-2" @click="project.published = !project.published">
                        <div class="relative w-11 h-6 rounded-full transition-colors duration-300" :class="project.published ? 'bg-emerald-500' : 'bg-gray-200'">
                          <div class="absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-sm" :class="{ 'translate-x-5': project.published }"></div>
                        </div>
                        <span class="text-[0.875rem] font-bold text-gray-700">Tampilkan proyek ini di portfolio publik</span>
                      </div>
                    </div>

                    <!-- STAR Formula Column -->
                    <div class="flex flex-col gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <div class="flex items-center gap-2.5 mb-2">
                        <DocumentTextIcon class="w-5 h-5 text-[#443E8D]" />
                        <h4 class="text-[0.9375rem] font-bold text-gray-900">Formula Case Study (STAR)</h4>
                      </div>
                      
                      <div class="flex flex-col gap-2">
                        <label class="text-[0.75rem] font-bold text-amber-600 uppercase tracking-widest">1. Situasi & Masalah (Problem)</label>
                        <textarea class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-100 focus:border-amber-400 outline-none transition-all text-[0.8125rem] leading-relaxed" rows="3" v-model="project.problem" placeholder="Apa masalah awal klien? Mengapa proyek ini dibuat?"></textarea>
                      </div>

                      <div class="flex flex-col gap-2">
                        <label class="text-[0.75rem] font-bold text-indigo-600 uppercase tracking-widest">2. Pendekatan & Solusi (Approach)</label>
                        <textarea class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all text-[0.8125rem] leading-relaxed" rows="3" v-model="project.solution" placeholder="Sistem apa yang kamu buat? Tech stack apa yang kamu pilih dan mengapa?"></textarea>
                      </div>

                      <div class="flex flex-col gap-2">
                        <label class="text-[0.75rem] font-bold text-emerald-600 uppercase tracking-widest">3. Dampak & Hasil (Result)</label>
                        <textarea class="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 outline-none transition-all text-[0.8125rem] leading-relaxed" rows="3" v-model="project.result" placeholder="Berapa % peningkatan efisiensi? Apa tanggapan klien? Gunakan metrik!"></textarea>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between p-6 border-t border-gray-100 bg-white">
                    <button class="inline-flex items-center gap-2 text-[0.8125rem] font-bold text-gray-400 hover:text-gray-900 transition-colors">
                      <PhotoIcon class="w-4 h-4" />
                      Kelola Gambar / Thumbnail
                    </button>
                    <div class="flex items-center gap-6">
                      <span class="text-[0.75rem] font-medium text-gray-300 italic">Disimpan otomatis</span>
                      <button class="px-6 py-2.5 rounded-xl bg-[#443E8D] text-[0.8125rem] font-bold text-white hover:bg-[#373275] transition-all shadow-md shadow-[#443E8D]/10" @click="activeProjectId = null">
                        Selesai Edit
                      </button>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </section>
      </main>
    </div>

    <div v-if="sidebarOpen" class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[150] lg:hidden" @click="sidebarOpen = false"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import StudentSidebar from '~/components/student/StudentSidebar.vue'
import {
  Bars3Icon,
  BriefcaseIcon,
  ClipboardDocumentIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  PhotoIcon,
  LinkIcon
} from '@heroicons/vue/24/outline'

useSeoMeta({
  title: 'Portfolio Builder — Pixelnoid Academy',
  description: 'Ubah projectmu menjadi aset portfolio yang tak terbantahkan.'
})

definePageMeta({ layout: 'dashboard' })

const sidebarOpen = ref(false)

/* ── Active Builder State ── */
const activeProjectId = ref<number | null>(1)

const toggleProject = (id: number) => {
  if (activeProjectId.value === id) {
    activeProjectId.value = null
  } else {
    activeProjectId.value = id
  }
}

/* ── MOCK DATA ── */
const projects = ref([
  {
    id: 1,
    name: 'ThreadMark E-Commerce App', displayName: 'ThreadMark.id — Streetwear E-Commerce',
    role: 'Fullstack Eng. & Architect', date: 'Bulan lalu',
    initial: 'TM', bg: 'linear-gradient(135deg, #111827, #374151)',
    tech: ['Nuxt 3', 'Supabase', 'Stripe'],
    published: true,
    githubLink: 'https://github.com/arkajenar/threadmark',
    liveLink: 'https://threadmark.id',
    shortDesc: 'Platform belanja streetwear dengan fitur checkout langsung dan CMS untuk manajemen stok.',
    problem: 'Klien kehilangan potensi 30% penjualan karena mengandalkan manual order via WhatsApp. Klien membutuhkan sistem auto-checkout.',
    solution: 'Membangun aplikasi PWA berbasis Nuxt 3 untuk load sangat cepat di mobile, dan mengintegrasikan Stripe untuk menerima pembayaran kartu otomatis.',
    result: 'Proses pemesanan menjadi 100% otomatis, menekan human-error hingga 0%, dan mempercepat rilis produk baru ke katalog klien dalam hitungan menit.'
  }
])
</script>

<style>
/* Aesthetic and transitions handled by Tailwind */
</style>
