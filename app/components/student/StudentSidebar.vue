<template>
  <!-- ── Mobile Backdrop ── -->
  <Transition name="fade">
    <div 
      v-if="open" 
      class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[150] min-[901px]:hidden"
      @click="emit('update:open', false)"
    ></div>
  </Transition>

  <!-- ── Sidebar ── -->
  <aside 
    class="fixed top-0 left-0 bottom-0 w-[210px] bg-[#0F172A] z-[200] flex flex-col transition-transform duration-300 ease-in-out min-[901px]:translate-x-0 shadow-2xl min-[901px]:shadow-none"
    :class="open ? 'translate-x-0' : '-translate-x-full'"
  >
    <!-- Logo Section -->
    <div class="px-6 py-8 border-b border-white/5 flex items-center justify-center">
      <NuxtLink to="/" class="block group">
        <img 
          src="~/assets/images/logo-pc.png" 
          alt="PixelNoid Logo" 
          class="h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 brightness-0 invert" 
        />
      </NuxtLink>
    </div>

    <!-- Nav Section -->
    <nav class="flex-1 overflow-y-auto px-4 py-8 flex flex-col gap-1 custom-scrollbar">
      <div class="px-3 mb-4 flex items-center justify-between">
        <span class="text-[0.625rem] font-black text-gray-600 uppercase tracking-[0.2em]">Main Menu</span>
      </div>

      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="group flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden"
        :class="currentPath === item.to || currentPath.startsWith(item.to + '/') 
          ? 'bg-gradient-to-r from-indigo-500/10 to-transparent text-white' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'"
        @click="emit('update:open', false)"
      >
        <!-- Active Indicator -->
        <div 
          v-if="currentPath === item.to || currentPath.startsWith(item.to + '/')"
          class="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"
        ></div>

        <div class="flex-shrink-0 transition-transform group-hover:scale-110" :class="currentPath === item.to || currentPath.startsWith(item.to + '/') ? 'text-indigo-400' : 'text-gray-500 group-hover:text-gray-300'">
          <component :is="item.icon" class="w-5 h-5 stroke-[1.5]" />
        </div>
        
        <span class="flex-1 text-[0.9375rem] font-medium tracking-tight">{{ item.label }}</span>
        
        <span v-if="item.badge" class="px-2 py-0.5 rounded-md bg-indigo-500 text-white text-[0.625rem] font-black shadow-lg shadow-indigo-500/20">
          {{ item.badge }}
        </span>
      </NuxtLink>
    </nav>

    <!-- User Profile Section -->
    <div class="p-4 border-t border-white/5 bg-black/20">
      <div class="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 transition-all hover:bg-white/[0.08]">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[#443E8D] to-indigo-600 flex items-center justify-center text-white text-sm font-black shadow-lg shadow-indigo-900/20">
          {{ userInitials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-[0.8125rem] font-bold text-white truncate leading-tight">{{ userName }}</p>
          <p class="text-[0.625rem] font-medium text-gray-500 truncate mt-0.5">@{{ userUsername }} · {{ userRole }}</p>
        </div>
        <button 
          class="p-2 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-400/10 transition-all group"
          title="Logout"
          @click="handleLogout"
        >
          <ArrowRightOnRectangleIcon class="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Squares2X2Icon,
  BookOpenIcon,
  ClipboardDocumentCheckIcon,
  PresentationChartBarIcon,
  ChatBubbleLeftRightIcon,
  VideoCameraIcon,
  BriefcaseIcon,
  Square3Stack3DIcon,
  BellIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'logout'): void
}>()

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { profile, fetchProfile } = useUserProfile()

onMounted(() => {
  fetchProfile()
})

const handleLogout = async () => {
  await supabase.auth.signOut()
  emit('logout')
  navigateTo('/login')
}

const userName = computed(() => {
  return profile.value?.fullname || user.value?.user_metadata?.full_name || user.value?.user_metadata?.name || user.value?.email?.split('@')[0] || 'Guest'
})

const userUsername = computed(() => {
  return profile.value?.username || user.value?.user_metadata?.username || user.value?.email?.split('@')[0] || 'guest'
})

const userRole = computed(() => {
  const roles = profile.value?.roles || user.value?.user_metadata?.role
  if (Array.isArray(roles) && roles.length > 0) return roles[0].charAt(0).toUpperCase() + roles[0].slice(1)
  return 'Student'
})

const userInitials = computed(() => {
  const name = userName.value
  const names = name.split(/[\s@_.-]+/)
  if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase()
  return (name[0] || 'U').toUpperCase()
})

const route = useRoute()
const currentPath = computed(() => route.path)

const navItems = [
  { to: '/student/', label: 'Dashboard', icon: Squares2X2Icon, badge: null },
  { to: '/student/class', label: 'Kelas', icon: BookOpenIcon, badge: null },
  { to: '/student/aktivitas', label: 'Aktivitas', icon: ClipboardDocumentCheckIcon, badge: '3' },
  { to: '/student/notifications', label: 'Notifikasi', icon: BellIcon, badge: '5' },
]
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.05); border-radius: 10px; }
.custom-scrollbar:hover::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

