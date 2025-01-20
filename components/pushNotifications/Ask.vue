<script setup lang="ts">
interface ntp {
  wait: boolean
  date: number
}

const $emits = defineEmits(['update'])

const show = ref(false)

onMounted(async () => {
  const ntPerm = await storageGetItem('ntPerm')
  if (!ntPerm) {
    show.value = true
    return
  }

  const { wait, date } = JSON.parse(ntPerm) as ntp
  if (wait && Date.now() - date > 1000 * 60 * 60 * 24) {
    show.value = true
  }
})

async function handleAllow() {
  try {
    await requestNotificationPermission()
    registerPush()

    startServiceWorker()
  } catch (e) {
    console.error(e)
  }

  show.value = false
  $emits('update')
}

async function handleDeny() {
  const ntPerm: ntp = {
    wait: true,
    date: Date.now()
  }

  await storageSetItem('ntPerm', JSON.stringify(ntPerm))
  show.value = false
  $emits('update')
}
</script>

<template>
  <div
    v-if="show"
    class="fixed bottom-4 right-4 w-full max-w-xs transform overflow-hidden rounded-lg bg-base-300 shadow-lg transition-all duration-300 ease-in-out hover:scale-105 md:max-w-sm"
  >
    <div class="p-4">
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg
            id="_x32_"
            class="h-6 w-6 fill-info"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
            xml:space="preserve"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <g>
                <path
                  class="st0"
                  d="M193.499,459.298c5.237,30.54,31.518,52.702,62.49,52.702c30.98,0,57.269-22.162,62.506-52.702l0.32-1.86 H193.179L193.499,459.298z"
                ></path>
                <path
                  class="st0"
                  d="M469.782,371.98c-5.126-5.128-10.349-9.464-15.402-13.661c-21.252-17.648-39.608-32.888-39.608-96.168v-50.194 c0-73.808-51.858-138.572-123.61-154.81c2.876-5.64,4.334-11.568,4.334-17.655C295.496,17.718,277.777,0,255.995,0 c-21.776,0-39.492,17.718-39.492,39.492c0,6.091,1.456,12.018,4.334,17.655c-71.755,16.238-123.61,81.002-123.61,154.81v50.194 c0,63.28-18.356,78.521-39.608,96.168c-5.052,4.196-10.276,8.533-15.402,13.661l-0.466,0.466v49.798h428.496v-49.798 L469.782,371.98z"
                ></path>
              </g>
            </g>
          </svg>
          <h2 class="text-xl font-semibold">Enable Notifications</h2>
        </div>
        <button
          class="transition-colors duration-200"
          aria-label="Close notification"
          @click="handleDeny"
        ></button>
      </div>
      <p class="mb-4">
        Stay updated with important alerts and never miss out on crucial
        information.
      </p>
      <div class="flex justify-between space-x-2">
        <button class="btn btn-neutral" @click="handleDeny">Maybe Later</button>
        <button class="btn btn-info" @click="handleAllow">Allow</button>
      </div>
    </div>
  </div>
</template>
