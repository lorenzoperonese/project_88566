<script setup lang="ts">
const $props = defineProps<{
  events: EventType[] | null
  eventsGuest: EventType[] | null
  tasks: Task[] | null
  pomodoro: PomodoroEvent[] | null
  resources: Resource[] | null
  projects: ProjectEvent[] | null
  notAvailable: NotAvailable[] | null
  noteTasks: NoteTask[] | null
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
          'bg-base-100': !isToday($props.today, day),
          'bg-base-200': isToday($props.today, day)
        }"
      >
        <CalendarEvent
          v-for="event in getEventsForDay($props.events, day)"
          :key="event.id"
          :event="event"
          :today="$props.today"
        />
        <CalendarEvent
          v-for="event in getEventsForDay($props.eventsGuest, day)"
          :key="event.id"
          :event="event"
          :today="$props.today"
          :guest="true"
        />

        <CalendarTask
          v-for="task in getTasksForDay($props.tasks, day)"
          :key="task.id"
          :task="task"
          :today="$props.today"
        />

        <CalendarPomodoro
          v-for="pomodoro in getPomodorosForDay($props.pomodoro, day)"
          :key="pomodoro.id"
          :pomodoro="pomodoro"
          :today="$props.today"
        />

        <CalendarResource
          v-for="resource in getResourcesForDay($props.resources, day)"
          :key="resource.id"
          :resource="resource"
          :today="$props.today"
        />

        <CalendarProject
          v-for="p in getProjectsForDay($props.projects, day)"
          :key="p.id"
          :pEvent="p"
          :today="$props.today"
        />

        <CalendarNotAvailable
          v-for="na in getNotAvailableForDay($props.notAvailable, day)"
          :key="na.id"
          :notAvailable="na"
          :today="$props.today"
        />

        <CalendarNoteTask
          v-for="nt in getNoteTasksForDay($props.noteTasks, day)"
          :key="nt.id"
          :noteTask="nt"
          :today="$props.today"
        />
      </div>
    </div>
  </div>
</template>
