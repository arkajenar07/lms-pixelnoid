<template>
  <div />
</template>

<script setup lang="ts">
/**
 * pages/index.vue
 * Root redirect:
 * - Sudah login → /student
 * - Belum login → /login
 */
definePageMeta({ layout: false })

const user = useSupabaseUser()
await navigateTo(user.value ? '/student' : '/login', { replace: true })
</script>
