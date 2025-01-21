<script setup lang="ts">
const updateSettings = ref(false)
provide('settings', updateSettings)
setThemeFromBackend()
</script>

<template>
  <NuxtPwaManifest />
  <div class="h-full">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
