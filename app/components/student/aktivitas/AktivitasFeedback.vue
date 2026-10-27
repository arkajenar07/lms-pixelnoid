<template>
  <main class="mx-auto w-full max-w-7xl space-y-6 sm:space-y-8">
    <!-- Mentor cards -->
    <section class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
      <article
        v-for="mentor in mentors"
        :key="mentor.id ?? mentor.username ?? mentor.fullname"
        class="group flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-lg hover:shadow-slate-200/60 sm:p-6"
      >
        <div class="flex items-start gap-4">
          <div class="relative shrink-0">
            <img
              v-if="mentor.avatar_url && !failedAvatars.has(String(mentor.id ?? mentor.username ?? mentor.fullname))"
              :src="mentor.avatar_url"
              :alt="`Foto ${mentor.fullname || 'mentor'}`"
              loading="lazy"
              class="h-14 w-14 rounded-2xl border border-slate-200 object-cover"
              @error="markAvatarFailed(mentor)"
            />
            <div v-else class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-700 to-indigo-500 text-xl font-bold text-white shadow-sm">
              {{ getInitials(mentor.fullname) }}
            </div>
            <span class="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-[3px] border-white bg-emerald-500" title="Mentor terdaftar"></span>
          </div>

          <div class="min-w-0 flex-1 pt-0.5">
            <h2 class="min-w-0 break-words text-base font-bold tracking-tight text-slate-900">{{ mentor.fullname || 'Nama mentor' }}</h2>
            <p class="mt-1 text-xs text-slate-500">@{{ mentor.username || 'mentor' }} <span aria-hidden="true">·</span> Mentor Pixelnoid</p>
          </div>
        </div>

        <!-- Pekerjaan & Instansi -->
        <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <!-- Pekerjaan -->
          <div class="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 min-w-0">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
              <BriefcaseIcon class="h-4 w-4" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-xs font-semibold text-slate-800" :title="getPekerjaan(mentor)">
                {{ getPekerjaan(mentor) }}
              </p>
            </div>
          </div>

          <!-- Instansi -->
          <div class="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-slate-50/80 p-2.5 min-w-0">
            <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <BuildingOfficeIcon class="h-4 w-4" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-xs font-semibold text-slate-800" :title="getInstansi(mentor)">
                {{ getInstansi(mentor) }}
              </p>
            </div>
          </div>
        </div>

        <div class="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <span class="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
            <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
            Siap menerima konsultasi
          </span>
          <div class="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <a
              v-if="hasWhatsApp(mentor)"
              :href="getWhatsAppLink(mentor)"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-100"
            >
              <ChatBubbleLeftEllipsisIcon class="h-4 w-4 shrink-0" /> WhatsApp
            </a>
            <span v-else class="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-xs font-semibold text-slate-400" title="Nomor WhatsApp belum tersedia">
              <ChatBubbleLeftEllipsisIcon class="h-4 w-4 shrink-0" /> WhatsApp
            </span>

            <a
              v-if="hasEmail(mentor)"
              :href="getEmailLink(mentor)"
              class="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3.5 py-2.5 text-xs font-bold text-violet-800 transition hover:bg-violet-100 focus:outline-none focus:ring-4 focus:ring-violet-100"
            >
              <EnvelopeIcon class="h-4 w-4 shrink-0" /> Email
            </a>
            <span v-else class="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-xs font-semibold text-slate-400" title="Email belum tersedia">
              <EnvelopeIcon class="h-4 w-4 shrink-0" /> Email
            </span>
          </div>
        </div>
      </article>
    </section>

    <p v-if="errorMessage && mentors.length > 0" class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-800" role="status">
      Data yang tampil berasal dari cache karena pembaruan terbaru gagal dimuat. {{ errorMessage }}
      <button type="button" class="ml-1 font-bold underline underline-offset-2" @click="fetchMentorData(true)">Coba perbarui</button>
    </p>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftEllipsisIcon,
  EnvelopeIcon,
} from '@heroicons/vue/24/outline'

type Mentor = {
  id?: string | number | null
  fullname?: string | null
  username?: string | null
  bio?: string | null
  pekerjaan?: string | null
  instansi?: string | null
  job?: string | null
  institution?: string | null
  avatar_url?: string | null
  whatsapp?: string | null
  email?: string | null
  /** Optional URL provided by the API for WhatsApp contact. */
  contactWhatsApp?: string | boolean | null
  /** Optional contact flag or email address provided by the API. */
  contactEmail?: string | boolean | null
  [key: string]: unknown
}

const emit = defineEmits<{
  (e: 'feedback-count-updated', count: number): void
}>()

const supabase = useSupabaseClient()
const supabaseUser = useSupabaseUser()
const { profile, fetchProfile } = useUserProfile()

const CACHE_MENTORS_KEY = 'px_cached_mentors'
const isLoading = ref(false)
const errorMessage = ref('')
const mentors = ref<Mentor[]>([])
const failedAvatars = ref(new Set<string>())

// Initialize from session cache to avoid an empty screen on repeat visits.
if (import.meta.client) {
  try {
    const raw = sessionStorage.getItem(CACHE_MENTORS_KEY)
    if (raw) {
      const parsed: unknown = JSON.parse(raw)
      if (Array.isArray(parsed)) mentors.value = parsed as Mentor[]
    }
  } catch (error) {
    console.warn('Cache mentor tidak dapat dibaca:', error)
  }
}

function getPekerjaan(mentor: Mentor) {
  return (mentor.pekerjaan || mentor.job || 'Mentor Pengampu').toString().trim()
}

function getInstansi(mentor: Mentor) {
  return (mentor.instansi || mentor.institution || 'Pixelnoid Academy').toString().trim()
}

const studentName = computed(() =>
  profile.value?.fullname ||
  supabaseUser.value?.user_metadata?.full_name ||
  supabaseUser.value?.user_metadata?.name ||
  'Siswa Pixelnoid',
)

async function fetchMentorData(silent = false) {
  if (!silent || mentors.value.length === 0) isLoading.value = true
  errorMessage.value = ''

  try {
    const { data: { session } } = await supabase.auth.getSession()
    const headers: Record<string, string> = {}
    if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`

    const response = await $fetch<{ mentors?: Mentor[]; allStudentReviews?: unknown[] }>(
      '/api/student/mentors',
      { headers },
    )

    mentors.value = Array.isArray(response.mentors) ? response.mentors : []
    emit('feedback-count-updated', mentors.value.length)

    if (import.meta.client) {
      try {
        sessionStorage.setItem(CACHE_MENTORS_KEY, JSON.stringify(mentors.value))
      } catch (error) {
        console.warn('Cache mentor tidak dapat disimpan:', error)
      }
    }
  } catch (error) {
    console.error('Gagal mengambil data mentor:', error)
    errorMessage.value = 'Periksa koneksi internet atau coba muat ulang halaman.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  void fetchProfile()
  void fetchMentorData(mentors.value.length > 0)
})

function getMentorKey(mentor: Mentor) {
  return String(mentor.id ?? mentor.username ?? mentor.fullname ?? 'mentor')
}

function markAvatarFailed(mentor: Mentor) {
  failedAvatars.value = new Set([...failedAvatars.value, getMentorKey(mentor)])
}

function getInitials(fullname?: string | null) {
  const words = (fullname || 'Mentor').trim().split(/\s+/).filter(Boolean)
  return words.slice(0, 2).map((word) => word.charAt(0).toUpperCase()).join('') || 'M'
}

function normalizePhone(phone?: string | null) {
  if (!phone) return ''
  let digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`
  return digits
}

function formatPhoneNumber(phone?: string | null) {
  const digits = normalizePhone(phone)
  if (!digits) return null
  if (digits.startsWith('62') && digits.length >= 10) {
    return `+62 ${digits.slice(2, 5)}-${digits.slice(5, 9)}-${digits.slice(9)}`
  }
  return `+${digits}`
}

function getWhatsAppLink(mentor: Mentor) {
  const providedContact = typeof mentor.contactWhatsApp === 'string' ? mentor.contactWhatsApp.trim() : ''
  // Respect a full URL returned by the API when no phone number is available.
  if (!mentor.whatsapp && /^https?:\/\//i.test(providedContact)) return providedContact

  const phone = normalizePhone(mentor.whatsapp)
  if (!phone) return '#'

  const message = `Halo Kak ${mentor.fullname || 'Mentor'}, perkenalkan saya ${studentName.value} dari Pixelnoid Academy. Saya ingin berkonsultasi mengenai materi atau tugas bimbingan.`
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

function getEmailLink(mentor: Mentor) {
  const email = (mentor.email || '').trim()
  const subject = encodeURIComponent(`[Konsultasi Pixelnoid] - ${studentName.value}`)
  const body = encodeURIComponent(
    `Halo Kak ${mentor.fullname || 'Mentor'},\n\nPerkenalkan saya ${studentName.value} dari Pixelnoid Academy. Saya ingin berkonsultasi mengenai materi atau tugas bimbingan.\n\nTerima kasih.`,
  )
  return `mailto:${email}?subject=${subject}&body=${body}`
}

function hasWhatsApp(mentor: Mentor) {
  const providedContact = typeof mentor.contactWhatsApp === 'string' ? mentor.contactWhatsApp.trim() : ''
  return Boolean(normalizePhone(mentor.whatsapp) || /^https?:\/\//i.test(providedContact))
}

function hasEmail(mentor: Mentor) {
  return Boolean((mentor.email || '').trim())
}
</script>