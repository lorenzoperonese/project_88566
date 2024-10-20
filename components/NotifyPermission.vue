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

async function sendTest() {
  const SW = await navigator.serviceWorker.getRegistration()
  if (SW === undefined) {
    console.error('Service worker is undefined')
    return
  }

  if (SW.active === null) {
    console.error('Service worker is NOT active')
    return
  }

  //SW.active.postMessage('Provolone')

  fetch('/api/notify')
}
</script>

<template>
  <div>
    <button
      v-if="permission == 'default'"
      class="btn btn-accent"
      @click="enable()"
    >
      Enable notifications
    </button>

    <div v-if="permission == 'granted'">
      <div class="text-accent">Notifications are enabled :)</div>

      <button class="btn btn-warning mt-2" @click="sendTest()">
        Send test
      </button>
    </div>

    <div v-if="permission == 'denied'" class="text-error">
      Notifications are disabled :(
    </div>
  </div>
</template>
