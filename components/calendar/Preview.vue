<script setup lang="ts">
const { data: _events } = await useFetch<EventType[]>('/api/events')
const { data: _tasks } = await useFetch<Task[]>('/api/tasks')
const today = await getToday()

const $props = defineProps<{
  settings: HomeSettings
}>()

const today_events = computed(() => {
  if (!_events.value) return []

  const tmp = _events.value.filter(
    (e) => new Date(e.start).toDateString() === today.toDateString()
  )
  return tmp
})

const today_tasks = computed(() => {
  if (!_tasks.value) return []

  const tmp = _tasks.value.filter(
    (t) => new Date(t.end).toDateString() === today.toDateString()
  )
  return tmp
})

const empty = computed(
  () => today_events.value.length === 0 && today_tasks.value.length === 0
)
</script>

<template>
  <div class="flex flex-col">
    <div
      v-if="
        $props.settings.calendarFilter == 'all' ||
        $props.settings.calendarFilter == 'events'
      "
    >
      <CalendarEvent
        v-for="e in today_events"
        :key="e.id"
        :event="e"
        :today="today"
      />
    </div>
    <div
      v-if="
        $props.settings.calendarFilter == 'all' ||
        $props.settings.calendarFilter == 'tasks'
      "
    >
      <CalendarTask
        v-for="t in today_tasks"
        :key="t.id"
        :task="t"
        :today="today"
      />
    </div>
    <div v-if="empty" class="text-center">Today is free</div>
  </div>
</template>
