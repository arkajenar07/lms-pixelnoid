<template>
  <div class="min-h-screen bg-[#F7F7F9] flex items-center justify-center">
    <div class="flex flex-col items-center gap-3">
      <div class="w-8 h-8 border-2 border-[#443E8D] border-t-transparent rounded-full animate-spin"></div>
      <p class="text-sm text-[#71717A] font-medium">Mengarahkan ke Sumber Daya Kelas...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

onMounted(() => {
  navigateTo('/student/class?tab=resources', { replace: true })
})
</script>
