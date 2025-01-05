<script setup lang="ts">
const $props = defineProps({
  pEvent: { type: Object as PropType<ProjectEvent>, required: true },
  today: { type: Date, required: true },
  displayDate: { type: Date, required: false },
  isResponsive: { type: Boolean, default: true }
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
      <div class="overflow-x-clip whitespace-nowrap text-xs font-semibold">
        {{ pEvent.task_name }}
      </div>
      <div :class="{ 'hidden md:block': $props.isResponsive }">
        <div :class="{ 'hidden lg:block': $props.isResponsive }">
          {{ pEvent.project_name }}
        </div>
        <div>{{ formatTime(pEvent.start) }} - {{ formatTime(pEvent.end) }}</div>
      </div>
    </div>
  </NuxtLink>
</template>
