<script setup lang="ts">
const { $toast } = useNuxtApp()

const $emits = defineEmits<{
  (e: 'update'): void
}>()

const { data: _notifications } =
  await useFetch<Notification[]>('/api/notifications')

const _notifications_unread = computed(() => {
  if (_notifications.value) return _notifications.value.filter((n) => !n.read)
  else return []
})

async function fetchNotifications() {
  try {
    const tmp = await $fetch('/api/notifications')
    _notifications.value = tmp as Notification[]
  } catch (error) {
    $toast.error('Error getting notifications')
  }
}

async function readNotification(id: string) {
  const res = await setNotificationAsRead(id)

  if (res.status === 'error') {
    $toast.error(res.err)
  }

  $emits('update')

  fetchNotifications()
}
</script>

<template>
  <div>
    <ul class="flex flex-col gap-2">
      <div v-for="n in _notifications_unread" :key="n.id" class="flex">
        <li>
          <a class="flex flex-col" :class="{ 'opacity-70': n.read }">
            <div class="w-full text-left font-bold">
              {{ n.title }}
            </div>
            <div class="w-full text-left">
              {{ n.body }}
            </div>
          </a>
        </li>

        <li class="text-neutral-content" @click="readNotification(n.id)">
          <a class="flex h-full w-full items-center justify-center">
            <svg
              class="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke="currentColor"
                d="M5 14L8.23309 16.4248C8.66178 16.7463 9.26772 16.6728 9.60705 16.2581L18 6"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </a>
        </li>
      </div>

      <div
        class="flex justify-center p-2"
        v-show="_notifications_unread.length == 0"
      >
        Inbox empty
      </div>
    </ul>
  </div>
</template>
