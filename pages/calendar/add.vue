<script setup lang="ts">
import { CalendarEventAdder, CalendarTaskAdder } from '#components'
const addTask = ref(false)

const eventOrTask = computed(() => {
  return addTask.value ? CalendarTaskAdder : CalendarEventAdder
})
</script>

<template>
  <div>
    <div role="tablist" class="tabs-boxed tabs">
      <a
        role="tab"
        class="tab"
        :class="{ 'tab-active': !addTask }"
        @click="addTask = false"
        >Tab 1</a
      >
      <a
        role="tab"
        class="tab"
        :class="{ 'tab-active': addTask }"
        @click="addTask = true"
        >Tab 2</a
      >
    </div>

    <div class="flex justify-center">
      <component :is="eventOrTask" class="h-full"> </component>
    </div>
  </div>
</template>
