<!-- [slug].vue -->
<template>
  <div class="h-screen overflow-hidden bg-[#F8F9FD] font-['Instrument_Sans','Raleway',sans-serif] relative flex">
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-[5%] -left-[5%] w-[45%] h-[45%] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#443E8D]/[0.06] to-transparent filter blur-[120px]"></div>
      <div class="absolute top-[5%] -right-[5%] w-[30%] h-[30%] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-400/[0.04] to-transparent filter blur-[120px]"></div>
    </div>
    <div class="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#443E8D06_1px,transparent_1px),linear-gradient(to_bottom,#443E8D06_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,transparent,black_5%,black_95%,transparent)]" aria-hidden="true"></div>

    <StudentSidebar :open="sidebarOpen" @update:open="sidebarOpen = $event" />

    <div class="lg:ml-[210px] min-[901px]:ml-[210px] flex-1 min-w-0 relative z-10 flex flex-col h-screen overflow-hidden">
      <!-- Premium Topbar -->
      <header class="sticky top-0 z-[100] flex-shrink-0 flex items-center gap-4 px-6 py-3.5 bg-[#F8F9FD]/90 backdrop-blur-xl border-b border-gray-200">
        <button class="min-[901px]:hidden p-2 rounded-xl border border-gray-200 text-gray-500" @click="sidebarOpen = !sidebarOpen" aria-label="Menu">
          <Bars3Icon class="w-5 h-5" />
        </button>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <NuxtLink to="/student/class" class="text-[0.625rem] font-bold text-gray-400 hover:text-[#443E8D] transition-colors uppercase tracking-widest">Kelas</NuxtLink>
            <span class="text-[0.625rem] text-gray-300">/</span>
            <span class="text-[0.625rem] font-black text-[#443E8D] uppercase tracking-widest truncate max-w-[200px]">{{ moduleData?.title || 'Memuat...' }}</span>
          </div>
          <h1 class="text-[1.0625rem] font-bold text-gray-900 leading-none truncate flex items-center gap-2">
            <component :is="moduleData ? PresentationChartLineIcon : DocumentTextIcon" class="w-4 h-4 text-[#443E8D]" />
            {{ moduleData?.title || 'Memuat...' }}
          </h1>
        </div>
        
        <div v-if="moduleData" class="flex items-center gap-4 pl-4 border-l border-gray-200">
          <div class="flex flex-col items-end">
            <span class="text-[0.625rem] font-black text-[#443E8D] uppercase tracking-widest">{{ progressPercent }}% Selesai</span>
            <div class="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1">
              <div class="h-full bg-gradient-to-r from-[#443E8D] to-indigo-400 transition-all duration-1000" :style="{ width: progressPercent + '%' }"></div>
            </div>
          </div>
        </div>
      </header>

      <div v-if="isLoading" class="flex-1 flex items-center justify-center">
        <div class="flex flex-col items-center gap-4">
          <div class="w-10 h-10 border-[3px] border-[#443E8D]/20 border-t-[#443E8D] rounded-full animate-spin" />
          <p class="text-sm font-medium text-gray-400">Memuat modul...</p>
        </div>
      </div>

      <div v-else-if="errorMsg" class="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
        <div class="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center">
          <ExclamationCircleIcon class="w-8 h-8 text-rose-400" />
        </div>
        <p class="text-lg font-bold text-gray-800">{{ errorMsg }}</p>
        <NuxtLink to="/student/class" class="px-6 py-3 rounded-xl bg-[#443E8D] text-white text-sm font-bold shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all">← Kembali ke Kelas</NuxtLink>
      </div>

      <div v-else-if="moduleData && currentLesson" class="flex flex-1 overflow-hidden">
        <main class="flex-1 overflow-y-auto bg-white p-6 lg:p-12 relative scroll-smooth">
          <div class="max-w-3xl mx-auto w-full flex flex-col gap-10 min-h-full">

            <div v-if="isLessonLoading" class="flex flex-col items-center justify-center py-32 gap-4">
              <div class="w-8 h-8 border-[3px] border-[#443E8D]/20 border-t-[#443E8D] rounded-full animate-spin" />
            </div>

            <template v-else>
              <!-- Lesson Header -->
              <div v-if="currentLesson.type !== 'quiz'" class="flex flex-col gap-4">
                <div class="flex items-center gap-3">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.625rem] font-black uppercase tracking-[0.15em] border"
                    :class="lessonTypeStyle(currentLesson.type)">
                    <component :is="lessonTypeIcon(currentLesson.type)" class="w-3.5 h-3.5" />
                    {{ lessonTypeLabel(currentLesson.type) }}
                  </span>
                  <span v-if="currentLesson.xp_reward" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[0.625rem] font-black bg-amber-50 text-amber-600 border border-amber-200/60 uppercase tracking-wider">
                    ⚡ +{{ currentLesson.xp_reward }} XP
                  </span>
                  <span class="text-[0.6875rem] font-black text-[#443E8D] uppercase tracking-[0.2em] opacity-60">
                    Pelajaran {{ currentLessonIdx + 1 }} dari {{ moduleData.module_lessons.length }}
                  </span>
                </div>
                <h2 class="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight">{{ currentLesson.title }}</h2>
              </div>

              <!-- Video Embed -->
              <div v-if="currentLesson.type === 'video' && lessonDetail?.video_url" class="rounded-3xl overflow-hidden border border-gray-100 shadow-2xl shadow-indigo-100/50 aspect-video bg-gray-900 group relative">
                <iframe ref="videoIframe" :id="'yt-' + lessonDetail.id" :src="getEmbedUrl(lessonDetail.video_url)" class="w-full h-full relative z-10" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen frameborder="0" />
              </div>

              <!-- Content Renderer -->
              <div v-if="currentLesson.type !== 'quiz' && parsedLessonContent.length > 0" class="notion-body flex flex-col" @click="handleContentClick">
                <template v-for="(block, bi) in parsedLessonContent" :key="block.id || bi">

                  <h1 v-if="block.type === 'heading1'" class="text-3xl lg:text-4xl font-black text-gray-900 mt-10 mb-4 leading-tight tracking-tight border-b border-gray-100 pb-3" v-html="formatRichText(block.content)"></h1>
                  <h2 v-else-if="block.type === 'heading2'" class="text-2xl lg:text-3xl font-bold text-gray-900 mt-9 mb-3 leading-snug tracking-tight" v-html="formatRichText(block.content)"></h2>
                  <h3 v-else-if="block.type === 'heading3'" class="text-xl lg:text-2xl font-bold text-gray-900 mt-7 mb-2 leading-snug tracking-tight" v-html="formatRichText(block.content)"></h3>

                  <div v-else-if="isImageBlock(block)" class="my-6 flex flex-col items-center">
                    <div class="rounded-2xl overflow-hidden border border-gray-200/70 shadow-sm bg-gray-50/50 max-w-full p-2 group hover:shadow-md transition-all">
                      <img :src="getImageUrl(block)" alt="Ilustrasi materi" class="max-w-full max-h-[500px] h-auto object-contain rounded-xl mx-auto" loading="lazy" />
                    </div>
                    <span v-if="block.caption" class="text-xs text-gray-400 mt-2 italic text-center" v-html="formatRichText(block.caption)"></span>
                  </div>

                  <div v-else-if="block.type === 'table'" class="my-6 overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
                    <table class="w-full text-left border-collapse min-w-[500px]">
                      <tbody>
                        <!-- Ubah iterasi dari block.tableData menjadi block.tableData?.rows -->
                        <tr v-for="(row, rIdx) in (block.tableData?.rows || block.content || [])" :key="rIdx" class="border-b border-gray-200 last:border-0 hover:bg-indigo-50/30 transition-colors">
                          <!-- Ubah block.withHeadings menjadi block.tableData?.withHeadings -->
                          <component 
                            :is="(block.tableData?.withHeadings && rIdx === 0) ? 'th' : 'td'" 
                            v-for="(cell, cIdx) in row" 
                            :key="cIdx" 
                            class="px-5 py-4 border-r border-gray-200 last:border-0 text-[0.9375rem] leading-relaxed" 
                            :class="[(block.tableData?.withHeadings && rIdx === 0) ? 'font-bold bg-gray-50 text-gray-900' : 'text-gray-600 font-normal']" 
                            v-html="formatRichText(cell)">
                          </component>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div v-else-if="block.type === 'embed'" class="my-6 flex flex-col items-center group">
                    <div class="w-full rounded-2xl overflow-hidden border border-gray-200/80 shadow-md bg-gray-900 aspect-[16/9] relative transition-all group-hover:shadow-lg">
                      <iframe :src="block.url" class="w-full h-full absolute inset-0" frameborder="0" allowfullscreen="allowfullscreen" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
                    </div>
                    <span v-if="block.caption" class="text-xs text-gray-400 mt-2 italic text-center" v-html="formatRichText(block.caption)"></span>
                  </div>

                  <div v-else-if="block.type === 'paragraph' && (!block.content || !block.content.trim() || block.content === '<br>')" class="h-3"></div>
                  <p v-else-if="block.type === 'paragraph'" class="text-[1.0rem] lg:text-[1.0625rem] font-normal text-gray-600 leading-relaxed mb-3">
                    <span v-html="formatRichText(block.content)"></span>
                  </p>

                  <div v-else-if="block.type === 'callout'" class="flex gap-4 p-5 rounded-2xl bg-indigo-50 border border-indigo-100 my-4">
                    <span class="text-2xl flex-shrink-0">💡</span>
                    <div class="text-[0.9375rem] text-[#443E8D] font-normal leading-relaxed" v-html="formatRichText(block.content)"></div>
                  </div>

                  <blockquote v-else-if="block.type === 'quote'" class="pl-5 border-l-4 border-[#443E8D]/40 my-4 py-2 text-gray-500 text-[0.9375rem] leading-relaxed bg-[#443E8D]/[0.03] rounded-r-lg pr-4" v-html="formatRichText(block.content)" />

                  <div v-else-if="block.type === 'code'" class="relative my-7 rounded-2xl overflow-hidden shadow-xl shadow-gray-900/20 ring-1 ring-white/5">
                    <!-- Window chrome bar -->
                    <div class="flex items-center justify-between bg-gradient-to-r from-[#1a1f2e] to-[#1e2436] px-4 py-3 border-b border-white/[0.06]">
                      <!-- Traffic lights -->
                      <div class="flex items-center gap-2">
                        <span class="w-3 h-3 rounded-full bg-[#FF5F57] shadow-sm shadow-red-500/50" />
                        <span class="w-3 h-3 rounded-full bg-[#FEBC2E] shadow-sm shadow-yellow-400/50" />
                        <span class="w-3 h-3 rounded-full bg-[#28C840] shadow-sm shadow-green-400/50" />
                        <span class="ml-3 text-[0.6rem] font-mono font-bold uppercase tracking-[0.2em] text-gray-500">{{ block.language || 'code' }}</span>
                      </div>
                      <!-- Copy button -->
                      <button
                        class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.68rem] font-semibold transition-all duration-200"
                        :class="copiedIdx === bi
                          ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                          : 'bg-white/[0.06] text-gray-400 hover:bg-white/[0.12] hover:text-white ring-1 ring-white/[0.08]'"
                        @click="copyCode(cleanCodeContent(block.content), bi)"
                      >
                        <svg v-if="copiedIdx === bi" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                        <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        {{ copiedIdx === bi ? 'Tersalin!' : 'Salin' }}
                      </button>
                    </div>
                    <!-- Code body -->
                    <pre class="bg-[#161b27] overflow-x-auto px-6 py-5 m-0"><code class="font-mono text-[0.875rem] leading-[1.75] whitespace-pre text-[#a8d8a8]">{{ cleanCodeContent(block.content) }}</code></pre>
                  </div>

                  <div v-else-if="block.type === 'divider'" class="my-8">
                    <hr class="border-0 border-t border-gray-200" />
                  </div>

                  <!-- Bookmark card -->
                  <a
                    v-else-if="block.type === 'bookmark'"
                    :href="block.bookmarkData?.url || block.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center gap-3 my-4 px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-[#443E8D]/[0.03] hover:border-[#443E8D]/30 transition-all group no-underline"
                  >
                    <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white border border-gray-200 text-[#443E8D] shadow-sm">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="text-[0.85rem] font-semibold text-gray-800 truncate group-hover:text-[#443E8D] transition-colors">
                        {{ block.bookmarkData?.title || block.bookmarkData?.url || block.url }}
                      </p>
                      <p v-if="block.bookmarkData?.description" class="text-[0.75rem] text-gray-400 mt-0.5 truncate">{{ block.bookmarkData.description }}</p>
                      <p class="text-[0.7rem] text-gray-400 mt-0.5 truncate">{{ block.bookmarkData?.url || block.url }}</p>
                    </div>
                    <svg class="w-4 h-4 shrink-0 text-gray-300 group-hover:text-[#443E8D] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>

                  <!-- Canva embed -->
                  <div v-else-if="block.type === 'canva'" class="my-6 rounded-xl overflow-hidden border border-gray-200 shadow-sm" style="position:relative;width:100%;height:0;padding-bottom:56.25%;">
                    <iframe
                      :src="block.url"
                      loading="lazy"
                      allow="fullscreen"
                      allowfullscreen
                      style="position:absolute;width:100%;height:100%;top:0;left:0;border:none;"
                    />
                  </div>

                  <!-- NESTED LIST RENDERER (Bullet & Numbered) -->
                  <component
                    v-else-if="block.type === 'bulletList' || block.type === 'numberedList'"
                    :is="NestedListRenderer"
                    :items="block.items"
                    :isOrdered="block.type === 'numberedList'"
                    :level="1"
                  />

                </template>
              </div>

              <!-- Interactive Quiz (sama seperti sebelumnya) -->
              <div v-else-if="currentLesson.type === 'quiz'" class="flex flex-col gap-8">
                <!-- ... [Bagian Quiz sama persis dengan versi Anda sebelumnya] ... -->
                <div class="p-12 bg-white rounded-3xl border border-gray-200 text-center flex flex-col items-center gap-4">
                  <AcademicCapIcon class="w-10 h-10 text-gray-300" />
                  <div>
                    <h3 class="text-lg font-bold text-gray-800">Kuis Evaluasi</h3>
                    <p class="text-sm text-gray-400 mt-1">Kuis akan tampil apabila soal tersedia.</p>
                  </div>
                </div>
              </div>

              <div v-else-if="!isLessonLoading && currentLesson.type !== 'video' && parsedLessonContent.length === 0" class="flex flex-col items-center justify-center py-20 text-center gap-4">
                <div class="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm"><DocumentTextIcon class="w-8 h-8 text-gray-300" /></div>
                <div><h3 class="text-lg font-bold text-gray-700">Konten Kosong</h3><p class="text-sm text-gray-400 mt-1">Mentor belum menambahkan isi materi.</p></div>
              </div>

              <div class="flex items-center justify-between pt-10 border-t border-gray-100 mt-auto">
                <button class="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:border-[#443E8D] hover:text-[#443E8D] transition-all disabled:opacity-30 disabled:pointer-events-none group" :disabled="currentLessonIdx === 0" @click="prevLesson"><ArrowLeftIcon class="w-4 h-4 transition-transform group-hover:-translate-x-1" />Sebelumnya</button>
                <button class="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md group" :class="isDone ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default opacity-80' : 'bg-[#443E8D] text-white hover:bg-[#363175] cursor-pointer shadow-indigo-200'" :disabled="isDone" @click="markDone"><CheckCircleIcon class="w-4 h-4" />{{ isDone ? 'Sudah Selesai ✓' : 'Tandai Selesai' }}</button>
                <button class="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:border-[#443E8D] hover:text-[#443E8D] transition-all disabled:opacity-30 disabled:pointer-events-none group" :disabled="currentLessonIdx >= moduleData.module_lessons.length - 1" @click="nextLesson">Berikutnya<ArrowRightIcon class="w-4 h-4 transition-transform group-hover:translate-x-1" /></button>
              </div>
            </template>
          </div>
        </main>

        <aside class="hidden xl:flex w-72 flex-shrink-0 bg-white border-l border-gray-200 flex-col z-10 relative overflow-hidden">
          <!-- Sidebar header -->
          <div class="flex-shrink-0 px-5 py-4 border-b border-gray-100">
            <p class="text-[0.625rem] font-black uppercase tracking-[0.18em] text-gray-400">Daftar Pelajaran</p>
            <p class="mt-0.5 text-[0.75rem] font-semibold text-gray-700">
              {{ completedCount }} / {{ moduleData?.module_lessons?.length ?? 0 }} selesai
            </p>
            <!-- Progress bar -->
            <div class="mt-2.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-gradient-to-r from-[#443E8D] to-indigo-400 rounded-full transition-all duration-700"
                :style="{ width: progressPercent + '%' }"
              />
            </div>
          </div>

          <!-- Lesson list -->
          <div class="flex-1 overflow-y-auto py-2 custom-scrollbar">
            <button
              v-for="(lesson, idx) in moduleData?.module_lessons ?? []"
              :key="lesson.id"
              class="w-full flex items-start gap-3 px-4 py-3 text-left transition-all hover:bg-gray-50 group relative"
              :class="idx === currentLessonIdx ? 'bg-[#443E8D]/[0.05]' : ''"
              @click="goToLesson(idx)"
            >
              <!-- Active indicator -->
              <div
                v-if="idx === currentLessonIdx"
                class="absolute left-0 top-2 bottom-2 w-0.5 bg-[#443E8D] rounded-r-full"
              />

              <!-- Status icon -->
              <div
                class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 border transition-colors"
                :class="doneSet.has(lesson.id)
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : idx === currentLessonIdx
                    ? 'border-[#443E8D] bg-[#443E8D]/10'
                    : 'border-gray-200 bg-gray-50'"
              >
                <CheckCircleIcon v-if="doneSet.has(lesson.id)" class="w-3.5 h-3.5" />
                <span
                  v-else-if="idx === currentLessonIdx"
                  class="w-2 h-2 rounded-full bg-[#443E8D]"
                />
                <span v-else class="w-1.5 h-1.5 rounded-full bg-gray-300" />
              </div>

              <!-- Lesson info -->
              <div class="min-w-0 flex-1">
                <p
                  class="text-[0.8rem] font-medium leading-snug transition-colors"
                  :class="idx === currentLessonIdx
                    ? 'text-[#443E8D] font-semibold'
                    : doneSet.has(lesson.id)
                      ? 'text-gray-400 line-through'
                      : 'text-gray-700 group-hover:text-gray-900'"
                >
                  {{ lesson.title }}
                </p>
                <div class="flex items-center gap-1.5 mt-1">
                  <component
                    :is="lessonTypeIcon(lesson.type)"
                    class="w-3 h-3 flex-shrink-0"
                    :class="idx === currentLessonIdx ? 'text-[#443E8D]' : 'text-gray-300'"
                  />
                  <span class="text-[0.65rem] capitalize" :class="idx === currentLessonIdx ? 'text-[#443E8D]' : 'text-gray-400'">
                    {{ lessonTypeLabel(lesson.type) }}
                  </span>
                  <span v-if="lesson.xp_reward" class="text-[0.6rem] text-amber-500 font-semibold">· +{{ lesson.xp_reward }} XP</span>
                </div>
              </div>

              <!-- Lesson number -->
              <span class="flex-shrink-0 text-[0.625rem] font-bold text-gray-300 mt-1">{{ idx + 1 }}</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, h } from 'vue' // <--- Tambahkan import 'h' di sini
import StudentSidebar from '~/components/student/StudentSidebar.vue'
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, ChevronRightIcon, DocumentTextIcon, VideoCameraIcon, AcademicCapIcon, ClipboardDocumentListIcon, Bars3Icon, ExclamationCircleIcon, PresentationChartLineIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

useSeoMeta({ title: 'Class Module — Pixelnoid Academy' })
definePageMeta({ layout: 'dashboard' })

const supabase = useSupabaseClient()
const sidebarOpen = ref(false)

interface LessonMeta { id: number; title: string; slug: string; type: string; sort_order: number; video_url?: string | null; xp_reward?: number | null; progress_status?: string }
interface LessonDetail { id: number; title: string; slug: string; type: string; video_url: string | null; xp_reward?: number | null; content: ContentBlock[] | string | null; progress_status?: string }
interface ContentBlock { 
  id?: string; 
  type: string; 
  content?: string | any[]; 
  url?: string; 
  caption?: string; 
  items?: any[]; 
  tableData?: {
    rows: string[][];
    colWidths?: number[];
    withHeadings?: boolean;
  } | any; 
  withHeadings?: boolean; 
  embedService?: string 
}
interface QuizQuestion { id: string | number; question: string; options: string[]; correct_answer: number | string; explanation?: string }
interface ModuleData { id: number; title: string; slug: string; description: string | null; xp_reward: number | null; estimated_minutes: number | null; class_id: number; module_lessons: LessonMeta[] }

const moduleData = ref<ModuleData | null>(null)
const lessonDetail = ref<LessonDetail | null>(null)
const isLoading = ref(true)
const isLessonLoading = ref(false)
const errorMsg = ref('')
const currentLessonIdx = ref(0)
const doneSet = ref(new Set<number>())
const copiedIdx = ref<number | null>(null)

// ── Functional Component untuk Nested List ──────────────────────
// Items bisa berupa string HTML langsung ATAU objek { content, items }
const getItemHtml = (item: any): string => {
  if (typeof item === 'string') return item
  if (item && typeof item === 'object') return item.content || item.text || ''
  return ''
}
const getSubItems = (item: any): any[] => {
  if (typeof item === 'object' && item?.items) return item.items
  return []
}

// ── Rich Text & Link Helpers ─────────────────────────────────────
function formatRichText(content: any): string {
  if (content === null || content === undefined) return ''
  let text = typeof content === 'string' ? content : String(content)
  if (!text) return ''

  // 1. Unescape markdown-escaped punctuation (e.g. "4\. " -> "4. ", "\[" -> "[", "\]" -> "]")
  text = text.replace(/\\([.[\]()_*`~#+!\\-])/g, '$1')

  // 2. Decode double-escaped &amp; if needed (e.g., "Routing &amp; Controllers" -> "Routing & Controllers")
  text = text.replace(/&amp;/g, '&')

  // 3. Markdown inline code: `code` -> <code class="px-inline-code">code</code>
  text = text.replace(/`([^`]+)`/g, '<code class="px-inline-code">$1</code>')

  // 4. Markdown bold: **text** or __text__ -> <strong>text</strong>
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  text = text.replace(/__(.+?)__/g, '<strong>$1</strong>')

  // 5. Markdown italic: *text* or _text_ -> <em>text</em>
  text = text.replace(/(^|[^\*])\*([^\*]+?)\*([^\*]|$)/g, '$1<em>$2</em>$3')
  text = text.replace(/(^|[^a-zA-Z0-9_])_([^_]+?)_([^a-zA-Z0-9_]|$)/g, '$1<em>$2</em>$3')

  // 6. Markdown strikethrough: ~~text~~ -> <del>text</del>
  text = text.replace(/~~(.+?)~~/g, '<del>$1</del>')

  // 7. Markdown links: [label](url) -> <a href="url" target="_blank" rel="noopener noreferrer">label</a>
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')

  // 8. Ensure ALL <a ...> tags (both from input HTML and generated) have target="_blank" and rel="noopener noreferrer"
  text = text.replace(/<a\b([^>]*)>/gi, (match, attrs) => {
    let newAttrs = attrs
    if (/target\s*=/i.test(newAttrs)) {
      newAttrs = newAttrs.replace(/target\s*=\s*["'][^"']*["']/gi, 'target="_blank"')
    } else {
      newAttrs += ' target="_blank"'
    }
    if (/rel\s*=/i.test(newAttrs)) {
      newAttrs = newAttrs.replace(/rel\s*=\s*["'][^"']*["']/gi, 'rel="noopener noreferrer"')
    } else {
      newAttrs += ' rel="noopener noreferrer"'
    }
    return `<a${newAttrs}>`
  })

  return text
}

function cleanCodeContent(code: any): string {
  if (!code || typeof code !== 'string') return code || ''
  return code.replace(/\\(\[|\])/g, '$1')
}

function handleContentClick(e: MouseEvent) {
  const target = (e.target as HTMLElement)?.closest('a')
  if (target && target.getAttribute('href')) {
    const href = target.getAttribute('href')!
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//')) {
      target.setAttribute('target', '_blank')
      target.setAttribute('rel', 'noopener noreferrer')
    }
  }
}

const NestedListRenderer = (props: { items: any[], isOrdered: boolean, level: number }): any => {
  if (!props.items || props.items.length === 0) return null

  const isTopLevel = props.level === 1

  return h(props.isOrdered ? 'ol' : 'ul', { class: isTopLevel ? 'flex flex-col gap-3 my-4 pl-2' : 'flex flex-col gap-2 mt-2 pl-6' },
    props.items.map((item: any, i: number) => {
      const rawHtml = getItemHtml(item)
      const html = formatRichText(rawHtml)
      const subItems = getSubItems(item)

      const contentNode = h('span', {
        class: 'text-[1.0rem] font-normal text-gray-600 leading-relaxed flex-1',
        innerHTML: html
      })

      let itemContent
      if (isTopLevel) {
        itemContent = h('div', { class: 'flex items-start gap-3' }, [
          props.isOrdered
            ? h('span', { class: 'w-5 h-5 rounded-md bg-[#443E8D]/10 text-[#443E8D] flex items-center justify-center text-[0.7rem] font-black flex-shrink-0 mt-0.5 border border-[#443E8D]/20' }, String(i + 1))
            : h('span', { class: 'w-1.5 h-1.5 rounded-full bg-[#443E8D] mt-[0.55rem] flex-shrink-0' }),
          contentNode
        ])
      } else {
        itemContent = h('div', { class: 'flex items-start gap-2' }, [
          props.isOrdered
            ? h('span', { class: 'text-[0.75rem] text-[#443E8D] font-bold mt-0.5 flex-shrink-0 min-w-[1rem]' }, String(i + 1) + '.')
            : h('span', { class: 'w-1 h-1 rounded-full bg-gray-400 mt-[0.55rem] flex-shrink-0' }),
          h('span', { class: 'text-[0.9375rem] text-gray-600 leading-relaxed font-normal flex-1', innerHTML: html })
        ])
      }

      return h('li', { class: 'list-none' }, [
        itemContent,
        subItems.length > 0
          ? h(NestedListRenderer, { items: subItems, isOrdered: props.isOrdered, level: props.level + 1 })
          : null
      ])
    })
  )
}
// ──────────────────────────────────────────────────────────────

const currentLesson = computed(() => moduleData.value?.module_lessons[currentLessonIdx.value] ?? null)
const completedCount = computed(() => doneSet.value.size)
const progressPercent = computed(() => {
  if (!moduleData.value || moduleData.value.module_lessons.length === 0) return 0
  return Math.round((completedCount.value / moduleData.value.module_lessons.length) * 100)
})
const isDone = computed(() => currentLesson.value ? doneSet.value.has(currentLesson.value.id) : false)

const parsedLessonContent = computed<ContentBlock[]>(() => {
  if (!lessonDetail.value?.content) return []
  let raw = lessonDetail.value.content
  if (typeof raw === 'string') {
    try { raw = JSON.parse(raw) } catch (e) { return [] }
  }
  return Array.isArray(raw) ? raw : []
})

// [Fungsi Helper lain, fetch, dll. - Biarkan utuh seperti versi kamu sebelumnya]
function lessonTypeIcon(type: string) { const m: any = { video: VideoCameraIcon, text: DocumentTextIcon, quiz: AcademicCapIcon, task: ClipboardDocumentListIcon }; return m[type] ?? DocumentTextIcon }
function lessonTypeLabel(type: string) { const m: any = { video: 'Video', text: 'Materi', quiz: 'Quiz', task: 'Tugas' }; return m[type] ?? type }
function lessonTypeStyle(type: string) { const m: any = { video: 'bg-rose-50 text-rose-600 border-rose-100', text: 'bg-emerald-50 text-emerald-700 border-emerald-100', quiz: 'bg-amber-50 text-amber-700 border-amber-100', task: 'bg-blue-50 text-blue-700 border-blue-100' }; return m[type] ?? 'bg-gray-50 text-gray-600 border-gray-100' }
function getEmbedUrl(url: string) { if (!url) return ''; const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/); if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1&showinfo=0`; return url }
function extractYouTubeId(url: string) { if (!url) return null; const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s?/]+)/); return yt ? yt[1] : null }
function isImageBlock(block: ContentBlock) {
  if (!block) return false
  if (block.type === 'image') return true
  if (block.type === 'paragraph' && typeof block.content === 'string') {
    const t = block.content.trim()
    return /^\[Image:\s*(.+?)\]$/i.test(t) || /^!\[.*?\]\((.+?)\)$/i.test(t) || /^https?:\/\/\S+\.(?:png|jpe?g|gif|webp|svg|bmp)(\?\S*)?$/i.test(t)
  }
  return false
}
function getImageUrl(block: ContentBlock) {
  if (!block) return ''
  let raw = ''
  if (block.type === 'image') raw = block.content || block.url || ''
  else if (typeof block.content === 'string') {
    const t = block.content.trim()
    const img = t.match(/^\[Image:\s*(.+?)\]$/i)
    if (img) raw = img[1]
    else { const md = t.match(/^!\[.*?\]\((.+?)\)$/i); raw = md ? md[1] : t }
  }
  return raw.replace(/&amp;/g, '&').trim()
}

let ytPlayer: any = null
const videoIframe = ref<HTMLElement | null>(null)

async function getValidToken(): Promise<string | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) return session.access_token

    // Tunggu sebentar jika auth client sedang mengembalikan session dari storage
    await new Promise(r => setTimeout(r, 250))
    const { data: retryData } = await supabase.auth.getSession()
    if (retryData?.session?.access_token) return retryData.session.access_token

    const { data: refreshData } = await supabase.auth.refreshSession()
    return refreshData?.session?.access_token || null
  } catch {
    return null
  }
}

async function markLessonCompleted(lessonId: number) {
  if (!lessonId) return
  try {
    const token = await getValidToken()
    if (!token) return
    await $fetch('/api/student/lessons/update-progress', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: { lesson_id: lessonId, status: 'completed' } })
  } catch (e) { console.error(e) }
}
function initYouTubePlayer(url: string) {
  const vid = extractYouTubeId(url); if (!vid) return
  if ((window as any).YT && (window as any).YT.Player) createYT()
  else { const script = document.createElement('script'); script.src = 'https://www.youtube.com/iframe_api'; document.head.appendChild(script); (window as any).onYouTubeIframeAPIReady = createYT }
  function createYT() {
    nextTick(() => {
      const el = document.getElementById('yt-' + (lessonDetail.value?.id ?? ''))
      if (!el) return
      try { ytPlayer = new (window as any).YT.Player(el, { events: { onStateChange: (e: any) => { if (e.data === 0 && currentLesson.value) markLessonCompleted(currentLesson.value.id) } } }) } catch (err) {}
    })
  }
}
async function copyCode(content: string | undefined, idx: number) {
  if (!content) return
  try { await navigator.clipboard.writeText(content); copiedIdx.value = idx; setTimeout(() => { copiedIdx.value = null }, 2000) } catch {}
}

// In-memory cache for lessons so switching between lessons is 0ms instant
const lessonCache = new Map<number, LessonDetail>()

function prefetchNextLesson() {
  const nextMeta = moduleData.value?.module_lessons[currentLessonIdx.value + 1]
  if (nextMeta && !lessonCache.has(nextMeta.id)) {
    getValidToken().then(token => {
      if (!token) return
      $fetch<{ lesson: LessonDetail }>(`/api/student/lessons/${nextMeta.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(data => {
        if (data?.lesson) {
          if (typeof data.lesson.content === 'string') {
            try { data.lesson.content = JSON.parse(data.lesson.content) } catch {}
          }
          lessonCache.set(nextMeta.id, data.lesson)
        }
      }).catch(() => {})
    })
  }
}

async function fetchModule() {
  isLoading.value = true; errorMsg.value = ''
  try {
    const token = await getValidToken()
    if (!token) { errorMsg.value = 'Sesi tidak ditemukan. Silakan login ulang.'; return }
    const data = await $fetch<{ module: ModuleData; initial_lesson?: LessonDetail }>(`/api/student/modules/${slug.value}`, { headers: { Authorization: `Bearer ${token}` } })
    moduleData.value = data.module
    const completedLessons = (data.module.module_lessons || []).filter((l: LessonMeta) => l.progress_status === 'completed').map((l: LessonMeta) => l.id)
    doneSet.value = new Set(completedLessons)

    // Fast Path: If initial_lesson is returned in the same payload, render in 0ms!
    if (data.initial_lesson) {
      lessonDetail.value = data.initial_lesson
      lessonCache.set(data.initial_lesson.id, data.initial_lesson)
      const foundIdx = (data.module.module_lessons || []).findIndex(l => l.id === data.initial_lesson!.id)
      if (foundIdx >= 0) currentLessonIdx.value = foundIdx
      if (data.initial_lesson.progress_status === 'completed') doneSet.value.add(data.initial_lesson.id)
      if (data.initial_lesson.type === 'video' && data.initial_lesson.video_url) initYouTubePlayer(data.initial_lesson.video_url)
      isLessonLoading.value = false
    } else {
      const firstLessonId = Number(data?.module?.module_lessons?.[0]?.id ?? 0)
      if (firstLessonId > 0) await fetchLessonDetail(firstLessonId)
    }

    useSeoMeta({ title: `${data.module.title} — Pixelnoid Academy` })
    // Background prefetch next lesson
    prefetchNextLesson()
  } catch (e: any) { errorMsg.value = e?.data?.statusMessage || e?.message || 'Gagal memuat modul.' }
  finally { isLoading.value = false }
}

async function fetchLessonDetail(lessonId: number) {
  // Check memory cache first (0ms instantaneous switch)
  if (lessonCache.has(lessonId)) {
    lessonDetail.value = lessonCache.get(lessonId)!
    isLessonLoading.value = false
    if (lessonDetail.value.progress_status === 'completed') doneSet.value.add(lessonDetail.value.id)
    if (lessonDetail.value.type === 'video' && lessonDetail.value.video_url) initYouTubePlayer(lessonDetail.value.video_url)
    prefetchNextLesson()
    return
  }

  isLessonLoading.value = true; lessonDetail.value = null
  try {
    const token = await getValidToken()
    if (!token) return
    const data = await $fetch<{ lesson: LessonDetail }>(`/api/student/lessons/${lessonId}`, { headers: { Authorization: `Bearer ${token}` } })
    lessonDetail.value = data.lesson
    if (typeof lessonDetail.value?.content === 'string') {
      try { lessonDetail.value.content = JSON.parse(lessonDetail.value.content) } catch (e) {}
    }
    lessonCache.set(lessonId, lessonDetail.value)
    if (lessonDetail.value.progress_status === 'completed') doneSet.value.add(lessonDetail.value.id)
    if (lessonDetail.value.type === 'video' && lessonDetail.value.video_url) initYouTubePlayer(lessonDetail.value.video_url)
    prefetchNextLesson()
  } catch (e) {} finally { isLessonLoading.value = false }
}

async function goToLesson(idx: number) { currentLessonIdx.value = idx; if (moduleData.value?.module_lessons[idx]) await fetchLessonDetail(moduleData.value.module_lessons[idx].id) }
function prevLesson() { if (currentLessonIdx.value > 0) goToLesson(currentLessonIdx.value - 1) }
function nextLesson() { if (moduleData.value && currentLessonIdx.value < moduleData.value.module_lessons.length - 1) goToLesson(currentLessonIdx.value + 1) }
async function markDone() {
  if (!currentLesson.value || !moduleData.value || isDone.value) return
  const id = currentLesson.value.id
  try {
    await markLessonCompleted(id); doneSet.value.add(id)
    try {
      const token = await getValidToken()
      if (token && moduleData.value?.class_id) { await $fetch('/api/student/class-progress', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: { class_id: moduleData.value.class_id } }) }
    } catch (e) {}
    if (currentLessonIdx.value < moduleData.value.module_lessons.length - 1) setTimeout(() => nextLesson(), 500)
  } catch (e) {}
}

onMounted(fetchModule)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); }
.notion-body h2 + p, .notion-body h3 + p { margin-top: 0; }

/* ── Deep styles for rich text in notion-body ────────────────── */
.notion-body :deep(strong),
.notion-body :deep(b) {
  font-weight: 700 !important;
  color: #111827;
}

.notion-body :deep(em),
.notion-body :deep(i) {
  font-style: italic !important;
}

.notion-body :deep(strong em),
.notion-body :deep(em strong),
.notion-body :deep(b i),
.notion-body :deep(i b) {
  font-weight: 700 !important;
  font-style: italic !important;
}

.notion-body :deep(a) {
  color: #443E8D;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1.5px;
  text-decoration-color: rgba(68, 62, 141, 0.4);
  transition: all 0.15s ease;
  word-break: break-word;
  cursor: pointer;
}

.notion-body :deep(a:hover) {
  color: #2b2762;
  text-decoration-color: #2b2762;
  background-color: rgba(68, 62, 141, 0.05);
  border-radius: 3px;
}

.notion-body :deep(.px-inline-code),
.notion-body :deep(code:not(pre code)) {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.85em;
  background-color: #F1F3F9;
  color: #363175;
  padding: 0.15rem 0.4rem;
  border-radius: 0.375rem;
  border: 1px solid #DCE0EF;
  font-weight: 600;
}

.notion-body :deep(u) {
  text-decoration: underline;
  text-underline-offset: 3px;
}

.notion-body :deep(del),
.notion-body :deep(s) {
  text-decoration: line-through;
  opacity: 0.7;
}

.notion-body :deep(mark) {
  background-color: #FEF08A;
  color: #713F12;
  padding: 0.1em 0.3em;
  border-radius: 0.25rem;
}
</style>