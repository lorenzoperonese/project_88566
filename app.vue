<script setup lang="ts">
const updateSettings = ref(false)
provide('settings', updateSettings)
setThemeFromBackend()

// If we drop the db, all the subscriptions for the notifications will be lost.
// To partially solve this, if notifications are enabled, we will send the subscription to the server.

const { $registerPushNotifications } = useNuxtApp()

if (window.Notification.permission === 'granted') {
  try {
    const subscription = await $registerPushNotifications()
    console.log('Registered:', subscription)
  } catch (err) {
    console.error('Failed:', err)
  }
}
</script>

<template>
  <div class="h-full">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
