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
          <div class="flex items-center gap-2 mb-[0.15rem]">
            <span class="inline-flex items-center gap-[0.35rem] px-[0.45rem] py-[0.15rem] rounded-[5px] bg-[#F4F4F5] text-[0.6rem] font-bold tracking-[0.02em] uppercase text-[#52525B]">
              <ChartBarIcon class="w-3 h-3" />
              Skill Report
            </span>
          </div>
          <h1 class="text-[1.15rem] font-bold text-[#18181B] m-0 tracking-[-0.02em]">
            Perkembangan & Pertumbuhan Skill
          </h1>
        </div>

        <div class="flex-shrink-0 flex flex-col items-end gap-[0.15rem]">
          <span class="text-[0.65rem] font-bold uppercase tracking-[0.02em] text-[#A1A1AA]">Skor Kamu</span>
          <span class="text-[1.25rem] font-black leading-none tracking-[-0.02em]" :class="overallScore < targetScore ? 'text-[#E11D48]' : 'text-[#18181B]'">{{ overallScore }}%</span>
        </div>
      </header>

      <!-- ── MAIN CONTENT ── -->
      <main class="py-8 px-10 max-[900px]:p-6 flex flex-col gap-7 max-w-[1280px] mx-auto w-full">

        <!-- ① OVERALL PROGRESS — Level, XP, Streak -->
        <section class="relative overflow-hidden rounded-2xl bg-white border border-[rgba(228,228,231,0.6)] shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)] p-8 lg:p-10 transition-all duration-300">
          <!-- Subtle decorative shape -->
          <div class="pointer-events-none absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#F4F4F5] blur-[40px]"></div>

          <div class="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-12">
            <!-- Circle Score -->
            <div class="relative w-24 h-24 flex-shrink-0">
              <svg class="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="none" class="stroke-[#E4E4E7]" stroke-width="9" />
                <circle cx="50" cy="50" r="44" fill="none" class="stroke-[#3F3F46] transition-all duration-1000 ease-out" stroke-width="9" stroke-linecap="round" :stroke-dasharray="`${overallScore * 2.7646} ${276.46 - overallScore * 2.7646}`" />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-[1.5rem] font-black text-[#18181B] tracking-[-0.02em]">{{ overallScore }}%</span>
              </div>
            </div>

            <!-- Level & Program Info -->
            <div class="flex flex-col gap-[0.45rem] flex-1">
              <span class="text-[0.65rem] font-bold uppercase tracking-[0.02em] text-[#71717A]">Program Aktif</span>
              <div class="flex items-center gap-3 flex-wrap">
                <h2 class="text-[1.25rem] font-bold text-[#18181B] tracking-[-0.01em] m-0">Pixelnoid Academy</h2>
                <span class="inline-flex items-center gap-1.5 px-[0.6rem] py-[0.2rem] rounded-[6px] bg-[#FAFAFC] border border-[#E4E4E7] text-[0.7rem] font-bold text-[#3F3F46]">
                  <BoltIcon class="w-3.5 h-3.5 text-[#3F3F46]" />
                  {{ currentLevel }}
                </span>
                <div class="w-2 h-2 rounded-full bg-[#3F3F46] animate-pulse"></div>
              </div>
              <!-- XP Bar -->
              <div class="flex items-center gap-3 mt-1">
                <span class="text-[0.65rem] font-bold text-[#71717A] uppercase tracking-[0.02em] whitespace-nowrap">XP {{ currentXP }} / {{ nextLevelXP }}</span>
                <div class="flex-1 h-[6px] bg-[#E4E4E7] rounded-[6px] overflow-hidden">
                  <div class="h-full bg-[#3F3F46] rounded-[6px] transition-all duration-1000" :style="{ width: `${xpPercent}%` }"></div>
                </div>
                <span class="text-[0.65rem] font-bold text-[#3F3F46] uppercase tracking-[0.02em] whitespace-nowrap">Next: {{ nextLevelName }}</span>
              </div>
            </div>

            <!-- Stats: Monthly Target, Ranking, Streak -->
            <div class="grid grid-cols-3 gap-6 lg:gap-10 lg:border-l border-[#F4F4F5] lg:pl-10">
              <div class="flex flex-col gap-1 items-center">
                <span class="text-[0.65rem] font-bold text-[#71717A] uppercase tracking-[0.02em] text-center">Target Bulan Ini</span>
                <span class="text-[1.25rem] font-black text-[#18181B] tracking-[-0.02em]">{{ targetScore }}%</span>
              </div>
              <div class="flex flex-col gap-1 items-center">
                <span class="text-[0.65rem] font-bold text-[#71717A] uppercase tracking-[0.02em] text-center">Peringkat Kohort</span>
                <span class="text-[1.25rem] font-black text-[#18181B] tracking-[-0.02em]">Top {{ topPercentile }}%</span>
              </div>
              <div class="flex flex-col gap-1 items-center">
                <span class="text-[0.65rem] font-bold text-[#71717A] uppercase tracking-[0.02em] text-center">Weekly Streak</span>
                <span class="text-[1.25rem] font-black text-[#18181B] tracking-[-0.02em] flex items-center gap-1">
                  <FireIcon class="w-5 h-5 text-[#3F3F46]" />{{ weeklyStreak }}
                </span>
              </div>
            </div>
          </div>

          <!-- Learning Pace Indicator -->
          <div class="relative z-10 mt-8 flex flex-wrap items-center gap-3 pt-5 border-t border-[#F4F4F5]">
            <span class="text-[0.65rem] font-bold uppercase tracking-[0.02em] text-[#71717A]">Learning Style:</span>
            <span class="inline-flex items-center gap-1.5 px-[0.6rem] py-[0.2rem] rounded-[6px] bg-[#FAFAFC] border border-[#E4E4E7] text-[0.7rem] font-bold text-[#3F3F46]">
              <BoltIcon class="w-3.5 h-3.5" />
              {{ learningPace }}
            </span>
            <span class="text-[0.75rem] text-[#A1A1AA] font-medium">· {{ learningPaceDescription }}</span>
          </div>
        </section>

        <!-- ② METRICS GRID: Completion, Code Review, Time Discipline -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          <!-- Completion Rate -->
          <div class="bg-white p-6 rounded-2xl border border-[rgba(228,228,231,0.6)] shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col gap-6 group hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5 text-[0.8rem] font-bold text-[#18181B] tracking-[-0.01em]">
                <CheckBadgeIcon class="w-5 h-5 text-[#3F3F46]" />
                Progres Modul
              </div>
              <span class="px-[0.6rem] py-[0.2rem] rounded-[6px] bg-[#FAFAFC] text-[#3F3F46] text-[0.7rem] font-bold border border-[#E4E4E7]">{{ projectCompletion }}%</span>
            </div>
            <div class="flex flex-col gap-5">
              <p class="text-[0.8rem] text-[#71717A] font-medium leading-[1.5] m-0">
                <strong class="text-[#18181B] font-bold">{{ completedProjects }} dari {{ totalProjects }} brief</strong> sudah kamu selesaikan — progresmu nyata dan terus berkembang. 🚀
              </p>
              <div class="w-full h-[6px] bg-[#E4E4E7] rounded-[6px] overflow-hidden">
                <div class="h-full bg-[#3F3F46] rounded-[6px] transition-all duration-1000" :style="{ width: `${projectCompletion}%` }"></div>
              </div>
              <div class="flex justify-between text-[0.65rem] font-bold text-[#A1A1AA] uppercase tracking-[0.02em]">
                <span>Mulai</span>
                <span>{{ completedProjects }}/{{ totalProjects }} Brief</span>
                <span>Selesai</span>
              </div>
            </div>
          </div>

          <!-- Feedback Score -->
          <div class="bg-white p-6 rounded-2xl border border-[rgba(228,228,231,0.6)] shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col gap-6 group hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5 text-[0.8rem] font-bold text-[#18181B] tracking-[-0.01em]">
                <StarIcon class="w-5 h-5 text-[#3F3F46]" />
                Code Review Rating
              </div>
              <span class="px-[0.6rem] py-[0.2rem] rounded-[6px] bg-[#FAFAFC] text-[#3F3F46] text-[0.7rem] font-bold border border-[#E4E4E7]">{{ feedbackScore }}/5.0</span>
            </div>
            <div class="flex flex-col gap-5">
              <p class="text-[0.8rem] text-[#71717A] font-medium leading-[1.5] m-0">
                Rating kumulatif dari Senior Mentor. Kamu berada di <strong class="text-[#18181B] font-bold">Top {{ topPercentile }}%</strong> kohort angkatan ini — pencapaian luar biasa!
              </p>
              <div class="flex items-center gap-1.5 p-3 rounded-[10px] bg-[#FAFAFC] border border-[#E4E4E7]">
                <div class="flex items-center gap-1">
                  <StarIcon v-for="i in 5" :key="i" class="w-5 h-5" :class="i <= Math.round(feedbackScore) ? 'text-[#3F3F46] fill-[#3F3F46]' : 'text-[#E4E4E7] fill-[#F4F4F5]'" />
                </div>
                <span class="ml-auto text-[0.75rem] font-bold" :class="feedbackTrend > 0 ? 'text-[#3F3F46]' : 'text-[#71717A]'">
                  {{ feedbackTrend > 0 ? '▲' : '▼' }} {{ Math.abs(feedbackTrend) }} pts
                </span>
              </div>
            </div>
          </div>

          <!-- Time Discipline -->
          <div class="bg-white p-6 rounded-2xl border border-[rgba(228,228,231,0.6)] shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col gap-6 group hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5 text-[0.8rem] font-bold text-[#18181B] tracking-[-0.01em]">
                <ClockIcon class="w-5 h-5 text-[#3F3F46]" />
                Time Discipline
              </div>
              <span class="px-[0.6rem] py-[0.2rem] rounded-[6px] text-[0.7rem] font-bold border" :class="(deadlineLate + deadlineMissed) > 0 ? 'bg-[#FAFAFC] text-[#3F3F46] border-[#E4E4E7]' : 'bg-[#FAFAFC] text-[#3F3F46] border-[#E4E4E7]'">
                {{ Math.round((deadlineOnTime / totalTasks) * 100) }}% Tepat Waktu
              </span>
            </div>
            <div class="flex flex-col gap-5">
              <div class="grid grid-cols-3 gap-3">
                <div v-for="d in [
                  { label: 'On Time', val: deadlineOnTime, color: 'text-[#18181B]' },
                  { label: 'Terlambat', val: deadlineLate, color: 'text-[#71717A]' },
                  { label: 'Terlewat', val: deadlineMissed, color: 'text-[#A1A1AA]' }
                ]" :key="d.label" class="flex flex-col items-center bg-[#FAFAFC] rounded-[10px] py-[0.65rem] border border-[#E4E4E7]">
                  <span class="text-[1.1rem] font-black leading-none mb-1" :class="d.color">{{ d.val }}</span>
                  <span class="text-[0.6rem] font-bold text-[#A1A1AA] uppercase tracking-[0.02em]">{{ d.label }}</span>
                </div>
              </div>
              <div class="w-full h-[6px] bg-[#E4E4E7] rounded-[6px] flex overflow-hidden">
                <div class="h-full bg-[#3F3F46]" :style="{ width: `${(deadlineOnTime/totalTasks)*100}%` }"></div>
                <div class="h-full bg-[#A1A1AA]" :style="{ width: `${(deadlineLate/totalTasks)*100}%` }"></div>
                <div class="h-full bg-[#D4D4D8]" :style="{ width: `${(deadlineMissed/totalTasks)*100}%` }"></div>
              </div>
              <div class="p-3 rounded-[10px] border flex items-center gap-3" :class="(deadlineLate + deadlineMissed) > 0 ? 'bg-[#FAFAFC] border-[#E4E4E7] text-[#18181B]' : 'bg-[#FAFAFC] border-[#E4E4E7] text-[#18181B]'">
                <div class="w-7 h-7 rounded-[8px] flex items-center justify-center bg-white border border-[#E4E4E7] flex-shrink-0">
                  <ExclamationTriangleIcon v-if="(deadlineLate + deadlineMissed) > 0" class="w-4 h-4 text-[#71717A]" />
                  <FireIcon v-else class="w-4 h-4 text-[#3F3F46]" />
                </div>
                <p class="text-[0.7rem] font-medium leading-[1.4] m-0">
                  {{ (deadlineLate + deadlineMissed) > 0 ? `Masih ada ruang untuk tumbuh — ${deadlineLate + deadlineMissed} brief bisa jadi pengalaman.` : 'Konsistensimu luar biasa! Kamu selalu tepat waktu.' }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- ③ SKILL BREAKDOWN + PROGRESS DELTA -->
        <div class="bg-white rounded-2xl border border-[rgba(228,228,231,0.6)] shadow-[0_1px_3px_rgba(0,0,0,0.01)] overflow-hidden flex flex-col lg:flex-row min-h-[480px]">
          <div class="flex-1 flex flex-col">
            <div class="p-6 border-b border-[#F4F4F5] flex items-center justify-between">
              <div class="flex items-center gap-2.5 text-[0.85rem] font-bold text-[#18181B] tracking-[-0.01em]">
                <PresentationChartLineIcon class="w-5 h-5 text-[#3F3F46]" />
                Pertumbuhan Skill
              </div>
              <span class="text-[0.65rem] font-bold text-[#A1A1AA] uppercase tracking-[0.02em] hidden sm:block">Update: {{ new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) }}</span>
            </div>

            <div class="p-8 flex flex-col gap-8">
              <div v-for="skill in skills" :key="skill.name" class="flex flex-col gap-3">
                <div class="flex items-center justify-between">
                  <div class="flex flex-col gap-[0.15rem]">
                    <span class="text-[0.85rem] font-bold text-[#18181B] tracking-[-0.01em] leading-none">{{ skill.name }}</span>
                    <span class="text-[0.65rem] font-bold uppercase tracking-[0.02em]" :class="skill.growth >= 0 ? 'text-[#3F3F46]' : 'text-[#71717A]'">
                      {{ skill.growth >= 0 ? `↑ +${skill.growth}% minggu ini` : `↓ ${skill.growth}% — tetap semangat!` }}
                    </span>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="flex flex-col items-end">
                      <span class="text-[0.6rem] font-bold text-[#A1A1AA] uppercase tracking-[0.02em] leading-none mb-1">Bulan Lalu</span>
                      <span class="text-[0.8rem] font-bold text-[#A1A1AA] leading-none">{{ skill.pastScore }}%</span>
                    </div>
                    <div class="w-px h-6 bg-[#E4E4E7]"></div>
                    <div class="flex flex-col items-end">
                      <span class="text-[0.6rem] font-bold text-[#71717A] uppercase tracking-[0.02em] leading-none mb-1">Bulan Ini</span>
                      <span class="text-[1rem] font-black text-[#18181B] leading-none tracking-[-0.01em]">{{ skill.score }}%</span>
                    </div>
                  </div>
                </div>
                <div class="relative h-[6px] bg-[#F4F4F5] rounded-[6px] border border-[#E4E4E7] overflow-hidden group/track">
                  <!-- Past Score Layer -->
                  <div class="absolute left-0 top-0 bottom-0 bg-[#D4D4D8] transition-all duration-1000 z-10" :style="{ width: `${skill.pastScore}%` }"></div>
                  <!-- Current Score Layer -->
                  <div class="absolute left-0 top-0 bottom-0 rounded-[6px] transition-all duration-1000 z-20" :class="getSkillColor(skill.score)" :style="{ width: `${skill.score}%` }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar: Focus Development + Legend -->
          <div class="lg:w-80 bg-[#FAFAFC] border-l border-[#F4F4F5] p-6 flex flex-col gap-8">
            <div class="bg-white rounded-2xl p-6 border border-[#E4E4E7] shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col gap-6 relative overflow-hidden group">
              <div class="relative z-10 space-y-5">
                <div class="w-12 h-12 rounded-[10px] bg-[#F4F4F5] flex items-center justify-center text-[#3F3F46] border border-[#E4E4E7]">
                  <AcademicCapIcon class="w-6 h-6" />
                </div>
                <div class="space-y-2">
                  <h4 class="text-[0.95rem] font-bold text-[#18181B] tracking-[-0.01em] leading-snug m-0">Fokus Pengembangan</h4>
                  <p class="text-[0.75rem] text-[#71717A] font-medium leading-[1.5] m-0">
                    Kamu punya peluang tumbuh di <span class="text-[#18181B] font-bold">{{ lowestSkill.name }}</span> ({{ lowestSkill.score }}%). Ini bukan kelemahan — ini kesempatan untuk naik level.
                  </p>
                </div>
                <NuxtLink to="/student/mentorship" class="group inline-flex items-center justify-center gap-2 w-full py-[0.65rem] rounded-[8px] bg-[#18181B] text-white text-[0.75rem] font-bold hover:bg-[#3F3F46] transition-all">
                  Sesi 1:1 dengan Mentor
                  <ArrowRightIcon class="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </NuxtLink>
              </div>
            </div>

            <div class="flex flex-col gap-3 mt-auto">
              <h5 class="text-[0.65rem] font-bold uppercase tracking-[0.02em] text-[#71717A] m-0">Keterangan Visual</h5>
              <div class="space-y-3 bg-white p-4 rounded-[10px] border border-[#E4E4E7]">
                <div class="flex items-center gap-3 text-[0.65rem] font-bold text-[#71717A] uppercase tracking-[0.02em]">
                  <div class="w-3 h-3 rounded-[3px] bg-[#3F3F46]"></div>
                  Skor Bulan Ini
                </div>
                <div class="flex items-center gap-3 text-[0.65rem] font-bold text-[#71717A] uppercase tracking-[0.02em]">
                  <div class="w-3 h-3 rounded-[3px] bg-[#D4D4D8]"></div>
                  Skor Bulan Lalu
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ④ STRENGTH & FOCUS AREA -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-7">
          <!-- Strength -->
          <div class="bg-white rounded-2xl border border-[rgba(228,228,231,0.6)] shadow-[0_1px_3px_rgba(0,0,0,0.01)] p-6 flex flex-col gap-6 group hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-[10px] bg-[#FAFAFC] border border-[#E4E4E7] flex items-center justify-center">
                <TrophyIcon class="w-5 h-5 text-[#3F3F46]" />
              </div>
              <div class="flex flex-col gap-[0.1rem]">
                <h3 class="text-[0.8rem] font-bold text-[#18181B] uppercase tracking-[0.02em] m-0">Kekuatan Kamu</h3>
                <p class="text-[0.7rem] text-[#A1A1AA] font-medium m-0">Yang membuat kamu unggul</p>
              </div>
            </div>
            <div class="flex flex-col gap-3">
              <div v-for="strength in strengths" :key="strength" class="flex items-center gap-3 p-3 rounded-[10px] bg-[#FAFAFC] border border-[#E4E4E7]">
                <span class="w-5 h-5 rounded-[6px] bg-[#F4F4F5] flex items-center justify-center text-[#18181B] text-[0.65rem] font-black flex-shrink-0">✓</span>
                <span class="text-[0.8rem] font-semibold text-[#18181B]">{{ strength }}</span>
              </div>
            </div>
          </div>

          <!-- Focus Area -->
          <div class="bg-white rounded-2xl border border-[rgba(228,228,231,0.6)] shadow-[0_1px_3px_rgba(0,0,0,0.01)] p-6 flex flex-col gap-6 group hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-[10px] bg-[#FAFAFC] border border-[#E4E4E7] flex items-center justify-center">
                <LightBulbIcon class="w-5 h-5 text-[#3F3F46]" />
              </div>
              <div class="flex flex-col gap-[0.1rem]">
                <h3 class="text-[0.8rem] font-bold text-[#18181B] uppercase tracking-[0.02em] m-0">Area Fokus</h3>
                <p class="text-[0.7rem] text-[#A1A1AA] font-medium m-0">Peluang tumbuhmu berikutnya</p>
              </div>
            </div>
            <div class="flex flex-col gap-3">
              <div v-for="area in focusAreas" :key="area" class="flex items-center gap-3 p-3 rounded-[10px] bg-[#FAFAFC] border border-[#E4E4E7]">
                <span class="w-5 h-5 rounded-[6px] bg-[#F4F4F5] flex items-center justify-center text-[#71717A] text-[0.65rem] font-black flex-shrink-0">→</span>
                <span class="text-[0.8rem] font-semibold text-[#18181B]">{{ area }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ⑤ MENTOR FEEDBACK -->
        <section class="bg-white rounded-2xl border border-[rgba(228,228,231,0.6)] shadow-[0_1px_3px_rgba(0,0,0,0.01)] p-6 flex flex-col gap-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-[10px] bg-[#FAFAFC] border border-[#E4E4E7] flex items-center justify-center">
              <ChatBubbleLeftRightIcon class="w-5 h-5 text-[#3F3F46]" />
            </div>
            <div class="flex flex-col gap-[0.1rem]">
              <h3 class="text-[0.8rem] font-bold text-[#18181B] uppercase tracking-[0.02em] m-0">Feedback Mentor</h3>
              <p class="text-[0.7rem] text-[#A1A1AA] font-medium m-0">Penilaian personal dari Senior Mentor</p>
            </div>
            <span class="ml-auto text-[0.65rem] font-bold uppercase tracking-[0.02em] text-[#71717A]">{{ new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) }}</span>
          </div>

          <div class="flex gap-4 p-5 rounded-2xl bg-[#FAFAFC] border border-[#E4E4E7] items-start">
            <!-- Avatar Mentor -->
            <div class="w-10 h-10 rounded-[10px] bg-[#18181B] flex items-center justify-center text-white font-black text-[0.9rem] flex-shrink-0">
              {{ mentorFeedback.mentor.charAt(0) }}
            </div>
            <div class="flex flex-col gap-1.5 flex-1 min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-[0.85rem] font-bold text-[#18181B]">{{ mentorFeedback.mentor }}</span>
                <span class="text-[0.6rem] font-bold uppercase tracking-[0.02em] text-[#71717A] bg-[#F4F4F5] px-2 py-0.5 rounded-[5px] border border-[#E4E4E7]">Senior Mentor</span>
              </div>
              <blockquote class="text-[0.8rem] text-[#3F3F46] font-medium leading-[1.5] italic border-l-[3px] border-[#E4E4E7] pl-3 m-0">
                "{{ mentorFeedback.message }}"
              </blockquote>
            </div>
          </div>
        </section>

        <!-- ⑥ WEEKLY ACHIEVEMENT -->
        <section class="flex flex-col gap-5">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-[10px] bg-white border border-[#E4E4E7] flex items-center justify-center shadow-sm">
              <SparklesIcon class="w-5 h-5 text-[#3F3F46]" />
            </div>
            <div class="flex flex-col gap-[0.1rem]">
              <h3 class="text-[0.8rem] font-bold text-[#18181B] uppercase tracking-[0.02em] m-0">Pencapaian Minggu Ini</h3>
              <p class="text-[0.7rem] text-[#A1A1AA] font-medium m-0">Setiap langkah kecil adalah bagian dari perjalanan</p>
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              v-for="achievement in weeklyAchievements"
              :key="achievement.title"
              class="flex flex-col items-center gap-3 p-5 rounded-2xl border text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
              :class="achievement.unlocked ? 'bg-white border-[#E4E4E7]' : 'bg-[#FAFAFC] border-[#F4F4F5] opacity-60'"
            >
              <div class="text-[1.5rem]">{{ achievement.icon }}</div>
              <div class="flex flex-col gap-[0.1rem]">
                <span class="text-[0.8rem] font-bold text-[#18181B]">{{ achievement.title }}</span>
                <span class="text-[0.7rem] text-[#71717A] font-medium leading-[1.4]">{{ achievement.description }}</span>
              </div>
              <span v-if="achievement.unlocked" class="px-[0.55rem] py-[0.15rem] mt-1 rounded-[5px] bg-[#FAFAFC] border border-[#E4E4E7] text-[0.6rem] font-bold text-[#3F3F46] uppercase tracking-[0.02em]">Unlocked ✓</span>
              <span v-else class="px-[0.55rem] py-[0.15rem] mt-1 rounded-[5px] bg-[#F4F4F5] border border-[#E4E4E7] text-[0.6rem] font-bold text-[#A1A1AA] uppercase tracking-[0.02em]">Belum</span>
            </div>
          </div>
        </section>

        <!-- ⑦ NEXT RECOMMENDED FOCUS -->
        <section class="relative overflow-hidden rounded-2xl bg-[#18181B] p-8 lg:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <div class="relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center">
            <div class="flex flex-col gap-3 flex-1">
              <div class="flex items-center gap-2">
                <MapIcon class="w-4 h-4 text-[#A1A1AA]" />
                <span class="text-[0.65rem] font-bold uppercase tracking-[0.02em] text-[#A1A1AA]">Langkah Berikutnya</span>
              </div>
              <h3 class="text-[1.25rem] font-bold text-white tracking-[-0.01em] m-0">
                Fokus Minggu Depan
              </h3>
              <p class="text-[0.8rem] text-[#A1A1AA] font-medium leading-[1.5] max-w-lg m-0">
                Berdasarkan progresmu, ini 3 topik yang paling mempercepat pertumbuhanmu sebagai developer.
              </p>
            </div>
            <div class="flex flex-col gap-3 lg:min-w-[280px]">
              <div
                v-for="(focus, i) in nextFocusTopics"
                :key="focus"
                class="flex items-center gap-3 p-3.5 rounded-[10px] bg-white/10 border border-white/10 backdrop-blur-sm"
              >
                <span class="w-6 h-6 rounded-[6px] bg-white/20 flex items-center justify-center text-white font-bold text-[0.75rem] flex-shrink-0">{{ i + 1 }}</span>
                <span class="text-[0.8rem] font-medium text-white">{{ focus }}</span>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import StudentSidebar from '~/components/student/StudentSidebar.vue'
import {
  Bars3Icon,
  ChartBarIcon,
  CheckBadgeIcon,
  StarIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  FireIcon,
  PresentationChartLineIcon,
  ArrowRightIcon,
  AcademicCapIcon,
  BoltIcon,
  TrophyIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  MapIcon
} from '@heroicons/vue/24/outline'

useSeoMeta({
  title: 'Skill Report — Pixelnoid Academy',
  description: 'Pantau perkembangan skill, progress belajar, dan feedback personal dari mentormu di Pixelnoid Academy.'
})

definePageMeta({ layout: 'dashboard' })

const sidebarOpen = ref(false)

/* ── MOCK DATA ── */

// ① Overall Progress
const overallScore = ref(64)
const targetScore = ref(75)
const topPercentile = ref(30)
const weeklyStreak = ref(7)

// Level / XP System
const currentLevel = ref('Intermediate Frontend')
const currentXP = ref(1240)
const nextLevelXP = ref(1800)
const nextLevelName = ref('Advanced')
const xpPercent = computed(() => Math.round((currentXP.value / nextLevelXP.value) * 100))

// Learning Pace
const learningPace = ref('Consistent Learner')
const learningPaceDescription = ref('Kamu belajar secara teratur dan terjadwal — kebiasaan terbaik untuk jangka panjang.')

// ② Metrics
const projectCompletion = ref(45)
const completedProjects = ref(4)
const totalProjects = ref(9)

const feedbackScore = ref(4.1)
const feedbackTrend = ref(0.2)

const deadlineOnTime = ref(18)
const deadlineLate = ref(4)
const deadlineMissed = ref(1)
const totalTasks = computed(() => (deadlineOnTime.value + deadlineLate.value + deadlineMissed.value) || 1)

// ③ Skill Breakdown
const skills = ref([
  { name: 'UI/UX Design', score: 65, pastScore: 60, growth: 5 },
  { name: 'Frontend Engineering (Vue/Nuxt)', score: 82, pastScore: 70, growth: 12 },
  { name: 'Backend Integration', score: 45, pastScore: 35, growth: 10 },
  { name: 'Problem Solving', score: 70, pastScore: 72, growth: -2 },
  { name: 'Team Collaboration', score: 88, pastScore: 80, growth: 8 }
])

const lowestSkill = computed(() => {
  return [...skills.value].sort((a, b) => a.score - b.score)[0]
})

const getSkillColor = (score: number) => {
  if (score >= 80) return 'bg-[#18181B]'
  if (score >= 60) return 'bg-[#3F3F46]'
  return 'bg-[#71717A]'
}

// ④ Strength & Focus Area
const strengths = ref([
  'Rapid Learner — cepat paham konsep baru',
  'UI Consistency — desain selalu rapi & konsisten',
  'Team Player — kolaborasi & komunikasi solid',
])

const focusAreas = ref([
  'Async Logic & Promise handling',
  'REST API Error Handling',
  'Code Readability & Clean Code',
])

// ⑤ Mentor Feedback
const mentorFeedback = ref({
  mentor: 'Rafi Santoso',
  message: 'Progressmu minggu ini sangat terasa! Component structure-mu sudah jauh lebih rapi dibanding sebelumnya. Sekarang fokus ke state management — itu yang akan membuat skill Vue/Nuxt-mu benar-benar solid. Keep it up!'
})

// ⑥ Weekly Achievement
const weeklyAchievements = ref([
  { icon: '🚀', title: 'First API Integration', description: 'Berhasil fetch & tampilkan data dari REST API', unlocked: true },
  { icon: '🎯', title: '7-Day Streak', description: 'Belajar konsisten 7 hari berturut-turut', unlocked: true },
  { icon: '🛠️', title: 'Bug Buster', description: 'Solved 5 debugging challenges', unlocked: true },
  { icon: '🏆', title: 'Top 30% Cohort', description: 'Masuk 30% terbaik angkatan ini', unlocked: false },
])

// ⑦ Next Recommended Focus
const nextFocusTopics = ref([
  'DOM Manipulation & Virtual DOM',
  'Fetch API & Async/Await',
  'Error Handling & Try-Catch Pattern',
])
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
</style>
