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
  <div class="grid flex-grow grid-cols-7 bg-base-200 md:gap-1 md:p-2">
    <div
      v-for="(day, index) in $props.weekDays"
      :key="index"
      class="flex flex-col"
    >
      <div class="p-2 text-center text-xs font-bold md:text-base">
        {{ day.toLocaleDateString('en-US', { weekday: 'short' }) }}
        <br />
        {{ day.getDate() }}
      </div>
      <div
        class="flex-grow overflow-y-auto border border-base-200 md:p-2"
        :class="{
          'bg-base-100': !isToday($props.today, day),
          'bg-base-200': isToday($props.today, day)
        }"
      >
        <template v-for="item in getAllItemsForDay(day, $props)" :key="item.id">
          <CalendarEvent
            v-if="item.type === 'event'"
            :event="item.originalItem as EventType"
            :today="$props.today"
          />
          <CalendarEvent
            v-else-if="item.type === 'guest-event'"
            :event="item.originalItem as EventType"
            :today="$props.today"
            :guest="true"
          />
          <CalendarTask
            v-else-if="item.type === 'task'"
            :task="item.originalItem as Task"
            :today="$props.today"
          />
          <CalendarPomodoro
            v-else-if="item.type === 'pomodoro'"
            :pomodoro="item.originalItem as PomodoroEvent"
            :today="$props.today"
          />
          <CalendarResource
            v-else-if="item.type === 'resource'"
            :resource="item.originalItem as Resource"
            :today="$props.today"
          />
          <CalendarProject
            v-else-if="item.type === 'project'"
            :p-event="item.originalItem as ProjectEvent"
            :today="$props.today"
          />
          <CalendarNotAvailable
            v-else-if="item.type === 'not-available'"
            :not-available="item.originalItem as NotAvailable"
            :today="$props.today"
          />
          <CalendarNoteTask
            v-else-if="item.type === 'note-task'"
            :note-task="item.originalItem as NoteTask"
            :today="$props.today"
          />
        </template>
      </div>
    </div>
  </div>
</template>
