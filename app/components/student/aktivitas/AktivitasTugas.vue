<template>
  <div class="flex flex-col gap-6">

    <!-- ── 1. RINGKASAN METRIK (HEADER STAT CARDS) ── -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Card: Pending -->
      <div class="bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-all hover:border-[#D4D4D8]">
        <div class="flex items-center justify-between">
          <span class="text-[0.68rem] font-bold uppercase tracking-wider text-[#71717A]">Perlu Dikerjakan</span>
          <div class="w-8 h-8 rounded-xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706]">
            <ClockIcon class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-3">
          <div class="text-[1.75rem] font-black text-[#18181B] tracking-tight leading-none">
            {{ metrics.pending }}
          </div>
          <p class="text-[0.7rem] text-[#A1A1AA] font-medium mt-1 mb-0">Tugas belum dikumpulkan</p>
        </div>
      </div>

      <!-- Card: Submitted -->
      <div class="bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-all hover:border-[#D4D4D8]">
        <div class="flex items-center justify-between">
          <span class="text-[0.68rem] font-bold uppercase tracking-wider text-[#71717A]">Menunggu Review</span>
          <div class="w-8 h-8 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
            <ArrowUpTrayIcon class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-3">
          <div class="text-[1.75rem] font-black text-[#2563EB] tracking-tight leading-none">
            {{ metrics.submitted }}
          </div>
          <p class="text-[0.7rem] text-[#A1A1AA] font-medium mt-1 mb-0">Antre diperiksa mentor</p>
        </div>
      </div>

      <!-- Card: Reviewed -->
      <div class="bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-all hover:border-[#D4D4D8]">
        <div class="flex items-center justify-between">
          <span class="text-[0.68rem] font-bold uppercase tracking-wider text-[#71717A]">Telah Dinilai</span>
          <div class="w-8 h-8 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#059669]">
            <CheckCircleIcon class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-3">
          <div class="text-[1.75rem] font-black text-[#059669] tracking-tight leading-none">
            {{ metrics.reviewed }}
          </div>
          <p class="text-[0.7rem] text-[#A1A1AA] font-medium mt-1 mb-0">Memiliki skor &amp; feedback</p>
        </div>
      </div>

      <!-- Card: Average Grade -->
      <div class="bg-white p-5 rounded-2xl border border-[#E4E4E7] shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col justify-between transition-all hover:border-[#D4D4D8]">
        <div class="flex items-center justify-between">
          <span class="text-[0.68rem] font-bold uppercase tracking-wider text-[#71717A]">Rata-rata Nilai</span>
          <div class="w-8 h-8 rounded-xl bg-[#F5F3FF] border border-[#DDD6FE] flex items-center justify-center text-[#7C3AED]">
            <TrophyIcon class="w-4 h-4" />
          </div>
        </div>
        <div class="mt-3">
          <div class="text-[1.75rem] font-black text-[#18181B] tracking-tight leading-none">
            {{ metrics.averageGrade !== null ? metrics.averageGrade : '-' }}
            <span v-if="metrics.averageGrade !== null" class="text-[0.9rem] font-semibold text-[#A1A1AA]">/100</span>
          </div>
          <p class="text-[0.7rem] text-[#A1A1AA] font-medium mt-1 mb-0">Rata-rata seluruh evaluasi</p>
        </div>
      </div>
    </section>

    <!-- ── 2. FILTER & SEARCH CONTROLS ── -->
    <section class="bg-white rounded-2xl border border-[#E4E4E7] p-5 shadow-sm space-y-4">
      <!-- Status Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          v-for="tab in statusFilterTabs"
          :key="tab.id"
          class="whitespace-nowrap px-3.5 py-2 rounded-xl text-[0.75rem] font-semibold transition-all border flex items-center gap-1.5"
          :class="activeStatusFilter === tab.id
            ? 'bg-[#18181B] border-[#18181B] text-white shadow-sm'
            : 'bg-white border-[#E4E4E7] text-[#71717A] hover:bg-[#FAFAFC] hover:text-[#18181B]'"
          @click="activeStatusFilter = tab.id"
        >
          <span>{{ tab.label }}</span>
          <span
            class="text-[0.62rem] px-1.5 py-0.5 rounded-full font-bold"
            :class="activeStatusFilter === tab.id ? 'bg-[#3F3F46] text-white' : 'bg-[#F4F4F5] text-[#71717A]'"
          >
            {{ tab.count }}
          </span>
        </button>
      </div>

      <!-- Search & Select Filters -->
      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Search Input -->
        <div class="relative flex-1">
          <MagnifyingGlassIcon class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari judul tugas, materi, atau instruksi..."
            class="w-full pl-10 pr-4 py-2.5 bg-[#FAFAFC] border border-[#E4E4E7] rounded-xl text-[0.8rem] text-[#18181B] placeholder-[#A1A1AA] focus:bg-white focus:ring-2 focus:ring-[#18181B]/10 focus:border-[#18181B] outline-none transition-all"
          />
        </div>

        <!-- Filter Tipe Tugas -->
        <select
          v-model="activeTypeFilter"
          class="px-3.5 py-2.5 bg-[#FAFAFC] border border-[#E4E4E7] rounded-xl text-[0.8rem] font-medium text-[#18181B] focus:bg-white focus:ring-2 focus:ring-[#18181B]/10 focus:border-[#18181B] outline-none cursor-pointer transition-all"
        >
          <option value="all">Semua Tipe (Quizizz, Praktek, Studi Kasus)</option>
          <option value="quizizz">🟣 Quizizz</option>
          <option value="practice">🔵 Praktek</option>
          <option value="case_study">🟠 Studi Kasus</option>
        </select>

        <!-- Sorting -->
        <select
          v-model="sortBy"
          class="px-3.5 py-2.5 bg-[#FAFAFC] border border-[#E4E4E7] rounded-xl text-[0.8rem] font-medium text-[#18181B] focus:bg-white focus:ring-2 focus:ring-[#18181B]/10 focus:border-[#18181B] outline-none cursor-pointer transition-all"
        >
          <option value="deadline">Urutkan: Batas Waktu Terdekat</option>
          <option value="newest">Urutkan: Tugas Terbaru</option>
          <option value="status">Urutkan: Status Tugas</option>
        </select>
      </div>
    </section>

    <!-- ── 3. DAFTAR KARTU TUGAS (ASSIGNMENT CARDS) ── -->
    <section class="space-y-4">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#E4E4E7] gap-3">
        <div class="w-8 h-8 border-2 border-[#18181B] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-[0.8rem] text-[#71717A] font-medium">Memuat data tugas...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredAssignments.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-[#E4E4E7] gap-3 text-center px-4">
        <div class="w-12 h-12 rounded-2xl bg-[#F4F4F5] flex items-center justify-center text-[#A1A1AA]">
          <DocumentTextIcon class="w-6 h-6" />
        </div>
        <h3 class="text-[0.95rem] font-bold text-[#18181B] m-0">Tidak Ada Tugas Ditemukan</h3>
        <p class="text-[0.78rem] text-[#71717A] max-w-sm m-0">
          {{ searchQuery || activeStatusFilter !== 'all' || activeTypeFilter !== 'all'
            ? 'Tidak ada tugas yang sesuai dengan filter pencarian saat ini.'
            : 'Belum ada tugas yang ditugaskan ke akun kamu saat ini.' }}
        </p>
        <button
          v-if="searchQuery || activeStatusFilter !== 'all' || activeTypeFilter !== 'all'"
          class="mt-2 text-[0.75rem] font-semibold text-[#443E8D] hover:underline"
          @click="resetFilters"
        >
          Reset Filter Pencarian
        </button>
      </div>

      <!-- Assignment Items -->
      <div v-else class="space-y-4">
        <div
          v-for="item in filteredAssignments"
          :key="item.id"
          class="bg-white rounded-2xl border border-[#E4E4E7] p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#D4D4D8] flex flex-col gap-4 relative overflow-hidden"
        >
          <!-- Top Row: Badges & Deadline -->
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2 flex-wrap">
              <!-- Type Badge -->
              <span
                class="px-2.5 py-1 rounded-lg text-[0.65rem] font-bold uppercase tracking-wider flex items-center gap-1.5 border"
                :class="getTypeBadgeClass(item.assignments?.type)"
              >
                <span>{{ getTypeLabel(item.assignments?.type) }}</span>
              </span>

              <!-- Status Badge -->
              <span
                class="px-2.5 py-1 rounded-lg text-[0.65rem] font-bold uppercase tracking-wider flex items-center gap-1.5 border"
                :class="getStatusBadgeClass(item.status)"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(item.status)"></span>
                <span>{{ getStatusLabel(item.status, item.grade) }}</span>
              </span>
            </div>

            <!-- Deadline Badge -->
            <div
              v-if="item.assignments?.due_date"
              class="flex items-center gap-1.5 text-[0.72rem] font-medium"
              :class="getDeadlineAlertClass(item.assignments.due_date, item.status)"
            >
              <CalendarDaysIcon class="w-4 h-4 flex-shrink-0" />
              <span>Batas: {{ formatDeadline(item.assignments.due_date) }}</span>
            </div>
          </div>

          <!-- Main Content: Title & Instructions -->
          <div class="space-y-1.5">
            <h3 class="text-[1.05rem] font-bold text-[#18181B] tracking-tight m-0">
              {{ item.assignments?.title || 'Tugas Tanpa Judul' }}
            </h3>
            <p class="text-[0.8rem] text-[#52525B] leading-relaxed m-0 line-clamp-2">
              {{ item.assignments?.description || 'Tidak ada instruksi tambahan.' }}
            </p>
          </div>

          <!-- Submitted URL Preview if exists -->
          <div
            v-if="item.submission_url"
            class="p-3.5 bg-[#FAFAFC] border border-[#E4E4E7] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-7 h-7 rounded-lg bg-white border border-[#E4E4E7] flex items-center justify-center text-[#71717A] flex-shrink-0">
                <LinkIcon class="w-3.5 h-3.5" />
              </div>
              <div class="min-w-0">
                <span class="text-[0.65rem] font-bold uppercase tracking-wider text-[#A1A1AA] block leading-none mb-1">Link Tugas Terkirim:</span>
                <a
                  :href="item.submission_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[0.75rem] font-semibold text-[#2563EB] hover:underline truncate block"
                >
                  {{ item.submission_url }}
                </a>
              </div>
            </div>
            <div class="text-[0.68rem] text-[#71717A] font-medium sm:text-right flex-shrink-0">
              Dikirim: {{ formatSubmittedAt(item.submitted_at) }}
            </div>
          </div>

          <!-- Mentor Feedback Snippet if Reviewed -->
          <div
            v-if="item.status === 'reviewed' && item.feedback"
            class="p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl flex items-start gap-3"
          >
            <div class="w-8 h-8 rounded-xl bg-[#DCFCE7] flex items-center justify-center text-[#16A34A] flex-shrink-0 mt-0.5">
              <CheckBadgeIcon class="w-4 h-4" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2 mb-1">
                <span class="text-[0.72rem] font-bold text-[#166534]">
                  Catatan Mentor (Skor: {{ item.grade }}/100)
                </span>
                <span class="text-[0.65rem] text-[#15803D] font-medium">
                  Oleh: {{ item.mentor?.fullname || 'Mentor' }}
                </span>
              </div>
              <p class="text-[0.78rem] text-[#14532D] leading-relaxed m-0 italic line-clamp-2">
                "{{ item.feedback }}"
              </p>
            </div>
          </div>

          <!-- Action Buttons Bar -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F4F4F5]">
            <!-- Left: Open Guideline / Quizizz Link -->
            <div>
              <a
                v-if="item.assignments?.link_url"
                :href="item.assignments.link_url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[0.75rem] font-semibold text-[#18181B] bg-[#F4F4F5] hover:bg-[#E4E4E7] transition-colors"
              >
                <ArrowTopRightOnSquareIcon class="w-3.5 h-3.5" />
                <span>Buka Panduan / Soal</span>
              </a>
            </div>

            <!-- Right: Submission & Feedback Actions -->
            <div class="flex items-center gap-2">
              <!-- Pending: Kumpulkan Tugas -->
              <button
                v-if="item.status === 'pending'"
                class="px-4 py-2 rounded-xl bg-[#18181B] text-white text-[0.78rem] font-bold hover:bg-[#3F3F46] transition-colors flex items-center gap-2 shadow-sm"
                @click="openSubmitModal(item)"
              >
                <ArrowUpTrayIcon class="w-4 h-4" />
                <span>Kumpulkan Tugas</span>
              </button>

              <!-- Submitted: Edit Link / Catatan -->
              <button
                v-if="item.status === 'submitted'"
                class="px-4 py-2 rounded-xl bg-white border border-[#E4E4E7] text-[#18181B] text-[0.78rem] font-bold hover:bg-[#FAFAFC] transition-colors flex items-center gap-2"
                @click="openSubmitModal(item)"
              >
                <PencilSquareIcon class="w-4 h-4 text-[#71717A]" />
                <span>Edit Link / Catatan</span>
              </button>

              <!-- Reviewed: Lihat Feedback Mentor -->
              <button
                v-if="item.status === 'reviewed'"
                class="px-4 py-2 rounded-xl bg-[#059669] text-white text-[0.78rem] font-bold hover:bg-[#047857] transition-colors flex items-center gap-2 shadow-sm"
                @click="openReviewModal(item)"
              >
                <ChatBubbleBottomCenterTextIcon class="w-4 h-4" />
                <span>Lihat Feedback Mentor</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── 4. MODAL PENGUMPULAN TUGAS (UPLOAD BY URL) ── -->
    <Transition name="modal-fade">
      <div
        v-if="showSubmitModal"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[3px]"
        @click.self="closeSubmitModal"
      >
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-[#E4E4E7] animate-in fade-in zoom-in-95 duration-200">
          <!-- Modal Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-[#F4F4F5]">
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span
                  class="px-2 py-0.5 rounded text-[0.62rem] font-bold uppercase tracking-wider border"
                  :class="getTypeBadgeClass(selectedAssignment?.assignments?.type)"
                >
                  {{ getTypeLabel(selectedAssignment?.assignments?.type) }}
                </span>
                <span class="text-[0.7rem] text-[#71717A] font-medium">Pengumpulan Tugas</span>
              </div>
              <h2 class="text-[1.05rem] font-bold text-[#18181B] tracking-tight m-0">
                {{ selectedAssignment?.assignments?.title }}
              </h2>
            </div>
            <button
              class="w-8 h-8 rounded-xl bg-[#F4F4F5] flex items-center justify-center text-[#71717A] hover:bg-[#E4E4E7] transition-colors"
              @click="closeSubmitModal"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <!-- Guidelines Notice -->
            <div class="p-3.5 bg-[#F0EFF9] border border-[#D8D6F0] rounded-xl flex items-start gap-2.5">
              <InformationCircleIcon class="w-4 h-4 text-[#443E8D] flex-shrink-0 mt-0.5" />
              <p class="text-[0.72rem] text-[#443E8D] leading-relaxed m-0 font-medium">
                Sematkan tautan hasil karyamu (Google Drive, Figma, GitHub, Notion, atau YouTube). 
                <strong>Pastikan link Google Drive atau Figma disetel ke 'Anyone with the link can view'</strong> agar mentor dapat memeriksa tugasmu.
              </p>
            </div>

            <!-- Input: Submission URL -->
            <div class="space-y-1.5">
              <label class="block text-[0.75rem] font-bold text-[#18181B]">
                Tautan Pengerjaan Tugas (URL) <span class="text-[#E11D48]">*</span>
              </label>
              <div class="relative">
                <LinkIcon class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
                <input
                  v-model="submissionForm.url"
                  type="url"
                  placeholder="https://figma.com/file/... atau https://drive.google.com/..."
                  class="w-full pl-10 pr-24 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-[0.8rem] text-[#18181B] placeholder-[#A1A1AA] focus:ring-2 focus:ring-[#18181B]/10 focus:border-[#18181B] outline-none transition-all"
                  :class="{ 'border-[#E11D48] focus:border-[#E11D48] focus:ring-[#E11D48]/10': urlError }"
                />
                <!-- Quick Test Link Button -->
                <button
                  v-if="submissionForm.url && isValidUrl(submissionForm.url)"
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg text-[0.68rem] font-bold bg-[#F4F4F5] text-[#18181B] hover:bg-[#E4E4E7] transition-colors flex items-center gap-1"
                  @click="testOpenUrl(submissionForm.url)"
                >
                  <ArrowTopRightOnSquareIcon class="w-3 h-3" />
                  <span>Cek Link</span>
                </button>
              </div>
              <p v-if="urlError" class="text-[0.7rem] text-[#E11D48] font-medium m-0">
                {{ urlError }}
              </p>
            </div>

            <!-- Input: Submission Notes -->
            <div class="space-y-1.5">
              <label class="block text-[0.75rem] font-bold text-[#18181B]">
                Catatan Siswa untuk Mentor <span class="text-[#A1A1AA] font-normal">(Opsional)</span>
              </label>
              <textarea
                v-model="submissionForm.notes"
                rows="3"
                placeholder="Berikan konteks pengerjaan, highlight fitur, atau password jika ada arsip terproteksi..."
                class="w-full px-4 py-2.5 bg-white border border-[#E4E4E7] rounded-xl text-[0.8rem] text-[#18181B] placeholder-[#A1A1AA] focus:ring-2 focus:ring-[#18181B]/10 focus:border-[#18181B] outline-none resize-none transition-all"
              ></textarea>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-6 py-4 border-t border-[#F4F4F5] bg-[#FAFAFC] flex items-center justify-between gap-3">
            <button
              type="button"
              class="px-4 py-2 rounded-xl bg-white border border-[#E4E4E7] text-[#71717A] text-[0.78rem] font-bold hover:bg-[#F4F4F5] transition-colors"
              @click="closeSubmitModal"
            >
              Batal
            </button>
            <button
              type="button"
              class="px-5 py-2 rounded-xl bg-[#18181B] text-white text-[0.78rem] font-bold hover:bg-[#3F3F46] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isSubmitting || !submissionForm.url"
              @click="submitAssignment"
            >
              <div v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{{ isSubmitting ? 'Mengirim...' : (selectedAssignment?.status === 'submitted' ? 'Simpan Perubahan' : 'Kirim Tugas') }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── 5. MODAL DETAIL REVIEW & FEEDBACK MENTOR ── -->
    <Transition name="modal-fade">
      <div
        v-if="showReviewModal && selectedAssignment"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[3px]"
        @click.self="showReviewModal = false"
      >
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-[#E4E4E7] animate-in fade-in zoom-in-95 duration-200">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-[#F4F4F5]">
            <div>
              <span class="text-[0.65rem] font-bold uppercase tracking-wider text-[#059669] block mb-1">
                Hasil Evaluasi &amp; Review
              </span>
              <h2 class="text-[1.05rem] font-bold text-[#18181B] tracking-tight m-0">
                {{ selectedAssignment.assignments?.title }}
              </h2>
            </div>
            <button
              class="w-8 h-8 rounded-xl bg-[#F4F4F5] flex items-center justify-center text-[#71717A] hover:bg-[#E4E4E7] transition-colors"
              @click="showReviewModal = false"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            <!-- Score Banner -->
            <div class="p-6 bg-gradient-to-br from-[#ECFDF5] to-[#D1FAE5] border border-[#A7F3D0] rounded-2xl text-center relative overflow-hidden">
              <div class="text-[0.7rem] font-bold uppercase tracking-widest text-[#047857] mb-1">Nilai / Grade Tugas</div>
              <div class="text-[3rem] font-black text-[#065F46] tracking-tight leading-none my-1">
                {{ selectedAssignment.grade || '0' }}
                <span class="text-[1.2rem] font-bold text-[#059669]">/100</span>
              </div>
              <p class="text-[0.75rem] font-semibold text-[#047857] m-0">
                {{ Number(selectedAssignment.grade) >= 85 ? 'Sangat Baik! Pertahankan kualitas karyamu.' : 'Tugas berhasil dinilai oleh Mentor.' }}
              </p>
            </div>

            <!-- Feedback Details -->
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-[0.75rem] font-bold text-[#18181B]">Catatan Evaluasi Mentor:</span>
                <span class="text-[0.68rem] text-[#71717A]">
                  Dinilai: {{ formatSubmittedAt(selectedAssignment.feedback_at) }}
                </span>
              </div>
              <div class="p-4 bg-[#FAFAFC] border border-[#E4E4E7] rounded-xl text-[0.82rem] text-[#18181B] leading-relaxed">
                {{ selectedAssignment.feedback || 'Tidak ada catatan tertulis.' }}
              </div>
            </div>

            <!-- Mentor Profile -->
            <div class="p-4 bg-white border border-[#E4E4E7] rounded-xl flex items-center justify-between gap-3">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#443E8D] text-white font-bold flex items-center justify-center text-[0.9rem]">
                  {{ (selectedAssignment.mentor?.fullname || 'M')[0].toUpperCase() }}
                </div>
                <div>
                  <span class="text-[0.65rem] font-bold uppercase tracking-wider text-[#A1A1AA] block">Mentor Penilai</span>
                  <span class="text-[0.85rem] font-bold text-[#18181B]">{{ selectedAssignment.mentor?.fullname || 'Mentor Pixelnoid' }}</span>
                </div>
              </div>
              <button
                class="text-[0.72rem] font-semibold text-[#443E8D] hover:underline"
                @click="goToMentorTab(selectedAssignment)"
              >
                Lihat di Tab Catatan →
              </button>
            </div>

            <!-- Student Submission Recap -->
            <div class="space-y-2 pt-3 border-t border-[#F4F4F5]">
              <span class="text-[0.72rem] font-bold text-[#71717A] uppercase tracking-wider block">Karya yang Kamu Kumpulkan:</span>
              <div class="p-3.5 bg-[#FAFAFC] border border-[#E4E4E7] rounded-xl space-y-2">
                <a
                  :href="selectedAssignment.submission_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[0.78rem] font-semibold text-[#2563EB] hover:underline flex items-center gap-1.5 break-all"
                >
                  <ArrowTopRightOnSquareIcon class="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{{ selectedAssignment.submission_url }}</span>
                </a>
                <p v-if="selectedAssignment.submission_notes" class="text-[0.72rem] text-[#52525B] leading-relaxed m-0 border-t border-[#E4E4E7] pt-2">
                  <span class="font-semibold text-[#18181B]">Catatanmu:</span> {{ selectedAssignment.submission_notes }}
                </p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 border-t border-[#F4F4F5] bg-[#FAFAFC] flex justify-end">
            <button
              class="px-5 py-2 rounded-xl bg-[#18181B] text-white text-[0.78rem] font-bold hover:bg-[#3F3F46] transition-colors"
              @click="showReviewModal = false"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import {
  ClockIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  TrophyIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  LinkIcon,
  CheckBadgeIcon,
  ArrowTopRightOnSquareIcon,
  PencilSquareIcon,
  ChatBubbleBottomCenterTextIcon,
  XMarkIcon,
  InformationCircleIcon
} from '@heroicons/vue/24/outline'

const emit = defineEmits<{
  (e: 'open-feedback', task: any): void
}>()

const supabase = useSupabaseClient()

// ── State ─────────────────────────────────────────────────────────────
const isLoading = ref(true)
const isSubmitting = ref(false)
const assignments = ref<any[]>([])
const metrics = ref({
  total: 0,
  pending: 0,
  submitted: 0,
  reviewed: 0,
  averageGrade: null as number | null
})

const activeStatusFilter = ref('all')
const activeTypeFilter = ref('all')
const searchQuery = ref('')
const sortBy = ref('deadline')

// Modal State
const showSubmitModal = ref(false)
const showReviewModal = ref(false)
const selectedAssignment = ref<any | null>(null)
const urlError = ref('')

const submissionForm = reactive({
  url: '',
  notes: ''
})

// ── Data Fetching ─────────────────────────────────────────────────────
async function fetchAssignments() {
  isLoading.value = true
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token

    const headers: Record<string, string> = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const res = await $fetch<{
      studentId: string
      metrics: typeof metrics.value
      assignments: any[]
    }>('/api/student/assignments', { headers })

    assignments.value = res.assignments || []
    metrics.value = res.metrics || {
      total: 0,
      pending: 0,
      submitted: 0,
      reviewed: 0,
      averageGrade: null
    }
  } catch (error) {
    console.error('Error fetching assignments:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchAssignments()
})

// ── Computed & Filters ────────────────────────────────────────────────
const statusFilterTabs = computed(() => [
  { id: 'all', label: 'Semua Tugas', count: metrics.value.total },
  { id: 'pending', label: 'Perlu Dikerjakan', count: metrics.value.pending },
  { id: 'submitted', label: 'Menunggu Review', count: metrics.value.submitted },
  { id: 'reviewed', label: 'Selesai & Dinilai', count: metrics.value.reviewed },
])

const filteredAssignments = computed(() => {
  let list = [...assignments.value]

  // Status Filter
  if (activeStatusFilter.value !== 'all') {
    list = list.filter(item => item.status === activeStatusFilter.value)
  }

  // Type Filter
  if (activeTypeFilter.value !== 'all') {
    list = list.filter(item => item.assignments?.type === activeTypeFilter.value)
  }

  // Search Query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(item => {
      const title = (item.assignments?.title || '').toLowerCase()
      const desc = (item.assignments?.description || '').toLowerCase()
      return title.includes(q) || desc.includes(q)
    })
  }

  // Sorting
  if (sortBy.value === 'deadline') {
    list.sort((a, b) => {
      const timeA = a.assignments?.due_date ? new Date(a.assignments.due_date).getTime() : Infinity
      const timeB = b.assignments?.due_date ? new Date(b.assignments.due_date).getTime() : Infinity
      return timeA - timeB
    })
  } else if (sortBy.value === 'newest') {
    list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  } else if (sortBy.value === 'status') {
    const statusOrder: Record<string, number> = { pending: 0, submitted: 1, reviewed: 2 }
    list.sort((a, b) => (statusOrder[a.status] ?? 9) - (statusOrder[b.status] ?? 9))
  }

  return list
})

function resetFilters() {
  activeStatusFilter.value = 'all'
  activeTypeFilter.value = 'all'
  searchQuery.value = ''
}

// ── Submission Handlers ───────────────────────────────────────────────
function openSubmitModal(item: any) {
  selectedAssignment.value = item
  submissionForm.url = item.submission_url || ''
  submissionForm.notes = item.submission_notes || ''
  urlError.value = ''
  showSubmitModal.value = true
}

function closeSubmitModal() {
  showSubmitModal.value = false
  selectedAssignment.value = null
  submissionForm.url = ''
  submissionForm.notes = ''
  urlError.value = ''
}

function isValidUrl(val: string) {
  try {
    const parsed = new URL(val)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function testOpenUrl(url: string) {
  if (isValidUrl(url)) {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

async function submitAssignment() {
  urlError.value = ''
  const trimmed = submissionForm.url.trim()

  if (!trimmed) {
    urlError.value = 'Tautan pengumpulan wajib diisi.'
    return
  }

  if (!isValidUrl(trimmed)) {
    urlError.value = 'Format URL tidak valid. Pastikan diawali https://'
    return
  }

  isSubmitting.value = true
  try {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token

    const headers: Record<string, string> = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    await $fetch('/api/student/assignments/submit', {
      method: 'POST',
      headers,
      body: {
        studentAssignmentId: selectedAssignment.value.id,
        submissionUrl: trimmed,
        submissionNotes: submissionForm.notes
      }
    })

    closeSubmitModal()
    await fetchAssignments()
  } catch (err: any) {
    urlError.value = err?.data?.statusMessage || err?.message || 'Gagal mengumpulkan tugas.'
  } finally {
    isSubmitting.value = false
  }
}

function openReviewModal(item: any) {
  selectedAssignment.value = item
  showReviewModal.value = true
}

function goToMentorTab(item: any) {
  showReviewModal.value = false
  emit('open-feedback', item)
}

// ── Helpers ───────────────────────────────────────────────────────────
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
    case 'quizizz':
      return 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]'
    case 'practice':
      return 'bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]'
    case 'case_study':
      return 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
    default:
      return 'bg-[#F4F4F5] text-[#52525B] border-[#E4E4E7]'
  }
}

function getStatusLabel(status: string, grade?: number | null) {
  switch (status) {
    case 'pending': return 'Belum Dikumpulkan'
    case 'submitted': return 'Menunggu Penilaian'
    case 'reviewed': return `Selesai Dinilai (${grade ?? 0}/100)`
    default: return status
  }
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A]'
    case 'submitted':
      return 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]'
    case 'reviewed':
      return 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
    default:
      return 'bg-[#F4F4F5] text-[#52525B] border-[#E4E4E7]'
  }
}

function getStatusDotClass(status: string) {
  switch (status) {
    case 'pending': return 'bg-[#D97706]'
    case 'submitted': return 'bg-[#2563EB]'
    case 'reviewed': return 'bg-[#10B981]'
    default: return 'bg-[#A1A1AA]'
  }
}

function formatDeadline(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

function formatSubmittedAt(dateStr?: string) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

function getDeadlineAlertClass(dateStr: string, status: string) {
  if (status === 'reviewed' || status === 'submitted') {
    return 'text-[#71717A]'
  }
  const diffMs = new Date(dateStr).getTime() - Date.now()
  if (diffMs < 0) {
    return 'text-[#E11D48] font-bold'
  }
  if (diffMs < 24 * 60 * 60 * 1000) {
    return 'text-[#D97706] font-bold'
  }
  return 'text-[#71717A]'
}
</script>

<style scoped>
.scrollbar-none::-webkit-scrollbar { display: none; }
.scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>