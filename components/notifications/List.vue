<script setup lang="ts">
const { $toast } = useNuxtApp()
import { wsState } from '@/utils/websocket'

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

function notificationLink(
  id: string,
  type: string,
  identifier: string | undefined
) {
  switch (type) {
    case 'event-invited':
      navigateTo(`/calendar/e/guest/${identifier}/accept`)
      break
    case 'task-created':
      navigateTo(`/calendar/t/${identifier}`)
      break
    case 'project-invited':
      navigateTo(`/projects/${identifier}/accept`)
      break
    case 'pomodoro-shared':
      const [study, breakTime, cycles] = identifier ? identifier.split(',') : []
      navigateTo(
        `/pomodoro/?study=${study}&break=${breakTime}&cycles=${cycles}`
      )
      break

    default:
      break
  }
}

watch(wsState.notifications, fetchNotifications)

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
  <div class="overflow-x-hidden">
    <ul class="flex flex-col gap-2">
      <div
        v-for="n in _notifications_unread"
        :key="n.id"
        class="flex justify-between"
      >
        <li
          @click="notificationLink(n.id, n.type, n.identifier)"
          class="flex-1"
        >
          <a
            class="flex max-w-64 flex-col md:max-w-72"
            :class="{ 'opacity-70': n.read }"
          >
            <div class="w-full truncate text-left font-bold">
              {{ n.title }}
            </div>
            <div class="w-full truncate text-left">
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

      <li v-show="_notifications_unread.length == 0" class="p-2 text-center">
        Inbox empty
      </li>
    </ul>
  </div>
</template>
