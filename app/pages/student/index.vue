<template>
  <div
    class="flex min-h-screen bg-[#F7F7F9] text-[#111827] antialiased overflow-x-hidden"
    style="font-family: 'Instrument Sans', Raleway, sans-serif"
  >
    <Sidebar :open="sidebarOpen" @update:open="sidebarOpen = $event" />

    <div class="flex-1 w-full min-w-0 min-[900px]:ml-[210px] relative z-[1]">
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
            <h1 class="text-[0.95rem] sm:text-[1.1rem] font-semibold leading-snug tracking-[-0.02em] text-[#171717] lg:text-[1.15rem]">
              Halo, <span class="text-[#443E8D]">{{ studentName }}</span><span class="hidden sm:inline">. Siap lanjut belajar hari ini?</span>
              <span class="sm:hidden">! 👋</span>
            </h1>
            <p class="mt-0.5 sm:mt-1 text-[0.7rem] sm:text-[0.82rem] leading-relaxed text-[#71717A]">
              Phase {{ currentPhase }} of 3 · Bulan {{ currentMonth }}/4
            </p>
          </div>

          <NuxtLink
            to="/student/notifications"
            class="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E4E4E7] bg-white text-[#52525B] transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#CFCFE0] hover:text-[#443E8D]"
            aria-label="Notifikasi"
          >
            <BellIcon class="h-5 w-5" />
            <span
              v-if="unreadNotifCount > 0"
              class="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-[#443E8D] px-1 text-[0.62rem] font-bold text-white"
            >
              {{ unreadNotifCount }}
            </span>
          </NuxtLink>
        </div>
      </header>

      <main class="mx-auto flex w-full max-w-[1440px] flex-col gap-6 p-8 max-[900px]:p-5">
        <section>
          <article class="rounded-2xl border border-[#E4E4E7] bg-white p-4 sm:p-6 lg:p-7 shadow-sm">
            <div class="flex h-full flex-col justify-between gap-6">
              <div>
                <div class="flex items-center gap-2 text-[#71717A]">
                  <PlayCircleIcon class="h-4 sm:h-5 w-4 sm:w-5 text-[#443E8D]" />
                  <span class="text-[0.65rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.18em]">Continue learning</span>
                </div>

                <h3 class="mt-2 sm:mt-3 text-[1.15rem] sm:text-[1.35rem] font-semibold tracking-[-0.03em] text-[#18181B] lg:text-[1.2rem]">
                  {{ continueLearning.moduleName }}
                </h3>
              </div>

              <div class="space-y-3 sm:space-y-4">
                <div>
                  <div class="mb-2 flex items-center justify-between text-[0.7rem] sm:text-[0.75rem] font-semibold text-[#71717A]">
                    <span>Assignment progress</span>
                    <span class="text-[#443E8D]">{{ continueLearning.assignmentProgress }}%</span>
                  </div>
                  <div class="h-2 rounded-full bg-[#F1F1F4]">
                    <div
                      class="h-full rounded-full bg-[#443E8D] transition-[width] duration-700 ease-out"
                      :style="{ width: `${continueLearning.assignmentProgress}%` }"
                    ></div>
                  </div>
                </div>

                <NuxtLink
                  to="/student/class"
                  class="inline-flex w-full items-center justify-center rounded-2xl bg-[#443E8D] px-4 py-2 sm:py-3 text-[0.8rem] sm:text-[0.85rem] font-semibold text-white transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#3D3780]"
                >
                  Lanjut belajar
                </NuxtLink>
              </div>
            </div>
          </article>
        </section>

        <section class="grid gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="stat in summaryStats"
            :key="stat.label"
            class="rounded-2xl border border-[#E4E4E7] bg-white p-4 transition-transform duration-200 hover:-translate-y-0.5 shadow-sm"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-[0.65rem] sm:text-[0.72rem] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#71717A]">
                  {{ stat.label }}
                </p>
                <p class="mt-1.5 sm:mt-2 text-[1.15rem] sm:text-[1.35rem] font-semibold tracking-[-0.03em] text-[#18181B]">
                  {{ stat.value }}
                </p>
                <p class="mt-0.5 sm:mt-1 text-[0.75rem] sm:text-[0.8rem] text-[#71717A]">{{ stat.hint }}</p>
              </div>
              <div class="flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center rounded-2xl border border-[#ECECF1] bg-[#FAFAFB] text-[#443E8D] shrink-0">
                <component :is="stat.icon" class="h-4 sm:h-5 w-4 sm:w-5" />
              </div>
            </div>
          </article>
        </section>

        <section class="grid gap-5 md:grid-cols-2 lg:gap-4 xl:grid-cols-3">
          <article class="rounded-2xl border border-[#E4E4E7] bg-white p-4 sm:p-5 lg:p-6 shadow-sm">
            <div class="flex items-center gap-2 text-[#443E8D]">
              <MapIcon class="h-5 w-5" />
              <h2 class="text-[0.95rem] font-semibold">Weekly Flow</h2>
            </div>

            <div class="relative mt-5 sm:mt-6 space-y-3 sm:space-y-5 pl-1">
              <div class="absolute left-[11px] top-2 bottom-2 w-px bg-[#E7E7EB]"></div>

              <div v-for="flow in weeklyFlow" :key="flow.id" class="relative flex items-start gap-3 sm:gap-4">
                <div
                  class="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-white"
                  :class="flow.status === 'done'
                    ? 'border-[#443E8D] bg-[#443E8D] text-white'
                    : flow.status === 'doing'
                      ? 'border-[#443E8D] text-[#443E8D]'
                      : 'border-[#D7D7DE] text-[#A1A1AA]'"
                >
                  <CheckIcon v-if="flow.status === 'done'" class="h-3.5 w-3.5" />
                  <span v-else-if="flow.status === 'doing'" class="h-2 w-2 rounded-full bg-[#443E8D]"></span>
                </div>

                <div class="pb-0.5">
                  <p class="text-[0.8rem] sm:text-[0.88rem] font-medium" :class="flow.status === 'todo' ? 'text-[#52525B]' : 'text-[#18181B]'">
                    {{ flow.label }}
                  </p>
                  <p class="mt-0.5 sm:mt-1 text-[0.7rem] sm:text-[0.76rem] text-[#71717A]">
                    {{ flow.note }}
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article class="rounded-2xl border border-[#E4E4E7] bg-white p-4 sm:p-5 lg:p-6 shadow-sm">
            <div class="flex items-center gap-2 text-[#443E8D]">
              <CalendarIcon class="h-5 w-5" />
              <h2 class="text-[0.95rem] font-semibold">Upcoming Session</h2>
            </div>

            <div class="mt-5 rounded-xl border border-[#D9D9E4] bg-[#443E8D] p-5 text-white">
              <div class="flex items-start justify-between gap-3 sm:gap-4">
                <div class="min-w-0 flex-1">
                  <h3 class="text-[0.95rem] sm:text-[1.1rem] font-semibold tracking-[-0.03em]">
                    {{ upcomingSessions[0]?.title || 'Tidak ada sesi' }}
                  </h3>
                </div>
                <VideoCameraIcon class="h-8 sm:h-10 w-8 sm:w-10 shrink-0 text-white/20" />
              </div>

              <div class="mt-3 sm:mt-4 flex items-center gap-2 text-[0.75rem] sm:text-[0.8rem] text-white/75">
                <ClockIcon class="h-3.5 sm:h-4 w-3.5 sm:w-4 shrink-0" />
                <span class="truncate">{{ upcomingSessions[0]?.day }} {{ upcomingSessions[0]?.month }}, {{ upcomingSessions[0]?.time }}</span>
              </div>

              <button class="mt-3 sm:mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-2 sm:py-3 text-[0.75rem] sm:text-[0.82rem] font-semibold text-[#443E8D] transition-transform duration-200 hover:-translate-y-0.5">
                Join session
              </button>
            </div>

            <div class="mt-4 sm:mt-5 space-y-2">
              <p class="text-[0.65rem] sm:text-[0.68rem] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#71717A]">
                Flexible options
              </p>

              <NuxtLink
                to="/student/mentorship"
                class="flex items-center gap-2 sm:gap-3 rounded-2xl border border-[#E4E4EA] bg-white p-2 sm:p-3 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#FAFAFB]"
              >
                <div class="flex h-8 sm:h-10 w-8 sm:w-10 items-center justify-center rounded-xl bg-[#F4F4F6] text-[#443E8D] shrink-0">
                  <UserIcon class="h-4 sm:h-5 w-4 sm:w-5" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-[0.75rem] sm:text-[0.85rem] font-semibold text-[#18181B]">Mentor slot open</p>
                  <p class="mt-0.5 text-[0.65rem] sm:text-[0.76rem] text-[#71717A]">Book 1:1 micro session</p>
                </div>
                <ChevronRightIcon class="h-3.5 sm:h-4 w-3.5 sm:w-4 text-[#A1A1AA] shrink-0" />
              </NuxtLink>
            </div>
          </article>

          <article class="rounded-2xl border border-[#E4E4E7] bg-white p-4 sm:p-5 lg:p-6 shadow-sm">
            <div class="flex items-center justify-between gap-3 mb-5">
              <div class="flex items-center gap-2 text-[#443E8D] min-w-0">
                <ClipboardDocumentCheckIcon class="h-5 w-5 shrink-0" />
                <h2 class="text-[0.95rem] font-semibold truncate">Brief & Challenge</h2>
              </div>
              <NuxtLink to="/student/tasks" class="text-[0.7rem] sm:text-[0.75rem] font-semibold text-[#71717A] transition-colors hover:text-[#443E8D] whitespace-nowrap">
                Lihat semua →
              </NuxtLink>
            </div>

            <div class="space-y-2 sm:space-y-3">
              <div
                v-for="task in urgentTasks"
                :key="task.id"
                class="group rounded-xl border border-[#ECECF1] bg-gradient-to-br from-[#FAFAFB] to-white p-3 sm:p-4 transition-all duration-200 hover:border-[#443E8D]/20 hover:shadow-sm hover:-translate-y-0.5"
              >
                <div class="flex items-start justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div class="min-w-0 flex-1">
                    <h3 class="text-[0.85rem] sm:text-[0.9rem] font-semibold tracking-[-0.01em] text-[#18181B]">
                      {{ task.name }}
                    </h3>
                    <p class="mt-1 text-[0.7rem] sm:text-[0.75rem] text-[#999]">{{ task.project }}</p>
                  </div>
                  
                  <span
                    class="rounded-md px-2 sm:px-2.5 py-1 sm:py-1.5 text-[0.6rem] sm:text-[0.65rem] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.14em] whitespace-nowrap flex-shrink-0"
                    :class="task.status === 'doing'
                      ? 'bg-[#443E8D] text-white shadow-sm'
                      : task.status === 'revision'
                        ? 'bg-orange-100 text-orange-700 font-medium'
                        : 'bg-[#F0F0F0] text-[#666]'"
                  >
                    {{ task.status === 'doing' ? 'In progress' : task.status === 'revision' ? 'Review' : 'Todo' }}
                  </span>
                </div>

                <div class="flex items-center justify-between pt-2 border-t border-[#F0F0F0]">
                  <span class="text-[0.65rem] sm:text-[0.7rem] text-[#BBB]">Deadline</span>
                  <span class="text-[0.7rem] sm:text-[0.75rem] font-semibold" :class="task.status === 'done' ? 'text-[#888]' : 'text-[#DC2626]'">
                    {{ task.remaining }}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </section>

        <section class="grid gap-5 md:grid-cols-2 lg:gap-4 lg:grid-cols-2 xl:grid-cols-[1.15fr_0.85fr]">
          <article class="rounded-2xl border border-[#E4E4E7] bg-white p-4 sm:p-5 lg:p-6 shadow-sm">
            <div class="flex items-center justify-between gap-3">
              <div>
                <h2 class="mt-2 text-[1.15rem] font-semibold tracking-[-0.03em] text-[#18181B] lg:text-[1.05rem]">Progress per skill</h2>
              </div>
              <div class="rounded-2xl border border-[#ECECF1] bg-[#FAFAFB] px-3 py-2 text-right shrink-0">
                <p class="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#71717A]">Lowest skill</p>
                <p class="mt-1 text-[0.88rem] font-semibold text-[#18181B]">{{ lowestSkill.name }}</p>
              </div>
            </div>

            <div class="mt-4 sm:mt-5 space-y-3 sm:space-y-4">
              <div v-for="skill in skills" :key="skill.name">
                <div class="mb-2 flex items-center justify-between gap-2 sm:gap-3">
                  <div>
                    <p class="text-[0.8rem] sm:text-[0.88rem] font-medium text-[#18181B]">{{ skill.name }}</p>
                    <p class="mt-0.5 text-[0.7rem] sm:text-[0.76rem] text-[#71717A]">
                      +{{ skill.growth }} poin dari review sebelumnya
                    </p>
                  </div>
                  <span class="text-[0.75rem] sm:text-[0.82rem] font-semibold text-[#443E8D] shrink-0">{{ skill.score }}%</span>
                </div>

                <div class="h-2 rounded-full bg-[#F1F1F4]">
                  <div
                    class="h-full rounded-full transition-[width] duration-700 ease-out"
                    :class="getSkillBarColor(skill.score)"
                    :style="{ width: `${skill.score}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </article>

          <article class="rounded-2xl border border-[#E4E4E7] bg-white p-4 sm:p-5 lg:p-6 shadow-sm">
            <div class="flex items-center justify-between gap-3">
              <div>
                <h2 class="mt-2 text-[1.15rem] font-semibold tracking-[-0.03em] text-[#18181B] lg:text-[1.05rem]">Recent updates</h2>
              </div>
              <NuxtLink to="/student/notifications" class="text-[0.7rem] sm:text-[0.75rem] font-semibold text-[#71717A] transition-colors hover:text-[#443E8D] whitespace-nowrap">
                Semua →
              </NuxtLink>
            </div>

            <div class="mt-5 space-y-2 sm:space-y-3">
              <div
                v-for="n in recentNotifications"
                :key="n.id"
                class="relative flex items-start gap-2 sm:gap-3 rounded-2xl border p-2 sm:p-3 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#FAFAFB]"
                :class="n.read ? 'border-[#E4E4EA] bg-white' : 'border-[#D9D9E4] bg-[#FAFAFB]'"
              >
                <div class="flex h-8 sm:h-9 w-8 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4F4F6]">
                  <component :is="notifTypeStyle[n.type].icon" class="h-3.5 sm:h-4 w-3.5 sm:w-4 text-[#52525B]" />
                </div>

                <div class="min-w-0 flex-1">
                  <p class="truncate text-[0.75rem] sm:text-[0.82rem] font-semibold text-[#18181B]">{{ n.title }}</p>
                  <p class="mt-0.5 sm:mt-1 line-clamp-2 text-[0.7rem] sm:text-[0.75rem] leading-4 sm:leading-5 text-[#71717A]">{{ n.desc }}</p>
                  <p class="mt-0.5 sm:mt-1 text-[0.65rem] sm:text-[0.7rem] font-medium text-[#A1A1AA]">{{ n.time }}</p>
                </div>

                <span v-if="!n.read" class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#443E8D]"></span>
              </div>
            </div>

            <div class="mt-4 sm:mt-5 flex items-center justify-between border-t border-[#F1F1F4] pt-3 sm:pt-4">
              <span class="text-[0.7rem] sm:text-[0.75rem] text-[#71717A]">{{ unreadNotifCount }} unread</span>
              <NuxtLink to="/student/notifications" class="text-[0.7rem] sm:text-[0.75rem] font-semibold text-[#443E8D] hover:underline">
                Mark all as read
              </NuxtLink>
            </div>
          </article>
        </section>
      </main>
    </div>

    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-[150] bg-[rgba(15,23,42,0.14)] backdrop-blur-[2px] min-[900px]:hidden"
      @click="sidebarOpen = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Sidebar from '~/components/student/StudentSidebar.vue'
import {
  AcademicCapIcon,
  ArrowPathIcon,
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  CheckCircleIcon,
  CheckIcon,
  ChatBubbleLeftRightIcon,
  ChevronRightIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  FireIcon,
  FolderIcon,
  MapIcon,
  PlayCircleIcon,
  TrophyIcon,
  UserIcon,
  VideoCameraIcon,
} from '@heroicons/vue/24/outline'

useSeoMeta({
  title: 'Dashboard – Pixelnoid Academy',
  description: 'Pantau jadwal sesi, proyek, skill report, dan progress belajar di Pixelnoid Academy.',
})

definePageMeta({ layout: 'dashboard' })

const sidebarOpen = ref(false)

const studentName = ref('Arka')
const todayStr = new Date().toLocaleDateString('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const currentMonth = ref(2)
const currentPhase = ref(2)

const overallScore = ref(64)
const weeklyStreak = ref(7)
const currentLevel = ref('Level 2 - Machine Learning Starter')
const currentXP = ref(1240)
const nextLevelXP = ref(1800)
const xpPercent = computed(() => Math.round((currentXP.value / nextLevelXP.value) * 100))

const continueLearning = ref({
  moduleName: 'Responsive Layout & Flexbox',
  assignmentName: 'Build a responsive navbar',
  assignmentProgress: 70,
})

const weeklyFlow = ref([
  { id: 1, label: 'Main session completed', note: 'Rabu, 14 Mei', status: 'done' },
  { id: 2, label: 'Practice in progress', note: 'Fokus ke layout dan spacing', status: 'doing' },
  { id: 3, label: 'Micro session Friday 19:00', note: 'Debug & review', status: 'todo' },
  { id: 4, label: 'Weekly review', note: 'Ringkas progress minggu ini', status: 'todo' },
])

const tasks = ref([
  { id: 1, name: 'Prototype UI — Checkout Flow', project: 'ThreadMark', status: 'doing', deadline: '2026-05-28' },
  { id: 2, name: 'API Integration — Product List', project: 'ThreadMark', status: 'doing', deadline: '2026-05-30' },
  { id: 3, name: 'Refactor State Management', project: 'ThreadMark', status: 'revision', deadline: '2026-06-02' },
  { id: 4, name: 'Unit Test — Auth Module', project: 'ThreadMark', status: 'todo', deadline: '2026-06-05' },
  { id: 5, name: 'Design System & Component Library', project: 'ThreadMark', status: 'done', deadline: '2026-05-20' },
  { id: 6, name: 'Auth Flow — Login & Register', project: 'ThreadMark', status: 'done', deadline: '2026-05-18' },
  { id: 7, name: 'Dashboard Admin — Analytics', project: 'CMS', status: 'doing', deadline: '2026-06-07' },
  { id: 8, name: 'Deploy ke Vercel — Portfolio', project: 'Portfolio', status: 'done', deadline: '2026-05-16' },
])

const doneTasksCount = computed(() => tasks.value.filter((t) => t.status === 'done').length)
const activeTasksCount = computed(() => tasks.value.filter((t) => t.status !== 'done').length)
const overallTaskProgress = computed(() => Math.round((doneTasksCount.value / (tasks.value.length || 1)) * 100))

const workloadStats = computed(() => [
  { label: 'Done', value: doneTasksCount.value },
  { label: 'Active', value: tasks.value.filter((t) => t.status === 'doing').length },
  { label: 'Review', value: tasks.value.filter((t) => t.status === 'revision').length },
  { label: 'Todo', value: tasks.value.filter((t) => t.status === 'todo').length },
])

const urgentTasks = computed(() => {
  const today = new Date()
  return tasks.value
    .filter((t) => t.status !== 'done')
    .map((t) => {
      const diff = Math.ceil((new Date(t.deadline).getTime() - today.getTime()) / 86400000)
      const remaining = diff < 0 ? 'Terlambat' : diff === 0 ? 'Hari ini' : `${diff} hari lagi`
      return { ...t, remaining }
    })
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3)
})

const upcomingSessions = ref([
  { id: 1, day: '29', month: 'Mei', title: 'Logic & Function Dasar', time: '16:00–17:30 WIB' },
  { id: 2, day: '31', month: 'Mei', title: 'Micro Session — Debug & Review', time: '19:30–20:15 WIB' },
])

const skills = ref([
  { name: 'UI/UX Design', score: 65, growth: 5 },
  { name: 'Frontend Engineering (Vue/Nuxt)', score: 82, growth: 12 },
  { name: 'Backend Integration', score: 45, growth: 10 },
  { name: 'Problem Solving', score: 70, growth: -2 },
  { name: 'Team Collaboration', score: 88, growth: 8 },
])

const lowestSkill = computed(() => [...skills.value].sort((a, b) => a.score - b.score)[0])

const learningPace = ref('Consistent Learner')
const learningPaceDescription = ref(
  'Kamu belajar secara teratur dan terjadwal. Pola seperti ini biasanya lebih stabil untuk jangka panjang.'
)

const notifications = ref([
  {
    id: 1,
    type: 'revision',
    read: false,
    title: 'Kak Yudha meminta revisi',
    desc: 'Terdapat kendala state management pada cart saat checkout.',
    time: '10:30 WIB',
  },
  {
    id: 2,
    type: 'deadline',
    read: false,
    title: 'Deadline tersisa 24 jam',
    desc: 'Task integrasi payment gateway perlu disubmit sebelum besok.',
    time: '08:00 WIB',
  },
  {
    id: 3,
    type: 'feedback',
    read: true,
    title: 'Feedback baru dari mentor',
    desc: 'Visual hierarchy sudah membaik. Detail spacing masih bisa dirapikan.',
    time: '14:20 WIB',
  },
  {
    id: 4,
    type: 'project',
    read: true,
    title: 'Assets ThreadMark diperbarui',
    desc: 'Project manager menambahkan file design asset baru ke folder UI/UX.',
    time: 'Kemarin',
  },
])

const notifTypeStyle: Record<string, { icon: any }> = {
  deadline: { icon: ClockIcon },
  feedback: { icon: ChatBubbleLeftRightIcon },
  revision: { icon: ArrowPathIcon },
  project: { icon: FolderIcon },
}

const unreadNotifCount = computed(() => notifications.value.filter((n) => !n.read).length)
const recentNotifications = computed(() => notifications.value.slice(0, 4))

const summaryStats = computed(() => [
  {
    label: 'Roadmap',
    value: `Bulan ${currentMonth.value}/4`,
    hint: `Phase ${currentPhase.value} of 3`,
    icon: CalendarIcon,
  },
  {
    label: 'Session',
    value: '18 / 24',
    hint: 'Kehadiran kelas',
    icon: CheckCircleIcon,
  },
  {
    label: 'Progress',
    value: `${overallScore.value}%`,
    hint: 'Overall mastery',
    icon: ClipboardDocumentCheckIcon,
  },
  {
    label: 'XP toward next',
    value: `${xpPercent.value}%`,
    hint: `${currentXP.value} / ${nextLevelXP.value} XP`,
    icon: AcademicCapIcon,
  },
])

const getSkillBarColor = (score: number) => {
  if (score >= 80) return 'bg-[#443E8D]'
  if (score >= 60) return 'bg-[#554DB3]'
  return 'bg-[#71717A]'
}

</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
