<script setup lang="ts">
import { CalendarEventAdder, CalendarTaskAdder } from '#components'
const addTask = ref(false)

const eventOrTask = computed(() => {
  return addTask.value ? CalendarTaskAdder : CalendarEventAdder
})
</script>

<template>
  <div>
    <div class="flex w-full justify-between">
      <button
        class="w-full rounded border p-2 hover:bg-blue-200 disabled:bg-blue-400"
        :disabled="!addTask"
        @click="addTask = false"
      >
        Event
      </button>
      <button
        class="w-full rounded border p-2 hover:bg-blue-200 disabled:bg-blue-400"
        :disabled="addTask"
        @click="addTask = true"
      >
        Task
      </button>
    </div>
    <div class="flex justify-center">
      <component :is="eventOrTask" class="h-full"> </component>
    </div>
  </div>
</template>
