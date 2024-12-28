<script setup lang="ts">
const updateSettings = ref(false)
provide('settings', updateSettings)
</script>

<template>
  <div class="h-full">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
