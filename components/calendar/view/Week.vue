<script setup lang="ts">
const $props = defineProps<{
  events: EventType[] | null
  eventsGuest: EventType[] | null
  tasks: Task[] | null
  displayDate: Date
  today: Date
  weekDays: Date[]
}>()
</script>

<template>
  <div class="grid flex-grow grid-cols-7 gap-1 bg-base-200 p-2">
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
          'bg-base-100': !isToday2($props.today, day),
          'bg-base-200': isToday2($props.today, day)
        }"
      >
        <NuxtLink
          v-for="event in getEventsForDay2($props.events, day)"
          :key="event.id"
          :to="`/calendar/e/${event.id}`"
        >
          <div
            class="mt-1 w-full cursor-pointer rounded bg-primary-content p-1 text-xs text-primary hover:bg-blue-200"
            :class="{ 'opacity-60': isEventInThePast($props.today, event) }"
          >
            <div class="font-semibold">{{ event.title }}</div>
            <div>
              {{ formatTime(event.start) }} - {{ formatTime(event.end) }}
            </div>
          </div>
        </NuxtLink>

        <NuxtLink
          v-for="task in getTasksForDay2($props.tasks, day)"
          :key="task.id"
          :to="`/calendar/t/${task.id}`"
        >
          <div
            class="mt-1 cursor-pointer rounded bg-primary-content p-1 text-xs text-accent hover:bg-blue-200"
          >
            <div :class="['font-semibold', { 'line-through': task.completed }]">
              {{ task.title }}
            </div>
            <div>{{ formatTime(task.end) }}</div>
            <div>{{ formatTime(task.end) }}</div>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
