<script setup lang="ts">
const { data: _notifications } =
  await useFetch<Notification[]>('/api/notifications')

const { $toast } = useNuxtApp()

async function send() {
  console.log('Sending notification')
  const res = await sendNotification(
    'Hello world',
    'This is the body of the hello world',
    'lollo'
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
      Send notification
    </button>

    <div>
      <div v-for="n in _notifications" :key="n.id">
        {{ n }}
      </div>
    </div>
  </div>
</template>
