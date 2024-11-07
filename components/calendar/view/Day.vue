<script setup lang="ts">
const $props = defineProps<{
  events: EventType[] | null
  eventsGuest: EventType[] | null
  tasks: Task[] | null
  displayDate: Date
  today: Date
}>()
</script>

<template>
  <div class="flex-grow bg-base-200 p-2">
    <div class="flex h-full flex-col">
      <div class="p-2 text-center font-bold">
        {{
          `${days[$props.displayDate.getDay()]}, ${$props.displayDate.getDate()} ${months[$props.displayDate.getMonth()]}
        ${$props.displayDate.getFullYear()}`
        }}
      </div>
      <div
        class="flex-grow overflow-y-auto p-2"
        :class="{
          'bg-base-100': !isToday2($props.displayDate, $props.today),
          'bg-base-200': isToday2($props.displayDate, $props.today)
        }"
      >
        <NuxtLink
          v-for="event in getEventsForDay2($props.events, $props.displayDate)"
          :key="event.id"
          :to="`/calendar/e/${event.id}`"
        >
          <div
            class="mt-1 w-full cursor-pointer rounded bg-primary-content p-2 text-sm text-primary hover:bg-blue-200"
            :class="{ 'opacity-60': isEventInThePast($props.today, event) }"
          >
            <div class="font-semibold">{{ event.title }}</div>
            <div>
              {{ formatTime(event.start) }} - {{ formatTime(event.end) }}
            </div>
            <div v-if="event.location">📍 {{ event.location }}</div>
            <div v-if="event.category">🏷️ {{ event.category }}</div>
          </div>
        </NuxtLink>

        <NuxtLink
          v-for="task in getTasksForDay2($props.tasks, $props.displayDate)"
          :key="task.id"
          :to="`/calendar/t/${task.id}`"
        >
          <div
            class="mt-1 cursor-pointer rounded bg-primary-content p-2 text-sm text-accent hover:bg-blue-200"
          >
            <div :class="['font-semibold', { 'line-through': task.completed }]">
              {{ task.title }}
            </div>
            <div>{{ formatTime(task.end) }}</div>
            <div v-if="task.category">🏷️ {{ task.category }}</div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
