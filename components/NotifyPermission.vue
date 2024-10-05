<script setup lang="ts">
const permission = ref(window.Notification.permission)

async function requestNotificationPermission() {
  const permission = await window.Notification.requestPermission()
  // value of permission can be 'granted', 'default', 'denied'
  // granted: user has accepted the request
  // default: user has dismissed the notification permission popup by clicking on x
  // denied: user has denied the request.
  if (permission !== 'granted') {
    console.error('Permission not granted for Notification')
  }
  return permission
}

async function enable() {
  permission.value = await requestNotificationPermission()
}
</script>

<template>
  <div>
    <button
      v-if="permission == 'default'"
      class="rounded-lg border bg-yellow-200 p-2 hover:bg-yellow-400"
      @click="enable()"
    >
      Enable notifications
    </button>

    <div v-if="permission == 'granted'" class="text-green-700">
      Notifications are enabled :)
    </div>

    <div v-if="permission == 'denied'" class="text-red-400">
      Notifications are disabled :(
    </div>
  </div>
</template>
