<template>
  <div
    class="flex min-h-screen bg-[#F7F7F9] antialiased relative overflow-x-hidden"
    style="font-family: 'Instrument Sans', Raleway, sans-serif"
  >
    <!-- Sidebar -->
    <StudentSidebar :open="sidebarOpen" @update:open="sidebarOpen = $event" />

    <!-- Main wrap -->
    <div class="flex-1 lg:ml-[260px] flex flex-col relative z-[1]">

      <!-- ── TOPBAR ── -->
      <header class="sticky top-0 z-[100] flex items-center gap-4 px-10 py-5 max-[900px]:px-6 max-[900px]:py-4 bg-white/[0.92] backdrop-blur-[14px] [-webkit-backdrop-filter:blur(14px)] border-b border-[#EBEBEE]">
        <button
          class="hidden max-[900px]:flex w-9 h-9 border border-[#E4E4E7] bg-white cursor-pointer rounded-[10px] items-center justify-center text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] transition-colors"
          @click="sidebarOpen = !sidebarOpen"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon class="w-5 h-5" />
        </button>

        <div class="flex-1 min-w-0">
          <h1 class="text-[1.15rem] font-bold text-[#18181B] m-0 tracking-[-0.02em]">
            Kelola Workload & Brief
          </h1>
          <p class="text-[0.8rem] text-[#A1A1AA] mt-1 mb-0 font-medium tracking-[0.01em] hidden sm:block">
            Lihat dan atur semua tugas yang perlu diselesaikan.
          </p>
        </div>

        <div class="flex items-center gap-3">
          <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-[10px] bg-[#FAFAFC] border border-[#E4E4E7] text-[#18181B]">
            <div class="w-2 h-2 rounded-full bg-[#3F3F46]"></div>
            <span class="text-[0.75rem] font-bold">{{ doneCount }}/{{ totalTasks }} Brief Selesai</span>
          </div>

          <button
            class="px-4 py-2 rounded-[10px] bg-[#18181B] text-white text-[0.8rem] font-semibold hover:bg-[#3F3F46] transition-colors flex items-center gap-2 shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
            @click="showAddModal = true"
          >
            <PlusIcon class="w-4 h-4" />
            <span class="hidden sm:inline">Tambah Brief</span>
          </button>
        </div>
      </header>

      <!-- ── MAIN CONTENT ── -->
      <main class="py-8 px-10 max-[900px]:p-6 flex flex-col gap-7 max-w-[1280px] mx-auto w-full">

        <!-- Top Overview Section -->
        <section class="grid grid-cols-1 xl:grid-cols-3 gap-7">
          
          <!-- Progress Hero Card -->
          <div class="xl:col-span-2 bg-white rounded-2xl border border-[rgba(228,228,231,0.6)] p-6 flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)] relative overflow-hidden">
            <!-- Subtle decorative shapes matching minimalist style -->
            <div class="absolute -top-24 -right-24 w-64 h-64 bg-[#F4F4F5] rounded-full blur-[40px] pointer-events-none"></div>

            <div class="relative z-10 flex-1">
              <h2 class="text-[1.15rem] font-bold text-[#18181B] tracking-[-0.01em] mb-2">
                Progress Keseluruhan
              </h2>
              <p class="text-[0.8rem] text-[#71717A] max-w-lg leading-relaxed mb-0 font-medium">
                Selesaikan semua brief secara terstruktur dan kumpulkan hasil karya untuk direview oleh Senior Mentor. Terus semangat!
              </p>
            </div>

            <div class="relative z-10 w-full md:w-80 bg-[#FAFAFC] border border-[#E4E4E7] rounded-xl p-5">
              <div class="flex justify-between items-end mb-3">
                <span class="text-[0.75rem] font-bold text-[#71717A]">Total Selesai</span>
                <span class="text-[1.5rem] font-bold text-[#18181B] tracking-[-0.02em] leading-none">{{ overallProgress }}%</span>
              </div>
              <div class="h-[6px] bg-[#E4E4E7] rounded-[6px] overflow-hidden mb-5">
                <div
                  class="h-full bg-[#3F3F46] rounded-[6px] transition-all duration-1000"
                  :style="{ width: overallProgress + '%' }"
                ></div>
              </div>
              <div class="flex justify-between gap-4">
                <div v-for="s in quickStats" :key="s.label" class="flex items-center gap-2">
                  <div class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: s.dotColor }"></div>
                  <div class="flex flex-col gap-[0.1rem]">
                    <span class="text-[0.6rem] text-[#A1A1AA] uppercase font-bold tracking-[0.02em] leading-none">{{ s.label }}</span>
                    <span class="text-[0.8rem] font-bold text-[#18181B] leading-none">{{ s.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Priority Distribution -->
          <div class="bg-white rounded-2xl border border-[rgba(228,228,231,0.6)] p-6 flex flex-col transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
            <div class="flex items-center gap-2 mb-6">
              <h3 class="text-[0.95rem] font-bold text-[#18181B] tracking-[-0.01em] m-0">Distribusi Prioritas</h3>
            </div>
            <div class="space-y-4 flex-1 flex flex-col justify-center">
              <div v-for="p in priorityDistribution" :key="p.level" class="flex items-center gap-3">
                <span class="w-16 text-[0.7rem] font-bold text-[#71717A] uppercase tracking-[0.02em]">{{ p.label }}</span>
                <div class="flex-1 h-[5px] bg-[#F4F4F5] rounded-[3px] overflow-hidden">
                  <div class="h-full rounded-[3px] transition-all duration-1000" :style="{ width: (p.count / (totalTasks || 1) * 100) + '%', backgroundColor: p.color }"></div>
                </div>
                <span class="w-6 text-[0.8rem] font-bold text-[#18181B] text-right">{{ p.count }}</span>
              </div>
            </div>
          </div>

        </section>

        <!-- Task List Section -->
        <section class="w-full" aria-label="Daftar tugas">

          <!-- Task list card -->
          <div class="bg-white rounded-2xl border border-[rgba(228,228,231,0.6)] shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-hidden">

            <!-- Filter & search bar -->
            <div class="p-5 border-b border-[#F4F4F5] space-y-4">
              <div class="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                <button
                  v-for="f in filterOptions"
                  :key="f.id"
                  class="whitespace-nowrap px-[0.85rem] py-[0.45rem] rounded-[8px] text-[0.75rem] font-semibold transition-colors border"
                  :class="activeFilter === f.id
                    ? 'bg-[#18181B] border-[#18181B] text-white'
                    : 'bg-white border-[#E4E4E7] text-[#71717A] hover:bg-[#FAFAFC] hover:text-[#18181B]'"
                  @click="activeFilter = f.id"
                >
                  {{ f.label }}
                  <span
                    class="ml-1 text-[0.65rem] px-[0.35rem] py-[0.1rem] rounded-[5px]"
                    :class="activeFilter === f.id ? 'bg-[#3F3F46] text-white' : 'bg-[#F4F4F5] text-[#A1A1AA]'"
                  >{{ f.count }}</span>
                </button>
              </div>

              <div class="flex flex-col sm:flex-row gap-3">
                <div class="relative flex-1">
                  <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Cari brief..."
                    class="w-full pl-9 pr-3 py-2 border border-[#E4E4E7] rounded-[8px] text-[0.8rem] bg-[#FAFAFC] focus:bg-white focus:ring-1 focus:ring-[#18181B] focus:border-[#18181B] outline-none transition-colors"
                  >
                </div>
                <select
                  v-model="sortBy"
                  class="px-3 py-2 border border-[#E4E4E7] rounded-[8px] text-[0.8rem] font-medium bg-[#FAFAFC] text-[#18181B] outline-none cursor-pointer focus:bg-white focus:ring-1 focus:ring-[#18181B] focus:border-[#18181B] transition-colors appearance-none pr-8 relative"
                  style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%2371717A%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22M4.94%205.53L8%208.58l3.06-3.05L12%206.47l-4%204-4-4%20.94-.94z%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 8px center; background-size: 16px;"
                >
                  <option value="priority">Prioritas</option>
                  <option value="deadline">Deadline</option>
                  <option value="project">Project</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>

            <!-- Task list -->
            <div class="divide-y divide-[#F4F4F5]">
              <TransitionGroup name="task-fade">
                <div
                  v-for="task in filteredTasks"
                  :key="task.id"
                  class="transition-all"
                  :class="{ 'opacity-60': task.status === 'done' }"
                >
                  <!-- Task row -->
                  <div
                    class="flex items-center gap-3 px-6 py-[1.1rem] cursor-pointer hover:bg-[#FAFAFC] transition-colors"
                    :class="{ 'bg-[#F4F4F5]/50': expandedTask === task.id }"
                    @click="toggleExpand(task.id)"
                  >
                    <!-- Status toggle btn -->
                    <button
                      class="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 transition-colors border"
                      :style="getStatusBtnStyle(task.status)"
                      @click.stop="cycleStatus(task.id)"
                      :title="statusMeta[task.status].label"
                    >
                      <span v-html="statusMeta[task.status].icon" class="w-4 h-4 flex items-center justify-center [&>svg]:w-4 [&>svg]:h-4"></span>
                    </button>

                    <!-- Task info -->
                    <div class="flex-1 min-w-0 ml-1 flex flex-col gap-[0.15rem]">
                      <div class="flex items-center gap-2">
                        <span class="inline-block text-[0.6rem] font-bold py-[0.1rem] px-[0.4rem] rounded-[5px] uppercase tracking-[0.02em] bg-[#F4F4F5] text-[#52525B]">{{ task.category }}</span>
                        <span class="text-[0.65rem] font-medium" :style="{ color: priorityMeta[task.priority].textColor }">{{ priorityMeta[task.priority].label }}</span>
                      </div>
                      <h3
                        class="text-[0.85rem] font-semibold text-[#18181B] truncate m-0"
                        :class="{ 'line-through text-[#A1A1AA]': task.status === 'done' }"
                      >{{ task.name }}</h3>
                    </div>

                    <!-- Right side -->
                    <div class="flex items-center gap-4 flex-shrink-0">
                      <div class="hidden md:flex flex-col items-end gap-[0.15rem]">
                        <span class="text-[0.65rem] font-semibold text-[#A1A1AA] uppercase">{{ task.project }}</span>
                        <span class="text-[0.7rem] font-medium" :class="getDeadlineColorClass(task.deadline)">{{ formatDate(task.deadline) }}</span>
                      </div>
                      <ChevronRightIcon
                        class="w-4 h-4 text-[#A1A1AA] transition-transform duration-200"
                        :class="{ 'rotate-90 text-[#18181B]': expandedTask === task.id }"
                      />
                    </div>
                  </div>

                  <!-- Expanded detail -->
                  <Transition name="expand">
                    <div v-if="expandedTask === task.id" class="px-6 pb-6 bg-[#FAFAFC] border-t border-[#F4F4F5] pt-5">

                      <!-- Progress bar inside detail -->
                      <div class="mb-5 bg-white p-4 rounded-[10px] border border-[#E4E4E7]">
                        <div class="flex justify-between items-center mb-2">
                          <span class="text-[0.75rem] font-bold text-[#18181B]">Progress Detail</span>
                          <span class="text-[0.8rem] font-bold text-[#18181B]">{{ task.progress }}%</span>
                        </div>
                        <div class="h-[6px] bg-[#E4E4E7] rounded-[6px] overflow-hidden">
                          <div
                            class="h-full rounded-[6px] transition-all duration-500"
                            :style="{ width: task.progress + '%', backgroundColor: statusMeta[task.status].color }"
                          ></div>
                        </div>
                      </div>

                      <p class="text-[0.8rem] text-[#3F3F46] leading-[1.5] mb-5 font-medium">{{ task.description }}</p>

                      <!-- Detail chips -->
                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                        <div v-for="item in [
                          { label: 'Estimasi', value: task.estimate, color: 'text-[#18181B]' },
                          { label: 'Prioritas', value: priorityMeta[task.priority].label, color: priorityMeta[task.priority].textColorClass },
                          { label: 'Deadline', value: formatDate(task.deadline), color: 'text-[#18181B]' },
                          { label: 'Sprint', value: 'Sprint ' + task.sprint, color: 'text-[#18181B]' }
                        ]" :key="item.label" class="bg-white rounded-[10px] p-[0.65rem] border border-[#E4E4E7]">
                          <p class="text-[0.6rem] font-bold text-[#A1A1AA] uppercase mb-[0.1rem] tracking-[0.02em]">{{ item.label }}</p>
                          <p class="text-[0.75rem] font-semibold m-0" :class="item.color">{{ item.value }}</p>
                        </div>
                      </div>

                      <!-- Actions -->
                      <div class="flex gap-2 justify-end pt-5 border-t border-[#F4F4F5]">
                        <button
                          class="text-[0.75rem] font-semibold px-4 py-2 rounded-[8px] bg-white border border-[#E4E4E7] text-[#18181B] hover:bg-[#FAFAFC] transition-colors"
                          @click.stop="cycleStatus(task.id)"
                        >Pindah ke {{ statusMeta[nextStatus(task.status)].label }}</button>
                        <button
                          class="text-[0.75rem] font-semibold px-4 py-2 rounded-[8px] bg-[#FFF1F2] text-[#E11D48] hover:bg-[#FFE4E6] transition-colors"
                          @click.stop="deleteTask(task.id)"
                        >Hapus</button>
                      </div>
                    </div>
                  </Transition>
                </div>
              </TransitionGroup>

              <!-- Empty state -->
              <div v-if="filteredTasks.length === 0" class="flex flex-col items-center justify-center py-16 gap-3">
                <div class="w-12 h-12 rounded-full bg-[#F4F4F5] flex items-center justify-center">
                  <ClipboardIcon class="w-6 h-6 text-[#A1A1AA]" />
                </div>
                <div class="text-center">
                  <p class="text-[0.95rem] font-bold text-[#18181B] m-0">Tidak ada brief ditemukan</p>
                  <p class="text-[0.75rem] text-[#71717A] mt-1 font-medium">Coba sesuaikan filter atau tambahkan brief baru.</p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>

    <!-- Sidebar overlay (mobile only) -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-[rgba(15,23,42,0.15)] z-[150] hidden max-[900px]:block backdrop-blur-[2px]"
      @click="sidebarOpen = false"
    ></div>

    <!-- Add Task Modal -->
    <Transition name="modal-fade">
      <div
        v-if="showAddModal"
        class="fixed inset-0 z-[200] bg-[rgba(15,23,42,0.4)] backdrop-blur-[2px] flex items-center justify-center p-4"
        @click.self="showAddModal = false"
      >
        <div class="bg-white w-full sm:max-w-lg rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden">
          <!-- Modal header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-[#F4F4F5]">
            <h2 class="text-[1.1rem] font-bold text-[#18181B] m-0 tracking-[-0.01em]">Buat Brief Baru</h2>
            <button
              class="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#A1A1AA] hover:bg-[#F4F4F5] hover:text-[#18181B] transition-colors"
              @click="showAddModal = false"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>

          <!-- Modal body -->
          <div class="p-6 space-y-5 max-h-[70vh] overflow-y-auto scrollbar-none">
            <div>
              <label class="block text-[0.75rem] font-bold text-[#18181B] mb-2">Judul Brief *</label>
              <input
                v-model="newTask.name"
                type="text"
                placeholder="Contoh: Implementasi UI Landing Page"
                class="w-full px-4 py-[0.6rem] border border-[#E4E4E7] rounded-[8px] text-[0.8rem] focus:ring-1 focus:ring-[#18181B] focus:border-[#18181B] outline-none transition-colors"
              >
            </div>

            <div>
              <label class="block text-[0.75rem] font-bold text-[#18181B] mb-2">Deskripsi</label>
              <textarea
                v-model="newTask.description"
                rows="3"
                placeholder="Konteks bisnis, limitasi waktu, dll."
                class="w-full px-4 py-[0.6rem] border border-[#E4E4E7] rounded-[8px] text-[0.8rem] focus:ring-1 focus:ring-[#18181B] focus:border-[#18181B] outline-none resize-none transition-colors"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[0.75rem] font-bold text-[#18181B] mb-2">Project</label>
                <select v-model="newTask.project" class="w-full px-4 py-[0.6rem] border border-[#E4E4E7] rounded-[8px] text-[0.8rem] outline-none focus:ring-1 focus:ring-[#18181B] bg-white transition-colors appearance-none relative"
                style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%2371717A%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22M4.94%205.53L8%208.58l3.06-3.05L12%206.47l-4%204-4-4%20.94-.94z%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 12px center; background-size: 16px;">
                  <option v-for="p in projectOptions" :key="p" :value="p">{{ p }}</option>
                </select>
              </div>
              <div>
                <label class="block text-[0.75rem] font-bold text-[#18181B] mb-2">Kategori</label>
                <input v-model="newTask.category" type="text" placeholder="e.g. Frontend" class="w-full px-4 py-[0.6rem] border border-[#E4E4E7] rounded-[8px] text-[0.8rem] focus:ring-1 focus:ring-[#18181B] outline-none transition-colors">
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-[0.75rem] font-bold text-[#18181B] mb-2">Prioritas</label>
                <select v-model="newTask.priority" class="w-full px-4 py-[0.6rem] border border-[#E4E4E7] rounded-[8px] text-[0.8rem] outline-none focus:ring-1 focus:ring-[#18181B] bg-white transition-colors appearance-none relative"
                style="background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22%2371717A%22%20viewBox%3D%220%200%2016%2016%22%3E%3Cpath%20d%3D%22M4.94%205.53L8%208.58l3.06-3.05L12%206.47l-4%204-4-4%20.94-.94z%22%2F%3E%3C%2Fsvg%3E'); background-repeat: no-repeat; background-position: right 12px center; background-size: 16px;">
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label class="block text-[0.75rem] font-bold text-[#18181B] mb-2">Deadline</label>
                <input v-model="newTask.deadline" type="date" class="w-full px-4 py-[0.6rem] border border-[#E4E4E7] rounded-[8px] text-[0.8rem] focus:ring-1 focus:ring-[#18181B] outline-none bg-white transition-colors">
              </div>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="px-6 py-4 border-t border-[#F4F4F5] bg-[#FAFAFC] flex justify-end gap-3">
            <button
              class="px-5 py-2 rounded-[8px] bg-white border border-[#E4E4E7] text-[#18181B] text-[0.8rem] font-bold hover:bg-[#F4F4F5] transition-colors"
              @click="showAddModal = false"
            >Batal</button>
            <button
              class="px-5 py-2 rounded-[8px] bg-[#18181B] text-white text-[0.8rem] font-bold hover:bg-[#3F3F46] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              @click="addTask"
              :disabled="!newTask.name"
            >Simpan Brief</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import StudentSidebar from '~/components/student/StudentSidebar.vue'
import {
  Bars3Icon,
  PlusIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ClipboardIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

useSeoMeta({
  title: 'Workload & Productivity — Pixelnoid Academy',
  description: 'Kelola workload, prioritas, dan progress brief kamu di Pixelnoid Academy.'
})

definePageMeta({ layout: 'dashboard' })

const sidebarOpen = ref(false)
const showAddModal = ref(false)
const searchQuery = ref('')
const activeFilter = ref('all')
const sortBy = ref('priority')
const expandedTask = ref<number | null>(null)

const statusMeta: Record<string, { label: string; icon: string; color: string; bgClass: string; borderClass: string; textClass: string }> = {
  todo:     {
    label: 'Belum',
    icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="8" r="5.5"/></svg>',
    color: '#A1A1AA', bgClass: '#FAFAFC', borderClass: '#E4E4E7', textClass: '#A1A1AA'
  },
  doing:    {
    label: 'Proses',
    icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1"/></svg>',
    color: '#71717A', bgClass: '#F4F4F5', borderClass: '#D4D4D8', textClass: '#52525B'
  },
  revision: {
    label: 'Revisi',
    icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 2H9a1 1 0 00-1 1v1h4V3a1 1 0 00-1-1z"/><rect x="2" y="4" width="12" height="10" rx="1"/><line x1="5" y1="8" x2="11" y2="8"/><line x1="5" y1="11" x2="8" y2="11"/></svg>',
    color: '#F59E0B', bgClass: '#FFFBEB', borderClass: '#FDE68A', textClass: '#D97706'
  },
  done:     {
    label: 'Selesai',
    icon: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3,8 6,11 13,4"/></svg>',
    color: '#18181B', bgClass: '#F4F4F5', borderClass: '#18181B', textClass: '#18181B'
  },
}

const priorityMeta: Record<string, { label: string; color: string; textColor: string; textColorClass: string }> = {
  critical: { label: 'Critical', color: '#18181B', textColor: '#18181B', textColorClass: 'text-[#18181B]' },
  high:     { label: 'High',     color: '#52525B', textColor: '#52525B', textColorClass: 'text-[#52525B]' },
  medium:   { label: 'Medium',   color: '#A1A1AA', textColor: '#71717A', textColorClass: 'text-[#71717A]' },
  low:      { label: 'Low',      color: '#E4E4E7', textColor: '#A1A1AA', textColorClass: 'text-[#A1A1AA]' },
}

const statusOrder = ['todo', 'doing', 'revision', 'done']
const nextStatus = (current: string) => statusOrder[(statusOrder.indexOf(current) + 1) % statusOrder.length]

const tasks = reactive([
  { id: 1,  name: 'Prototype UI — Checkout Flow',        project: 'ThreadMark', category: 'UI/UX',    status: 'doing',    priority: 'critical', deadline: '2026-04-11', progress: 65, estimate: '1 hari',  sprint: 4, assignee: 'Arka Jenar', description: 'Buat prototype high-fidelity untuk halaman checkout dari cart hingga konfirmasi pembayaran.', tags: ['Figma', 'Checkout', 'Mobile-first'] },
  { id: 2,  name: 'API Integration — Product List',      project: 'ThreadMark', category: 'Frontend', status: 'doing',    priority: 'high',     deadline: '2026-04-14', progress: 40, estimate: '3 hari',  sprint: 4, assignee: 'Arka Jenar', description: 'Integrasi endpoint product list dari Supabase, dengan filter, sort, dan pagination.', tags: ['Vue 3', 'Supabase', 'Pagination'] },
  { id: 3,  name: 'Sprint 4 Review Presentation',        project: 'ThreadMark', category: 'Lainnya', status: 'todo',     priority: 'high',     deadline: '2026-04-14', progress: 0,  estimate: '4 jam',   sprint: 4, assignee: 'Arka Jenar', description: 'Siapkan slide dan demo untuk sprint review bersama mentor dan stakeholder.', tags: ['Presentasi', 'Sprint Review'] },
  { id: 4,  name: 'Unit Test — Auth Module',             project: 'ThreadMark', category: 'Testing', status: 'todo',     priority: 'medium',   deadline: '2026-04-18', progress: 0,  estimate: '2 hari',  sprint: 4, assignee: 'Arka Jenar', description: 'Tulis unit test untuk seluruh fungsi di auth module menggunakan Vitest.', tags: ['Vitest', 'TDD', 'Auth'] },
  { id: 5,  name: 'Design System & Component Library',   project: 'ThreadMark', category: 'UI/UX',   status: 'done',     priority: 'high',     deadline: '2026-04-07', progress: 100, estimate: '3 hari', sprint: 3, assignee: 'Arka Jenar', description: 'Buat design system lengkap termasuk color palette, typography, dan komponen dasar.', tags: ['Design System', 'Figma', 'Components'] },
  { id: 6,  name: 'Auth Flow — Login & Register',        project: 'ThreadMark', category: 'Frontend', status: 'done',    priority: 'high',     deadline: '2026-04-05', progress: 100, estimate: '2 hari', sprint: 3, assignee: 'Arka Jenar', description: 'Implementasi login, register, forgot password dengan validasi form dan loading state.', tags: ['Auth', 'Supabase', 'Vue 3'] },
  { id: 7,  name: 'Refactor State Management',           project: 'ThreadMark', category: 'Frontend', status: 'revision', priority: 'medium',  deadline: '2026-04-16', progress: 70,  estimate: '1 hari', sprint: 4, assignee: 'Arka Jenar', description: 'Refactor prop drilling ke Pinia store sesuai feedback mentor Panji.', tags: ['Pinia', 'Refactor', 'Vue 3'] },
  { id: 8,  name: 'Tambah Aria Labels & Accessibility',  project: 'ThreadMark', category: 'Frontend', status: 'revision', priority: 'medium',  deadline: '2026-04-15', progress: 50,  estimate: '6 jam',  sprint: 4, assignee: 'Arka Jenar', description: 'Perbaiki seluruh elemen interaktif agar memenuhi WCAG 2.1 Level AA.', tags: ['Accessibility', 'WCAG', 'a11y'] },
  { id: 9,  name: 'Dashboard Admin — Analytics',         project: 'CMS',        category: 'Frontend', status: 'doing',    priority: 'high',     deadline: '2026-04-20', progress: 30,  estimate: '3 hari', sprint: 2, assignee: 'Arka Jenar', description: 'Buat halaman analytics untuk admin dengan chart kunjungan, artikel terpopuler, dan engagement.', tags: ['Chart.js', 'Dashboard', 'Admin'] },
  { id: 10, name: 'Caching Strategy & Pagination API',   project: 'CMS',        category: 'Backend',  status: 'todo',     priority: 'medium',   deadline: '2026-04-22', progress: 0,   estimate: '2 hari', sprint: 2, assignee: 'Arka Jenar', description: 'Implementasi Redis caching dan cursor-based pagination untuk endpoint artikel dan komentar.', tags: ['Redis', 'PostgreSQL', 'Performance'] },
  { id: 11, name: 'Portfolio Case Study — ThreadMark',   project: 'Portfolio',  category: 'Konten',   status: 'todo',     priority: 'low',      deadline: '2026-04-25', progress: 0,   estimate: '1 hari', sprint: 1, assignee: 'Arka Jenar', description: 'Tulis studi kasus proyek ThreadMark untuk portfolio, termasuk problem statement dan hasil.', tags: ['Writing', 'Case Study', 'Portfolio'] },
  { id: 12, name: 'Deploy ke Vercel — Portfolio',        project: 'Portfolio',  category: 'DevOps',   status: 'done',     priority: 'low',      deadline: '2026-04-03', progress: 100, estimate: '3 jam',  sprint: 1, assignee: 'Arka Jenar', description: 'Setup CI/CD dan deploy portfolio ke Vercel dengan custom domain.', tags: ['Vercel', 'CI/CD', 'Deployment'] },
])

const projectOptions = ['ThreadMark', 'CMS', 'Portfolio']

const newTask = reactive({
  name: '', description: '', project: 'ThreadMark', category: '',
  priority: 'medium', deadline: '', estimate: '', sprint: 4, assignee: 'Arka Jenar', tags: [] as string[]
})

const totalTasks = computed(() => tasks.length)
const doneCount = computed(() => tasks.filter(t => t.status === 'done').length)
const overallProgress = computed(() => Math.round(doneCount.value / (totalTasks.value || 1) * 100))

const quickStats = computed(() => [
  { label: 'selesai',  value: doneCount.value,                                      dotColor: '#3F3F46' },
  { label: 'proses',   value: tasks.filter(t => t.status === 'doing').length,       dotColor: '#71717A' },
  { label: 'revisi',   value: tasks.filter(t => t.status === 'revision').length,    dotColor: '#F59E0B' },
  { label: 'belum',    value: tasks.filter(t => t.status === 'todo').length,        dotColor: '#E4E4E7' },
])

const filterOptions = computed(() => [
  { id: 'all',      label: 'Semua',   count: tasks.length },
  { id: 'todo',     label: 'Belum Dimulai',   count: tasks.filter(t => t.status === 'todo').length },
  { id: 'doing',    label: 'Dalam Proses',  count: tasks.filter(t => t.status === 'doing').length },
  { id: 'revision', label: 'Perlu Revisi', count: tasks.filter(t => t.status === 'revision').length },
  { id: 'done',     label: 'Selesai', count: tasks.filter(t => t.status === 'done').length },
])

const priorityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }
const statusOrderMap: Record<string, number> = { revision: 0, doing: 1, todo: 2, done: 3 }

const filteredTasks = computed(() => {
  let list = [...tasks]
  if (activeFilter.value !== 'all') list = list.filter(t => t.status === activeFilter.value)
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(t => t.name.toLowerCase().includes(q) || t.project.toLowerCase().includes(q) || t.category.toLowerCase().includes(q))
  }
  if (sortBy.value === 'priority') list.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  else if (sortBy.value === 'deadline') list.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
  else if (sortBy.value === 'project') list.sort((a, b) => a.project.localeCompare(b.project))
  else if (sortBy.value === 'status') list.sort((a, b) => statusOrderMap[a.status] - statusOrderMap[b.status])
  return list
})

const priorityDistribution = computed(() => [
  { level: 'critical', label: 'Critical', color: '#18181B', count: tasks.filter(t=>t.priority==='critical').length },
  { level: 'high',     label: 'High',     color: '#52525B', count: tasks.filter(t=>t.priority==='high').length },
  { level: 'medium',   label: 'Medium',   color: '#A1A1AA', count: tasks.filter(t=>t.priority==='medium').length },
  { level: 'low',      label: 'Low',      color: '#E4E4E7', count: tasks.filter(t=>t.priority==='low').length },
])

function toggleExpand(id: number) {
  expandedTask.value = expandedTask.value === id ? null : id
}

function cycleStatus(id: number) {
  const task = tasks.find(t => t.id === id)
  if (!task) return
  const idx = statusOrder.indexOf(task.status)
  task.status = statusOrder[(idx + 1) % statusOrder.length]
  if (task.status === 'done') task.progress = 100
  else if (task.status === 'todo') task.progress = 0
}

function deleteTask(id: number) {
  const idx = tasks.findIndex(t => t.id === id)
  if (idx !== -1) { tasks.splice(idx, 1); expandedTask.value = null }
}

function addTask() {
  if (!newTask.name) return
  tasks.push({
    id: Date.now(),
    name: newTask.name, description: newTask.description,
    project: newTask.project, category: newTask.category || 'Lainnya',
    status: 'todo', priority: newTask.priority as any,
    deadline: newTask.deadline || new Date().toISOString().slice(0, 10),
    progress: 0, estimate: newTask.estimate || '-',
    sprint: newTask.sprint, assignee: newTask.assignee, tags: []
  })
  Object.assign(newTask, { name: '', description: '', project: 'ThreadMark', category: '', priority: 'medium', deadline: '', estimate: '', sprint: 4 })
  showAddModal.value = false
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

function getStatusBtnStyle(status: string) {
  const meta = statusMeta[status]
  return {
    backgroundColor: meta.bgClass,
    borderColor: meta.borderClass,
    color: meta.textClass
  }
}

function getDeadlineColorClass(dateStr: string) {
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000)
  if (diff < 0) return 'text-[#E11D48]'
  if (diff <= 1) return 'text-[#F59E0B]'
  return 'text-[#A1A1AA]'
}
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }

.task-fade-enter-active, .task-fade-leave-active { transition: all 0.2s ease; }
.task-fade-enter-from, .task-fade-leave-to { opacity: 0; transform: translateY(-4px); }

.expand-enter-active, .expand-leave-active { transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1); overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
.expand-enter-to, .expand-leave-from { opacity: 1; max-height: 600px; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-from > div, .modal-fade-leave-to > div { transform: translateY(20px) scale(0.97); }
</style>