<script setup lang="ts">
const $props = defineProps<{
  events: EventType[] | null
  tasks: Task[] | null
  displayDate: Date
  today: Date
  weekDays: Date[]
}>()

function getEventsForDay(day: number): EventType[] {
  const date = new Date(
    $props.displayDate.getFullYear(),
    $props.displayDate.getMonth(),
    day
  )
  if (!$props.events) {
    return []
  }
  return $props.events
    .filter((e) => {
      const eventDate = new Date(e.start)
      return eventDate.toDateString() === date.toDateString()
    })
    .sort((a, b) => a.start - b.start)
}

function getTasksForDay(day: number): Task[] {
  const date = new Date(
    $props.displayDate.getFullYear(),
    $props.displayDate.getMonth(),
    day
  )
  if (!$props.tasks) {
    return []
  }
  return $props.tasks
    .filter((e) => {
      const taskDate = new Date(e.end)
      return taskDate.toDateString() === date.toDateString()
    })
    .sort((a, b) => a.end - b.end)
}

function isToday(day: number): boolean {
  const date = new Date(
    $props.displayDate.getFullYear(),
    $props.displayDate.getMonth(),
    day
  )
  return date.toDateString() === $props.today.toDateString()
}

function isEventInThePast(e: EventType): boolean {
  return e.end < $props.today.getTime()
}
</script>

<template>
  <div class="grid flex-grow grid-cols-7 gap-1 bg-gray-100 p-2">
    <div
      v-for="(day, index) in $props.weekDays"
      :key="index"
      class="flex flex-col"
    >
      <div class="p-2 text-center font-bold">
        {{ day.toLocaleDateString('en-US', { weekday: 'short' }) }}
        <br />
        {{ day.getDate() }}
      </div>
      <div
        class="flex-grow overflow-y-auto p-2"
        :class="{
          'bg-white': !isToday(day.getDate()),
          'bg-gray-200': isToday(day.getDate())
        }"
      >
        <NuxtLink
          v-for="event in getEventsForDay(day.getDate())"
          :key="event.id"
          :to="`/calendar/e/${event.id}`"
        >
          <div
            class="mt-1 w-full cursor-pointer rounded bg-blue-100 p-1 text-xs hover:bg-blue-200"
            :class="{ 'opacity-60': isEventInThePast(event) }"
          >
            <div class="font-semibold">{{ event.title }}</div>
            <div>
              {{ formatTime(event.start) }} - {{ formatTime(event.end) }}
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          v-for="task in getTasksForDay(day.getDate())"
          :key="task.id"
          :to="`/calendar/t/${task.id}`"
        >
          <div
            class="mt-1 cursor-pointer rounded bg-blue-100 p-1 text-xs hover:bg-blue-200"
          >
            <div :class="['font-semibold', { 'line-through': task.completed }]">
              {{ task.title }}
            </div>
            <div>{{ formatTime(task.end) }}</div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
