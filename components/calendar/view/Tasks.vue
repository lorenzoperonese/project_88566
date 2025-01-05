<script setup lang="ts">
const $props = defineProps<{
  eventsGuest: EventType[] | null
  tasks: Task[] | null
  noteTasks: NoteTask[] | null
  displayDate: Date
  today: Date
}>()
</script>

<template>
  <div class="flex-grow bg-base-200 p-2">
    <div class="flex h-full flex-col">
      <div class="p-2 text-center font-bold">Tasks</div>
      <div class="flex-grow overflow-y-auto bg-base-200 p-2">
        <template v-for="task in $props.tasks" :key="task.id">
          <CalendarTask
            :task="task"
            :today="$props.today"
            :full-date="true"
            :is-responsive="false"
          />
        </template>

        <template v-for="nt in $props.noteTasks" :key="nt.id">
          <CalendarNoteTask
            :noteTask="nt"
            :today="$props.today"
            :full-date="true"
            :is-responsive="false"
          />
        </template>
      </div>
    </div>
  </div>
</template>
