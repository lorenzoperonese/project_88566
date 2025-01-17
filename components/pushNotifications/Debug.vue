<script setup lang="ts">
const permission = ref(window.Notification?.permission)

async function enable() {
  try {
    permission.value = await requestNotificationPermission()
    registerPush()

    startServiceWorker()
  } catch (e) {
    console.error(e)
  }
}

async function sendRemoteTest() {
  let SW = await navigator.serviceWorker.getRegistration()
  if (SW === undefined) {
    await startServiceWorker()

    // Wait a little bit for service worker to start
    await new Promise((r) => setTimeout(r, 2000))
    SW = await navigator.serviceWorker.getRegistration()
    if (SW === undefined) {
      console.error('Service worker is undefined')
      return
    }
  }

  if (SW.active === null) {
    console.error('Service worker is NOT active')
    return
  }

  //SW.active.postMessage('Provolone')

  await $fetch('/api/notify')
}

function sendLocalTest() {
  postMessageToWoker({
    title: 'Local test',
    body: 'This is a local test'
  })
}
</script>

<template>
  <div>
    <button
      v-if="permission == 'default'"
      class="btn btn-outline btn-accent"
      @click="enable()"
    >
      Enable notifications
    </button>

    <div v-if="permission == 'granted'">
      <div class="text-success">Notifications are enabled :)</div>

      <div class="flex justify-between">
        <button
          class="btn btn-outline btn-primary mt-2"
          @click="sendLocalTest()"
        >
          Send local test
        </button>

        <button
          class="btn btn-outline btn-secondary mt-2"
          @click="sendRemoteTest()"
        >
          Send remote test
        </button>
      </div>
    </div>

    <div v-if="permission == 'denied'" class="text-error">
      Notifications are disabled :(
    </div>
  </div>
</template>
