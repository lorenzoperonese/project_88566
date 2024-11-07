<script setup lang="ts">
const { $toast } = useNuxtApp()

const user = ref('')

async function send() {
  console.log('Sending notification')
  const res = await sendNotification(
    'Hello world',
    'This is the body of the hello world',
    user.value
  )

  if (res.status === 'error') {
    $toast.error(res.err)
  } else {
    $toast.success('Notification sent')
  }
}
</script>

<template>
  <div>
    <button class="btn btn-outline btn-primary" @click="send">
      Send notification to other
    </button>

    <input
      v-model="user"
      type="text"
      class="input input-bordered"
      placeholder="user"
    />

    <!-- NotificationsList /-->
  </div>
</template>
