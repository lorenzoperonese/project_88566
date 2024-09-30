<script setup lang="ts">
import { CalendarEventAdder, CalendarTaskAdder } from '#components'
const addTask = ref(true)

const eventOrTask = computed(() => {
  if (addTask.value) {
    return CalendarTaskAdder
  } else {
    return CalendarEventAdder
  }
})
</script>

<template>
  <div>
    <div>
      <button
        class="rounded border p-2 disabled:text-gray-400"
        :disabled="!addTask"
        @click="addTask = false"
      >
        Event
      </button>
      <button
        class="rounded border p-2 disabled:text-gray-400"
        :disabled="addTask"
        @click="addTask = true"
      >
        Task
      </button>
    </div>
    <component :is="eventOrTask" class="h-full"> </component>
  </div>
</template>
