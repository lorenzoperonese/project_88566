<script setup lang="ts">
const $props = defineProps({
  pEvent: { type: Object as PropType<ProjectEvent>, required: true },
  today: { type: Date, required: true },
  displayDate: { type: Date, required: false }
})

const isInPast = computed(() => {
  if ($props.displayDate) {
    return isInThePast($props.today, $props.displayDate)
  } else {
    return false
  }
})
</script>

<template>
  <NuxtLink :to="`/projects/${pEvent.project_id}`">
    <div
      class="mt-1 w-full cursor-pointer rounded bg-warning-content p-1 text-xs text-warning hover:bg-blue-200"
      :class="{ 'opacity-60': isInPast }"
    >
      <div class="font-semibold">{{ pEvent.task_name }}</div>
      <div class="">{{ pEvent.project_name }}</div>
      <div>{{ formatTime(pEvent.start) }} - {{ formatTime(pEvent.end) }}</div>
    </div>
  </NuxtLink>
</template>
