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
        <CalendarEvent
          v-for="event in getEventsForDay2($props.events, $props.displayDate)"
          :key="event.id"
          :event="event"
          :today="$props.today"
        />

        <CalendarTask
          v-for="task in getTasksForDay2($props.tasks, $props.displayDate)"
          :key="task.id"
          :task="task"
          :today="$props.today"
        />
      </div>
    </div>
  </div>
</template>
