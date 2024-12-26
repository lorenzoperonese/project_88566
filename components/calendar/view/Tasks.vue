<script setup lang="ts">
const $props = defineProps<{
  eventsGuest: EventType[] | null
  tasks: Task[] | null
  displayDate: Date
  today: Date
}>()

const tasks = computed(() => {
  return $props.tasks?.sort((a, b) => {
    return a.end - b.end
  })
})
</script>

<template>
  <div class="flex-grow bg-base-200 p-2">
    <div class="flex h-full flex-col">
      <div class="p-2 text-center font-bold">Tasks</div>
      <div class="flex-grow overflow-y-auto bg-base-200 p-2">
        <template v-for="task in tasks" :key="task.id">
          <CalendarTask :task="task" :today="$props.today" :full-date="true" />
        </template>
      </div>
    </div>
  </div>
</template>
