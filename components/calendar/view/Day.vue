<script setup lang="ts">
const $props = defineProps<{
  events: EventType[] | null
  eventsGuest: EventType[] | null
  tasks: Task[] | null
  pomodoro: PomodoroEvent[] | null
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
          'bg-base-100': !isToday($props.displayDate, $props.today),
          'bg-base-200': isToday($props.displayDate, $props.today)
        }"
      >
        <CalendarEvent
          v-for="event in getEventsForDay($props.events, $props.displayDate)"
          :key="event.id"
          :event="event"
          :today="$props.today"
        />
        <CalendarEvent
          v-for="event in getEventsForDay(
            $props.eventsGuest,
            $props.displayDate
          )"
          :key="event.id"
          :event="event"
          :today="$props.today"
          :guest="true"
        />

        <CalendarTask
          v-for="task in getTasksForDay($props.tasks, $props.displayDate)"
          :key="task.id"
          :task="task"
          :today="$props.today"
        />

        <CalendarPomodoro
          v-for="pomodoro in getPomodorosForDay(
            $props.pomodoro,
            $props.displayDate
          )"
          :key="pomodoro.id"
          :pomodoro="pomodoro"
          :today="$props.today"
        />
      </div>
    </div>
  </div>
</template>
