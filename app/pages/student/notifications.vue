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
              Notification Center
            </h1>
            <p class="mt-0.5 sm:mt-1 text-[0.7rem] sm:text-[0.82rem] leading-relaxed text-[#71717A]">
              Jaga ritme kerjamu. Pastikan tidak ada aksi krusial yang tertunda.
            </p>
          </div>
        </div>
      </header>

      <main class="p-8 max-[900px]:p-5 flex flex-col gap-8 max-w-[1440px] mx-auto w-full">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <!-- Left Column: Filters -->
          <aside class="lg:col-span-3 flex flex-col gap-6 lg:sticky lg:top-24">
            <div class="flex flex-col gap-1 px-1">
              <h3 class="text-[0.6875rem] font-black uppercase tracking-widest text-[#A1A1AA]">Filter Aktivitas</h3>
            </div>
            
            <div class="flex flex-col gap-1.5">
              <button 
                v-for="(label, key) in filterLabels" 
                :key="key"
                class="flex items-center gap-3 w-full p-2.5 rounded-xl transition-all duration-200 group"
                :class="currentFilter === key 
                  ? 'bg-white text-[#18181B] shadow-sm border border-[#E4E4E7]' 
                  : 'text-[#71717A] hover:bg-white/50 hover:text-[#18181B]'"
                @click="currentFilter = key"
              >
                <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  :class="currentFilter === key ? filterConfig[key].bgActive : 'bg-[#F4F4F5] group-hover:bg-gray-200/50'"
                >
                  <component :is="filterConfig[key].icon" class="w-4 h-4" :class="currentFilter === key ? filterConfig[key].textActive : 'text-[#A1A1AA]'" />
                </div>
                <span class="text-[0.875rem] font-bold flex-1 text-left">{{ label }}</span>
                <span v-if="getFilterCount(key)" class="text-[0.6875rem] font-black px-2 py-0.5 rounded-full bg-[#F4F4F5] text-[#A1A1AA] group-hover:bg-gray-200 transition-colors">
                  {{ getFilterCount(key) }}
                </span>
              </button>
            </div>
          </aside>

          <!-- Right Column: Feed -->
          <div class="lg:col-span-9 flex flex-col gap-6">
            <div class="bg-white rounded-2xl border border-[#E4E4E7] shadow-sm overflow-hidden flex flex-col min-h-[600px]">
              <!-- Feed Header -->
              <div class="px-6 py-5 border-b border-[#F4F4F5] bg-[#FAFAFA]/30 flex items-center justify-between">
                <h2 class="text-lg font-bold text-[#18181B] tracking-tight flex items-center gap-3">
                  {{ filterLabels[currentFilter] }}
                  <span v-if="unreadCount > 0" class="inline-flex items-center px-2 py-0.5 rounded-md bg-[#443E8D] text-white text-[0.625rem] font-black uppercase tracking-widest">
                    {{ unreadCount }} Belum Dibaca
                  </span>
                </h2>
                <button 
                  @click="markAllAsRead"
                  class="text-[0.8125rem] font-bold text-[#443E8D] hover:underline transition-all"
                >
                  Tandai semua dibaca
                </button>
              </div>

              <!-- Empty State -->
              <div v-if="filteredNotifications.length === 0" class="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div class="w-20 h-20 rounded-3xl bg-[#443E8D]/[0.04] flex items-center justify-center text-[#443E8D]/20 mb-6">
                  <SparklesIcon class="w-10 h-10" />
                </div>
                <h3 class="text-lg font-bold text-[#18181B] mb-1">Inbox-Zero Tercapai</h3>
                <p class="text-[0.875rem] text-[#71717A] font-light max-w-xs">Tidak ada notifikasi di kategori ini. Tetap fokus pada sprintmu!</p>
              </div>

              <!-- Notif List -->
              <div v-else class="flex flex-col">
                <template v-for="(group, dateLabel) in groupedNotifications" :key="dateLabel">
                  <!-- Date Separator -->
                  <div class="px-6 py-3 bg-[#FAFAFA]/50 flex items-center gap-4">
                    <span class="text-[0.625rem] font-black uppercase tracking-widest text-[#A1A1AA] whitespace-nowrap">{{ dateLabel }}</span>
                    <div class="h-px w-full bg-[#F4F4F5]"></div>
                  </div>

                  <div class="flex flex-col">
                    <div 
                      v-for="item in group" 
                      :key="item.id"
                      @click="item.read = true"
                      class="group relative px-6 py-5 flex gap-5 hover:bg-[#FAFAFA]/50 transition-all cursor-pointer border-b border-[#F4F4F5] last:border-0"
                      :class="{ 'bg-[#443E8D]/[0.02]': !item.read }"
                    >
                      <!-- Type Indicator Bar -->
                      <div class="absolute left-0 top-0 bottom-0 w-1 transition-all" :class="[item.read ? 'bg-transparent' : typeConfig[item.type].barColor]"></div>

                      <!-- Icon Wrapper -->
                      <div class="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all shadow-sm" :class="typeConfig[item.type].bg">
                        <component :is="typeConfig[item.type].icon" class="w-6 h-6" :class="typeConfig[item.type].text" />
                      </div>

                      <!-- Content -->
                      <div class="flex-1 min-w-0">
                        <div class="flex items-start justify-between gap-4 mb-1">
                          <h4 class="text-[0.9375rem] font-bold text-[#18181B] tracking-tight group-hover:text-[#443E8D] transition-colors leading-tight">
                            {{ item.title }}
                          </h4>
                          <span class="text-[0.6875rem] font-medium text-[#A1A1AA] whitespace-nowrap pt-0.5">{{ item.time }}</span>
                        </div>
                        <p class="text-[0.875rem] text-[#71717A] font-light leading-relaxed mb-4 line-clamp-2 group-hover:line-clamp-none transition-all">
                          {{ item.desc }}
                        </p>

                        <!-- Actions -->
                        <div v-if="item.actionUrl" class="flex items-center gap-3">
                          <NuxtLink 
                            :to="item.actionUrl" 
                            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-[0.75rem] font-bold transition-all shadow-sm"
                            :class="typeConfig[item.type].btnClass"
                          >
                            {{ typeConfig[item.type].btnLabel }}
                            <ArrowRightIcon class="w-3 h-3" />
                          </NuxtLink>
                          <button v-if="item.secondaryLabel" class="text-[0.75rem] font-bold text-[#A1A1AA] hover:text-[#18181B] transition-colors">
                            {{ item.secondaryLabel }}
                          </button>
                        </div>
                      </div>

                      <!-- Unread Dot -->
                      <div v-if="!item.read" class="absolute top-6 right-6 w-2 h-2 rounded-full bg-[#443E8D] shadow-[0_0_8px_rgba(244,63,94,0.5)]"></div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <div v-if="sidebarOpen" class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[150] lg:hidden" @click="sidebarOpen = false"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StudentSidebar from '~/components/student/StudentSidebar.vue'
import { 
  Bars3Icon, 
  BellIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon,
  FolderIcon,
  Squares2X2Icon,
  SparklesIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

useSeoMeta({
  title: 'Notification Center — Pixelnoid Digital Academy',
  description: 'Pusat notifikasi untuk deadline, feedback mentor, dan pembaruan sistem.'
})

definePageMeta({ layout: 'dashboard' })

const sidebarOpen = ref(false)
const currentFilter = ref('all')

const filterLabels: Record<string, string> = {
  all: 'Semua Aktivitas',
  deadline: 'Deadline Reminder',
  feedback: 'Feedback Masuk',
  revision: 'Revisi Request',
  project: 'Update Project'
}

const filterConfig: Record<string, any> = {
  all: { icon: Squares2X2Icon, bgActive: 'bg-[#443E8D]/10', textActive: 'text-[#443E8D]' },
  deadline: { icon: ClockIcon, bgActive: 'bg-[#443E8D]/10', textActive: 'text-[#443E8D]' },
  feedback: { icon: ChatBubbleLeftRightIcon, bgActive: 'bg-[#443E8D]/10', textActive: 'text-[#443E8D]' },
  revision: { icon: ArrowPathIcon, bgActive: 'bg-[#443E8D]/10', textActive: 'text-[#443E8D]' },
  project: { icon: FolderIcon, bgActive: 'bg-[#443E8D]/10', textActive: 'text-[#443E8D]' },
}

/* ── UI Config by Type ── */
const typeConfig: Record<string, any> = {
  deadline: {
    icon: ClockIcon,
    bg: 'bg-[#F4F4F5]',
    text: 'text-[#71717A]',
    barColor: 'bg-[#A1A1AA]',
    btnLabel: 'Kerjakan Task',
    btnClass: 'bg-[#F4F4F5] text-[#18181B] hover:bg-[#E4E4E7] border border-[#E4E4E7]'
  },
  feedback: {
    icon: ChatBubbleLeftRightIcon,
    bg: 'bg-[#F4F4F5]',
    text: 'text-[#71717A]',
    barColor: 'bg-[#A1A1AA]',
    btnLabel: 'Lihat Review',
    btnClass: 'bg-[#F4F4F5] text-[#18181B] hover:bg-[#E4E4E7] border border-[#E4E4E7]'
  },
  revision: {
    icon: ArrowPathIcon,
    bg: 'bg-[#F4F4F5]',
    text: 'text-[#71717A]',
    barColor: 'bg-[#A1A1AA]',
    btnLabel: 'Buka Revisi',
    btnClass: 'bg-[#F4F4F5] text-[#18181B] hover:bg-[#E4E4E7] border border-[#E4E4E7]'
  },
  project: {
    icon: FolderIcon,
    bg: 'bg-[#F4F4F5]',
    text: 'text-[#71717A]',
    barColor: 'bg-[#A1A1AA]',
    btnLabel: 'Lihat Detail Update',
    btnClass: 'bg-[#F4F4F5] text-[#18181B] hover:bg-[#E4E4E7] border border-[#E4E4E7]'
  }
}

/* â”€â”€ MOCK DATA â”€â”€ */
interface Notif {
  id: number;
  type: 'deadline'|'feedback'|'revision'|'project';
  title: string;
  desc: string;
  time: string;
  dateStr: string; // Used for grouping 
  read: boolean;
  actionUrl: string;
  secondaryLabel?: string;
}

const notifications = ref<Notif[]>([
  {
    id: 1, type: 'revision', read: false, dateStr: 'Hari Ini', time: '10:30 WIB',
    title: 'Kak Yudha Meminta Revisi: Checkout Flow',
    desc: 'Terdapat kendala state management pada cart saat checkout. Tolong perbaiki logic re-rendering-nya sebelum besok agar dapat merge ke main branch.',
    actionUrl: '/student/tasks', secondaryLabel: 'Lihat Pull Request'
  },
  {
    id: 2, type: 'deadline', read: false, dateStr: 'Hari Ini', time: '08:00 WIB',
    title: 'Peringatan: Deadline Tersisa 24 Jam',
    desc: 'Task "Integrasi Payment Gateway Stripe" harus di-submit sebelum 11 April 2026. Prioritaskan task ini hari ini.',
    actionUrl: '/student/tasks/23'
  },
  {
    id: 3, type: 'feedback', read: true, dateStr: 'Kemarin', time: '14:20 WIB',
    title: 'Feedback Baru dari Kak Sari',
    desc: '"Visual hierarchy sudah on-point. Untuk komponen Button, perhatikan accessibility contrast-nya ya..."',
    actionUrl: '/student/feedback'
  },
  {
    id: 4, type: 'project', read: true, dateStr: 'Kemarin', time: '09:00 WIB',
    title: 'Assets Project ThreadMark Diperbarui',
    desc: 'Project Manager (Sandi) menambahkan 12 file design asset baru ke Folder UI/UX. Sinkronisasikan file Figma terbarumu.',
    actionUrl: '/student/class', secondaryLabel: 'Buka Kelas'
  },
  {
    id: 5, type: 'deadline', read: true, dateStr: 'Minggu Ini', time: 'Senin, 10:00 WIB',
    title: 'Deadline Terlewat: Unit Testing',
    desc: 'Kamu belum submit repo unit testing untuk module Auth. Mohon segera diselesaikan agar portfolio tracker mu dapat dinilai.',
    actionUrl: '/student/tasks'
  }
])

const getFilterCount = (key: string) => {
  if (key === 'all') return notifications.value.length
  return notifications.value.filter(n => n.type === key).length
}

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const filteredNotifications = computed(() => {
  if (currentFilter.value === 'all') return notifications.value
  return notifications.value.filter(n => n.type === currentFilter.value)
})

const groupedNotifications = computed(() => {
  const groups: Record<string, Notif[]> = {}
  for (const n of filteredNotifications.value) {
    if (!groups[n.dateStr]) groups[n.dateStr] = []
    groups[n.dateStr].push(n)
  }
  return groups
})

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
