<script setup lang="ts">
const { $toast } = useNuxtApp()

const user = ref('')

async function send() {
  console.log('Sending notification')
  const res = await sendNotificationFront(
    'Hello world',
    'This is the body of the hello world',
    user.value,
    'basic',
    undefined
  )

  if (res.status === 'error') {
    $toast.error(res.err)
  } else {
    $toast.success('Notification sent')
  }
}
</script>

<template>
  <div class="flex flex-col justify-between gap-2 md:flex-row">
    <input
      v-model="user"
      type="text"
      class="input input-bordered placeholder:text-gray-600"
      placeholder="Username"
    />
    <button class="btn btn-outline btn-info btn-sm md:btn-md" @click="send">
      Send notification
    </button>
  </div>
</template>
