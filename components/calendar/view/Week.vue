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
        <CalendarEvent
          v-for="event in getEventsForDay2($props.events, day)"
          :key="event.id"
          :event="event"
          :today="$props.today"
        />

        <CalendarTask
          v-for="task in getTasksForDay2($props.tasks, day)"
          :key="task.id"
          :task="task"
          :today="$props.today"
        />
      </div>
    </div>
  </div>
</template>
