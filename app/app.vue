<template>
  <div class="min-h-screen bg-[#FAFAFA]">
    <!-- Top Progress Bar: Aktif otomatis saat memuat halaman -->
    <NuxtLoadingIndicator
      color="repeating-linear-gradient(to right, #443E8D 0%, #6366F1 50%, #8B5CF6 100%)"
      :height="3"
      :duration="2000"
      :throttle="100"
    />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>