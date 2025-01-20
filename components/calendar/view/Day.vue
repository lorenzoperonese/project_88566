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
        <template
          v-for="item in getAllItemsForDay($props.displayDate, $props)"
          :key="item.id"
        >
          <CalendarEvent
            v-if="item.type === 'event'"
            :event="item.originalItem as EventType"
            :today="$props.today"
            :is-responsive="false"
          />
          <CalendarEvent
            v-else-if="item.type === 'guest-event'"
            :event="item.originalItem as EventType"
            :today="$props.today"
            :guest="true"
            :is-responsive="false"
          />
          <CalendarTask
            v-else-if="item.type === 'task'"
            :task="item.originalItem as Task"
            :today="$props.today"
            :is-responsive="false"
          />
          <CalendarPomodoro
            v-else-if="item.type === 'pomodoro'"
            :pomodoro="item.originalItem as PomodoroEvent"
            :today="$props.today"
            :is-responsive="false"
          />
          <CalendarResource
            v-else-if="item.type === 'resource'"
            :resource="item.originalItem as Resource"
            :today="$props.today"
            :is-responsive="false"
          />
          <CalendarProject
            v-else-if="item.type === 'project'"
            :p-event="item.originalItem as ProjectEvent"
            :today="$props.today"
            :is-responsive="false"
          />
          <CalendarNotAvailable
            v-else-if="item.type === 'not-available'"
            :not-available="item.originalItem as NotAvailable"
            :today="$props.today"
            :is-responsive="false"
          />
          <CalendarNoteTask
            v-else-if="item.type === 'note-task'"
            :note-task="item.originalItem as NoteTask"
            :today="$props.today"
            :is-responsive="false"
          />
        </template>
      </div>
    </div>
  </div>
</template>
