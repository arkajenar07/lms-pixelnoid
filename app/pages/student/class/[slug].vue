<template>
  <div class="min-h-screen bg-[#F8F9FD] font-['Instrument_Sans','Raleway',sans-serif] relative overflow-x-hidden flex flex-col">
    <!-- Ambient background glow effects -->
    <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div class="absolute -top-[5%] -left-[5%] w-[45%] h-[45%] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#443E8D]/[0.06] to-transparent filter blur-[120px]"></div>
      <div class="absolute top-[5%] -right-[5%] w-[30%] h-[30%] rounded-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-400/[0.04] to-transparent filter blur-[120px]"></div>
    </div>

    <!-- Dot pattern overlay -->
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

      <!-- ─── Loading State ─── -->
      <div v-if="isLoading" class="flex-1 flex items-center justify-center">
        <div class="flex flex-col items-center gap-4">
          <div class="w-10 h-10 border-[3px] border-[#443E8D]/20 border-t-[#443E8D] rounded-full animate-spin" />
          <p class="text-sm font-medium text-gray-400">Memuat modul...</p>
        </div>
      </div>

      <!-- ─── Error State ─── -->
      <div v-else-if="errorMsg" class="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
        <div class="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center">
          <ExclamationCircleIcon class="w-8 h-8 text-rose-400" />
        </div>
        <p class="text-lg font-bold text-gray-800">{{ errorMsg }}</p>
        <NuxtLink to="/student/class" class="px-6 py-3 rounded-xl bg-[#443E8D] text-white text-sm font-bold shadow-lg shadow-indigo-200 hover:-translate-y-0.5 transition-all">← Kembali ke Kelas</NuxtLink>
      </div>

      <!-- ─── Main Content ─── -->
      <div v-else-if="moduleData && currentLesson" class="flex flex-1 overflow-hidden">
        <!-- Main Area -->
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
                <iframe
                  ref="videoIframe"
                  :id="'yt-' + lessonDetail.id"
                  :src="getEmbedUrl(lessonDetail.video_url)"
                  class="w-full h-full relative z-10"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  frameborder="0"
                />
              </div>

              <!-- Notion JSONB Content Renderer -->
              <div v-if="currentLesson.type !== 'quiz' && parsedLessonContent.length > 0" class="notion-body flex flex-col gap-1">
                <template v-for="(block, bi) in parsedLessonContent" :key="block.id || bi">

                  <!-- Heading 1 -->
                  <h2 v-if="block.type === 'heading1'" class="text-2xl lg:text-[1.75rem] font-black text-gray-900 mt-12 mb-4 leading-tight tracking-tight border-b border-gray-100 pb-2">
                    {{ block.content }}
                  </h2>

                  <!-- Heading 2 -->
                  <h3 v-else-if="block.type === 'heading2'" class="text-xl font-bold text-gray-900 mt-8 mb-3 leading-snug">
                    {{ block.content }}
                  </h3>

                  <!-- Heading 3 -->
                  <h4 v-else-if="block.type === 'heading3'" class="text-lg font-bold text-gray-900 mt-6 mb-2 leading-snug">
                    {{ block.content }}
                  </h4>

                  <!-- Image Block (supports type 'image' or paragraph with [Image: ...]) -->
                  <div v-else-if="isImageBlock(block)" class="my-6 flex flex-col items-center">
                    <div class="rounded-2xl overflow-hidden border border-gray-200/70 shadow-sm bg-gray-50/50 max-w-full p-2 group hover:shadow-md transition-all">
                      <img
                        :src="getImageUrl(block)"
                        alt="Ilustrasi materi"
                        class="max-w-full max-h-[500px] h-auto object-contain rounded-xl mx-auto"
                        loading="lazy"
                      />
                    </div>
                    <span v-if="block.caption" class="text-xs text-gray-400 mt-2 italic text-center">{{ block.caption }}</span>
                  </div>

                  <!-- Paragraph -->
                  <p v-else-if="block.type === 'paragraph'" class="text-[1.0625rem] font-light text-gray-600 leading-relaxed mb-6">
                    <span v-if="block.content">{{ block.content }}</span>
                    <br v-else />
                  </p>

                  <!-- Callout -->
                  <div v-else-if="block.type === 'callout'" class="flex gap-4 p-6 rounded-2xl bg-indigo-50 border border-indigo-100 my-6">
                    <span class="text-2xl flex-shrink-0">💡</span>
                    <div class="text-[0.9375rem] text-[#443E8D] font-light leading-relaxed">{{ block.content }}</div>
                  </div>

                  <!-- Quote -->
                  <blockquote v-else-if="block.type === 'quote'" class="pl-5 border-l-4 border-emerald-500 my-6 py-1 text-gray-600 italic text-lg leading-relaxed bg-gradient-to-r from-emerald-50/50 to-transparent">
                    {{ block.content }}
                  </blockquote>

                  <!-- Code -->
                  <div v-else-if="block.type === 'code'" class="relative group my-8">
                    <div class="absolute right-3 top-3 px-2 py-1 bg-gray-800 text-gray-300 text-[0.625rem] font-mono rounded opacity-100 transition-opacity pointer-events-none z-10 group-hover:opacity-0">Code</div>
                    <button
                      class="absolute right-3 top-3 px-3 py-1.5 bg-[#443E8D] text-white text-[0.625rem] font-mono rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-500 hover:scale-105 z-20 shadow-lg"
                      @click="copyCode(block.content, bi)"
                      title="Salin kode"
                    >
                      {{ copiedIdx === bi ? 'Tersalin!' : 'Salin' }}
                    </button>
                    <pre class="bg-[#1E293B] border border-gray-800 text-gray-100 p-6 rounded-2xl overflow-x-auto shadow-2xl relative"><code class="font-mono text-sm whitespace-pre-wrap text-emerald-300">{{ block.content }}</code></pre>
                  </div>

                  <!-- Divider -->
                  <div v-else-if="block.type === 'divider'" class="my-10 flex items-center justify-center">
                    <div class="w-24 h-1 bg-gray-200 rounded-full"></div>
                  </div>

                  <!-- Bullet List -->
                  <ul v-else-if="block.type === 'bulletList'" class="flex flex-col gap-3 my-4 pl-2">
                    <li v-for="(item, ii) in (block.items || [])" :key="ii" class="flex items-start gap-4 text-[1.0625rem] font-light text-gray-600 leading-relaxed">
                      <span class="w-1.5 h-1.5 rounded-full bg-[#443E8D] mt-2.5 flex-shrink-0 shadow-sm shadow-indigo-200"></span>
                      <span>{{ item }}</span>
                    </li>
                  </ul>

                  <!-- Numbered List -->
                  <ol v-else-if="block.type === 'numberedList'" class="flex flex-col gap-4 my-4 pl-2">
                    <li v-for="(item, ii) in (block.items || [])" :key="ii" class="flex items-start gap-4 text-[1.0625rem] font-light text-gray-600 leading-relaxed">
                      <span class="w-6 h-6 rounded-lg bg-[#443E8D]/10 text-[#443E8D] flex items-center justify-center text-[0.75rem] font-black flex-shrink-0 mt-0.5 border border-[#443E8D]/20 shadow-inner">{{ ii + 1 }}</span>
                      <span>{{ item }}</span>
                    </li>
                  </ol>

                </template>
              </div>

              <!-- Interactive Dynamic Quiz -->
              <div v-else-if="currentLesson.type === 'quiz'" class="flex flex-col gap-8">
                <div class="flex flex-col gap-3">
                  <div class="flex items-center gap-3">
                    <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[0.625rem] font-black uppercase tracking-[0.15em] border bg-amber-50 text-amber-700 border-amber-100">
                      <AcademicCapIcon class="w-3.5 h-3.5" />
                      Kuis Evaluasi
                    </span>
                    <span v-if="currentLesson.xp_reward" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[0.625rem] font-black bg-amber-50 text-amber-600 border border-amber-200/60 uppercase tracking-wider">
                      ⚡ +{{ currentLesson.xp_reward }} XP
                    </span>
                    <span class="text-[0.6875rem] font-black text-[#443E8D] uppercase tracking-[0.2em] opacity-60">
                      {{ quizQuestions.length }} Soal
                    </span>
                  </div>
                  <h2 class="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight">{{ currentLesson.title }}</h2>
                  <p class="text-sm sm:text-base text-gray-500 font-light">
                    Jawab pertanyaan di bawah ini untuk menguji pemahaman materi kamu. Kuis ini dapat dikerjakan ulang kapan saja.
                  </p>
                </div>

                <!-- Score Banner (after submit) -->
                <div
                  v-if="quizSubmitted"
                  class="p-6 rounded-2xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-4"
                  :class="quizScore.percentage >= 70 ? 'bg-emerald-50/80 border-emerald-200' : 'bg-amber-50/80 border-amber-200'"
                >
                  <div class="flex items-center gap-4 text-center sm:text-left">
                    <div
                      class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0"
                      :class="quizScore.percentage >= 70 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'"
                    >
                      {{ quizScore.percentage >= 70 ? '🎉' : '💪' }}
                    </div>
                    <div>
                      <h3 class="text-lg font-bold text-gray-900">
                        {{ quizScore.percentage >= 70 ? 'Luar biasa! Kamu menyelesaikan kuis!' : 'Terus berlatih! Kamu bisa mencobanya lagi.' }}
                      </h3>
                      <p class="text-sm text-gray-600 mt-0.5">
                        Skor: <strong class="text-gray-900">{{ quizScore.correct }} dari {{ quizQuestions.length }} benar</strong> ({{ quizScore.percentage }}%)
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    @click="retryQuiz"
                    class="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold text-sm shadow-sm hover:bg-gray-50 hover:border-[#443E8D] hover:text-[#443E8D] transition-all cursor-pointer shrink-0 group"
                  >
                    <ArrowPathIcon class="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
                    Kerjakan Ulang
                  </button>
                </div>

                <!-- Questions List -->
                <div v-if="quizQuestions.length > 0" class="flex flex-col gap-6">
                  <div
                    v-for="(q, qIdx) in quizQuestions"
                    :key="q.id || qIdx"
                    class="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200/80 shadow-sm flex flex-col gap-5 transition-all"
                  >
                    <!-- Question Header -->
                    <div class="flex items-start gap-3.5">
                      <span class="w-7 h-7 rounded-xl bg-[#443E8D]/10 text-[#443E8D] font-black text-xs flex items-center justify-center shrink-0 mt-0.5 border border-[#443E8D]/20">
                        {{ qIdx + 1 }}
                      </span>
                      <h3 class="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                        {{ q.question }}
                      </h3>
                    </div>

                    <!-- Option Choices -->
                    <div class="grid grid-cols-1 gap-2.5">
                      <button
                        v-for="(opt, optIdx) in q.options"
                        :key="optIdx"
                        type="button"
                        class="p-4 rounded-2xl border text-left flex items-center gap-3.5 transition-all text-sm font-medium"
                        :class="getOptionClass(q, optIdx)"
                        :disabled="quizSubmitted"
                        @click="selectAnswer(q.id, optIdx)"
                      >
                        <span
                          class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors border"
                          :class="getOptionBadgeClass(q, optIdx)"
                        >
                          {{ ['A', 'B', 'C', 'D', 'E', 'F'][optIdx] || (optIdx + 1) }}
                        </span>
                        <span class="flex-1 min-w-0">{{ opt }}</span>

                        <!-- Post-submit Indicators -->
                        <span v-if="quizSubmitted && isOptionCorrect(q, optIdx)" class="text-xs font-bold text-emerald-600 flex items-center gap-1 shrink-0">
                          <CheckCircleIcon class="w-4 h-4 stroke-[2.5]" /> Benar
                        </span>
                        <span v-else-if="quizSubmitted && selectedAnswers[q.id] === optIdx && !isOptionCorrect(q, optIdx)" class="text-xs font-bold text-rose-600 flex items-center gap-1 shrink-0">
                          <XMarkIcon class="w-4 h-4 stroke-[2.5]" /> Salah
                        </span>
                      </button>
                    </div>

                    <!-- Explanation (shown after quiz is submitted) -->
                    <div
                      v-if="quizSubmitted && q.explanation"
                      class="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-3"
                    >
                      <span class="text-lg shrink-0">💡</span>
                      <div class="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        <strong class="font-bold text-[#443E8D] block mb-0.5">Penjelasan:</strong>
                        {{ q.explanation }}
                      </div>
                    </div>
                  </div>

                  <!-- Submit Quiz Action -->
                  <div v-if="!quizSubmitted" class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
                    <p class="text-xs sm:text-sm text-gray-500">
                      Terjawab <strong class="text-gray-900">{{ answeredCount }}</strong> dari {{ quizQuestions.length }} soal
                    </p>
                    <button
                      type="button"
                      class="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#443E8D] text-white font-bold text-sm shadow-lg shadow-indigo-200/60 hover:bg-[#363175] hover:shadow-indigo-300/80 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                      :disabled="!allQuestionsAnswered"
                      @click="submitQuiz"
                    >
                      Kirim Jawaban Kuis
                    </button>
                  </div>
                </div>

                <!-- Empty Quiz Fallback -->
                <div v-else class="p-12 bg-white rounded-3xl border border-gray-200 text-center flex flex-col items-center gap-4">
                  <AcademicCapIcon class="w-10 h-10 text-gray-300" />
                  <div>
                    <h3 class="text-lg font-bold text-gray-800">Kuis Belum Tersedia</h3>
                    <p class="text-sm text-gray-400 mt-1">Soal kuis untuk materi ini belum ditambahkan oleh mentor.</p>
                  </div>
                </div>
              </div>

              <!-- Empty Content -->
              <div v-else-if="!isLessonLoading && currentLesson.type !== 'video' && parsedLessonContent.length === 0" class="flex flex-col items-center justify-center py-20 text-center gap-4">
                <div class="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                  <DocumentTextIcon class="w-8 h-8 text-gray-300" />
                </div>
                <div>
                  <h3 class="text-lg font-bold text-gray-700">Konten Kosong</h3>
                  <p class="text-sm text-gray-400 mt-1">Mentor belum menambahkan isi materi untuk pelajaran ini.</p>
                </div>
              </div>

              <!-- Footer Navigation -->
              <div class="flex items-center justify-between pt-10 border-t border-gray-100 mt-auto">
                <button
                  class="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:border-[#443E8D] hover:text-[#443E8D] transition-all disabled:opacity-30 disabled:pointer-events-none group"
                  :disabled="currentLessonIdx === 0"
                  @click="prevLesson"
                >
                  <ArrowLeftIcon class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Sebelumnya
                </button>

                <button
                  class="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md group"
                  :class="isDone
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default opacity-80'
                    : 'bg-[#443E8D] text-white hover:bg-[#363175] cursor-pointer shadow-indigo-200'"
                  :disabled="isDone"
                  @click="markDone"
                >
                  <CheckCircleIcon class="w-4 h-4" />
                  {{ isDone ? 'Sudah Selesai ✓' : 'Tandai Selesai' }}
                </button>

                <button
                  class="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:border-[#443E8D] hover:text-[#443E8D] transition-all disabled:opacity-30 disabled:pointer-events-none group"
                  :disabled="currentLessonIdx >= moduleData.module_lessons.length - 1"
                  @click="nextLesson"
                >
                  Berikutnya
                  <ArrowRightIcon class="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </template>
          </div>
        </main>

        <!-- Sidebar Navigation -->
        <aside class="hidden xl:flex w-80 flex-shrink-0 bg-white border-l border-gray-200 flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-10 relative">
          <div class="p-6 border-b border-gray-100">
            <h3 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Daftar Pelajaran</h3>
            <p class="text-[0.8125rem] font-bold text-gray-800 mt-2 truncate leading-tight">{{ moduleData.title }}</p>
          </div>
          <nav class="flex-1 overflow-y-auto p-4 flex flex-col gap-1 custom-scrollbar">
            <button
              v-for="(lesson, idx) in moduleData.module_lessons"
              :key="lesson.id"
              class="group flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 text-left relative overflow-hidden"
              :class="currentLessonIdx === idx
                ? 'bg-indigo-50/60 border border-indigo-100 ring-1 ring-indigo-50'
                : 'hover:bg-gray-50 border border-transparent'"
              @click="goToLesson(idx)"
            >
              <div v-if="currentLessonIdx === idx" class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#443E8D] rounded-r-full"></div>
              
              <div class="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center transition-colors shadow-sm"
                :class="doneSet.has(lesson.id)
                  ? 'bg-emerald-100 text-emerald-600'
                  : currentLessonIdx === idx
                    ? 'bg-[#443E8D] text-white shadow-md shadow-indigo-200'
                    : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'"
              >
                <CheckCircleIcon v-if="doneSet.has(lesson.id)" class="w-4 h-4 stroke-[2.5]" />
                <span v-else class="text-xs font-black">{{ idx + 1 }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[0.875rem] font-bold leading-tight truncate transition-colors"
                  :class="currentLessonIdx === idx ? 'text-[#443E8D]' : 'text-gray-700 group-hover:text-gray-900'">
                  {{ lesson.title }}
                </p>
                <div class="flex items-center gap-1.5 mt-1">
                  <component :is="lessonTypeIcon(lesson.type)" class="w-3 h-3 text-gray-400" :class="{ 'text-indigo-300': currentLessonIdx === idx }" />
                  <span class="text-[0.625rem] font-bold text-gray-400 uppercase tracking-widest" :class="{ 'text-indigo-400': currentLessonIdx === idx }">{{ lessonTypeLabel(lesson.type) }}</span>
                </div>
              </div>
              <ChevronRightIcon class="w-4 h-4 text-gray-300 transition-transform group-hover:translate-x-1"
                :class="{ 'text-[#443E8D]': currentLessonIdx === idx }" />
            </button>
          </nav>
        </aside>
      </div>
    </div>

    <!-- Mobile overlay -->
    <div v-if="sidebarOpen" class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[150] min-[901px]:hidden" @click="sidebarOpen = false"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import StudentSidebar from '~/components/student/StudentSidebar.vue'
import {
  ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, ChevronRightIcon,
  DocumentTextIcon, VideoCameraIcon, AcademicCapIcon, ClipboardDocumentListIcon,
  Bars3Icon, ExclamationCircleIcon, PresentationChartLineIcon,
  XMarkIcon, ArrowPathIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const slug = computed(() => route.params.slug as string)

useSeoMeta({ title: 'Class Module — Pixelnoid Academy' })
definePageMeta({ layout: 'dashboard' })

const supabase = useSupabaseClient()
const sidebarOpen = ref(false)

// ── Types ─────────────────────────────────────────────────────
interface LessonMeta {
  id: number
  title: string
  slug: string
  type: string
  sort_order: number
  video_url?: string | null
  xp_reward?: number | null
  progress_status?: string
}

interface LessonDetail {
  id: number
  title: string
  slug: string
  type: string
  video_url: string | null
  xp_reward?: number | null
  content: ContentBlock[] | string | null
  progress_status?: string
}

interface ContentBlock {
  id?: string
  type: string
  content?: string
  url?: string
  caption?: string
  items?: string[]
}

interface QuizQuestion {
  id: string | number
  question: string
  options: string[]
  correct_answer: number | string
  explanation?: string
}

interface ModuleData {
  id: number
  title: string
  slug: string
  description: string | null
  xp_reward: number | null
  estimated_minutes: number | null
  class_id: number
  module_lessons: LessonMeta[]
}

// ── State ─────────────────────────────────────────────────────
const moduleData = ref<ModuleData | null>(null)
const lessonDetail = ref<LessonDetail | null>(null)
const isLoading = ref(true)
const isLessonLoading = ref(false)
const errorMsg = ref('')
const currentLessonIdx = ref(0)
const doneSet = ref(new Set<number>())
const copiedIdx = ref<number | null>(null)

// ── Quiz State ────────────────────────────────────────────────
const selectedAnswers = ref<Record<string | number, number>>({})
const quizSubmitted = ref(false)

// ── Computed ──────────────────────────────────────────────────
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
    try {
      raw = JSON.parse(raw)
    } catch (e) {
      console.error('Failed to parse lesson content JSON:', e)
      return []
    }
  }
  return Array.isArray(raw) ? raw : []
})

// ── Quiz Computed ─────────────────────────────────────────────
const quizQuestions = computed<QuizQuestion[]>(() => {
  if (currentLesson.value?.type !== 'quiz') return []
  const content = parsedLessonContent.value
  if (!Array.isArray(content)) return []
  return content.filter((item: any) => item && item.question && Array.isArray(item.options)) as QuizQuestion[]
})

const answeredCount = computed(() => {
  return quizQuestions.value.filter(q => selectedAnswers.value[q.id] !== undefined).length
})

const allQuestionsAnswered = computed(() => {
  return quizQuestions.value.length > 0 && answeredCount.value === quizQuestions.value.length
})

const quizScore = computed(() => {
  if (quizQuestions.value.length === 0) return { correct: 0, total: 0, percentage: 0 }
  let correct = 0
  for (const q of quizQuestions.value) {
    const chosen = selectedAnswers.value[q.id]
    if (chosen !== undefined && isOptionCorrect(q, chosen)) {
      correct++
    }
  }
  const total = quizQuestions.value.length
  const percentage = Math.round((correct / total) * 100)
  return { correct, total, percentage }
})

// ── Helpers ───────────────────────────────────────────────────
function lessonTypeIcon(type: string) {
  const map: Record<string, any> = {
    video: VideoCameraIcon,
    text: DocumentTextIcon,
    quiz: AcademicCapIcon,
    task: ClipboardDocumentListIcon,
  }
  return map[type] ?? DocumentTextIcon
}

function lessonTypeLabel(type: string) {
  const map: Record<string, string> = {
    video: 'Video', text: 'Materi', quiz: 'Quiz', task: 'Tugas'
  }
  return map[type] ?? type
}

function lessonTypeStyle(type: string) {
  const map: Record<string, string> = {
    video: 'bg-rose-50 text-rose-600 border-rose-100',
    text: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    quiz: 'bg-amber-50 text-amber-700 border-amber-100',
    task: 'bg-blue-50 text-blue-700 border-blue-100',
  }
  return map[type] ?? 'bg-gray-50 text-gray-600 border-gray-100'
}

function getEmbedUrl(url: string): string {
  if (!url) return ''
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0&modestbranding=1&showinfo=0`
  return url
}

function extractYouTubeId(url: string) {
  if (!url) return null
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s?/]+)/)
  return yt ? yt[1] : null
}

function isImageBlock(block: ContentBlock): boolean {
  if (!block) return false
  if (block.type === 'image') return true
  if (block.type === 'paragraph' && typeof block.content === 'string') {
    const trimmed = block.content.trim()
    return (
      /^\[Image:\s*(.+?)\]$/i.test(trimmed) ||
      /^!\[.*?\]\((.+?)\)$/i.test(trimmed) ||
      /^https?:\/\/\S+\.(?:png|jpe?g|gif|webp|svg|bmp)(\?\S*)?$/i.test(trimmed)
    )
  }
  return false
}

function getImageUrl(block: ContentBlock): string {
  if (!block) return ''
  let raw = ''
  if (block.type === 'image') {
    raw = block.content || block.url || ''
  } else if (typeof block.content === 'string') {
    const trimmed = block.content.trim()
    const imgMatch = trimmed.match(/^\[Image:\s*(.+?)\]$/i)
    if (imgMatch) {
      raw = imgMatch[1]
    } else {
      const mdMatch = trimmed.match(/^!\[.*?\]\((.+?)\)$/i)
      if (mdMatch) {
        raw = mdMatch[1]
      } else {
        raw = trimmed
      }
    }
  }
  // Decode HTML entities (e.g. &amp; -> &)
  return raw.replace(/&amp;/g, '&').trim()
}

let ytPlayer: any = null
const videoIframe = ref<HTMLElement | null>(null)

async function markLessonCompleted(lessonId: number) {
  if (!lessonId) return
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      console.warn('no session')
      return
    }
    await $fetch('/api/student/lessons/update-progress', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: { lesson_id: lessonId, status: 'completed' }
    })
  } catch (e) {
    console.error('mark completed error', e)
  }
}

function initYouTubePlayer(url: string) {
  const vid = extractYouTubeId(url)
  if (!vid) return

  // Load API if needed
  if ((window as any).YT && (window as any).YT.Player) {
    createYT()
  } else {
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    document.head.appendChild(script)
    ;(window as any).onYouTubeIframeAPIReady = createYT
  }

  function createYT() {
    // If iframe has id set to yt-<lessonId>
    nextTick(() => {
      const el = document.getElementById('yt-' + (lessonDetail.value?.id ?? ''))
      if (!el) return
      try {
        ytPlayer = new (window as any).YT.Player(el, {
          events: {
            onStateChange: (e: any) => {
              // 0 === ended
              if (e.data === 0) {
                // mark completed when video ends
                if (currentLesson.value) markLessonCompleted(currentLesson.value.id)
              }
            }
          }
        })
      } catch (err) {
        // ignore
      }
    })
  }
}

async function copyCode(content: string | undefined, idx: number) {
  if (!content) return
  try {
    await navigator.clipboard.writeText(content)
    copiedIdx.value = idx
    setTimeout(() => { copiedIdx.value = null }, 2000)
  } catch {}
}

// ── Fetch module ─────────────────────────────────────────
async function fetchModule() {
  isLoading.value = true
  errorMsg.value = ''
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) {
      errorMsg.value = 'Sesi tidak ditemukan. Silakan login ulang.'
      return
    }

    const data = await $fetch<{ module: ModuleData }>(`/api/student/modules/${slug.value}`, {
      headers: { Authorization: `Bearer ${session.access_token}` }
    })
      moduleData.value = data.module

    // Load progress status from server data
    const completedLessons = (data.module.module_lessons || [])
      .filter((lesson: LessonMeta) => lesson.progress_status === 'completed')
      .map((lesson: LessonMeta) => lesson.id)
    doneSet.value = new Set(completedLessons)

    // Auto-load first lesson
    const firstLessonId = Number(data?.module?.module_lessons?.[0]?.id ?? 0)
    if (firstLessonId > 0) {
      await fetchLessonDetail(firstLessonId)
    }

    useSeoMeta({ title: `${data.module.title} — Pixelnoid Academy` })
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage || e?.message || 'Gagal memuat modul.'
  } finally {
    isLoading.value = false
  }
}

// ── Fetch lesson detail ──────────────────────────────────
async function fetchLessonDetail(lessonId: number) {
  isLessonLoading.value = true
  lessonDetail.value = null
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return

    const data = await $fetch<{ lesson: LessonDetail }>(`/api/student/lessons/${lessonId}`, {
      headers: { Authorization: `Bearer ${session.access_token}` }
    })
    lessonDetail.value = data.lesson
    if (typeof lessonDetail.value?.content === 'string') {
      try {
        lessonDetail.value.content = JSON.parse(lessonDetail.value.content)
      } catch (e) {
        console.error('Failed to parse lesson content JSON:', e)
      }
    }

    // Update doneSet sesuai status dari DB
    if (lessonDetail.value.progress_status === 'completed') {
      doneSet.value.add(lessonDetail.value.id)
    }
    // Jangan hapus dari doneSet — biarkan status dari fetchModule tetap valid

    // init youtube player to detect end events
    if (lessonDetail.value.type === 'video' && lessonDetail.value.video_url) {
      initYouTubePlayer(lessonDetail.value.video_url)
    }
  } catch (e) {
    console.error('Error fetching lesson:', e)
  } finally {
    isLessonLoading.value = false
  }
}

// ── Quiz Methods ──────────────────────────────────────────────
function isOptionCorrect(q: QuizQuestion, optIdx: number): boolean {
  if (typeof q.correct_answer === 'number') {
    return q.correct_answer === optIdx
  }
  if (typeof q.correct_answer === 'string') {
    const num = parseInt(q.correct_answer, 10)
    if (!isNaN(num) && num === optIdx) return true
    return q.options[optIdx] === q.correct_answer
  }
  return false
}

function getOptionClass(q: QuizQuestion, optIdx: number): string {
  const isSelected = selectedAnswers.value[q.id] === optIdx
  if (!quizSubmitted.value) {
    if (isSelected) {
      return 'bg-indigo-50/90 border-[#443E8D] ring-2 ring-[#443E8D]/20 text-[#443E8D] font-semibold cursor-pointer'
    }
    return 'bg-gray-50/60 border-gray-200/80 text-gray-700 hover:bg-gray-100/80 hover:border-gray-300 cursor-pointer'
  }

  const correct = isOptionCorrect(q, optIdx)
  if (correct) {
    return 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold cursor-default'
  }
  if (isSelected && !correct) {
    return 'bg-rose-50 border-rose-500 text-rose-950 font-semibold cursor-default'
  }
  return 'bg-gray-50/40 border-gray-100 text-gray-400 cursor-default opacity-50'
}

function getOptionBadgeClass(q: QuizQuestion, optIdx: number): string {
  const isSelected = selectedAnswers.value[q.id] === optIdx
  if (!quizSubmitted.value) {
    if (isSelected) {
      return 'bg-[#443E8D] text-white border-[#443E8D]'
    }
    return 'bg-white text-gray-500 border-gray-200'
  }

  const correct = isOptionCorrect(q, optIdx)
  if (correct) {
    return 'bg-emerald-600 text-white border-emerald-600'
  }
  if (isSelected && !correct) {
    return 'bg-rose-600 text-white border-rose-600'
  }
  return 'bg-gray-100 text-gray-400 border-gray-200'
}

function selectAnswer(questionId: string | number, optIdx: number) {
  if (quizSubmitted.value) return
  selectedAnswers.value[questionId] = optIdx
}

function submitQuiz() {
  if (!allQuestionsAnswered.value) return
  quizSubmitted.value = true

  // Auto mark complete jika belum complete
  if (currentLesson.value && !isDone.value) {
    markDone()
  }
}

function retryQuiz() {
  selectedAnswers.value = {}
  quizSubmitted.value = false
}

// Reset quiz saat berganti lesson
watch(() => currentLesson.value?.id, () => {
  retryQuiz()
})

// ── Navigation ────────────────────────────────────────────────
async function goToLesson(idx: number) {
  currentLessonIdx.value = idx
  if (moduleData.value?.module_lessons[idx]) {
    await fetchLessonDetail(moduleData.value.module_lessons[idx].id)
  }
}

function prevLesson() {
  if (currentLessonIdx.value > 0) goToLesson(currentLessonIdx.value - 1)
}

function nextLesson() {
  if (moduleData.value && currentLessonIdx.value < moduleData.value.module_lessons.length - 1) {
    goToLesson(currentLessonIdx.value + 1)
  }
}

async function markDone() {
  if (!currentLesson.value || !moduleData.value || isDone.value) return
  const id = currentLesson.value.id
  try {
    await markLessonCompleted(id)
    doneSet.value.add(id)

    // Update class progress setelah selesai
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token && moduleData.value?.class_id) {
        await $fetch('/api/student/class-progress', {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.access_token}` },
          body: { class_id: moduleData.value.class_id }
        })
      }
    } catch (e) {
      console.error('[markDone] update progress error:', e)
    }

    // Auto-advance ke lesson berikutnya
    if (currentLessonIdx.value < moduleData.value.module_lessons.length - 1) {
      setTimeout(() => nextLesson(), 500)
    }
  } catch (e) {
    console.error('markDone error', e)
  }
}

onMounted(fetchModule)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.05); border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); }

.notion-body h2 + p,
.notion-body h3 + p {
  margin-top: 0;
}
</style>
