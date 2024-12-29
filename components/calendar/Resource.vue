<script setup lang="ts">
const $props = defineProps({
  resource: { type: Object as PropType<Resource>, required: true },
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
  <NuxtLink :to="`/calendar/r/${resource.id}`">
    <div
      class="mt-1 w-full cursor-pointer rounded bg-warning-content p-1 text-xs text-warning hover:bg-blue-200"
      :class="{ 'opacity-60': isInPast }"
    >
      <div class="font-semibold">{{ resource.title }}</div>
      <div>
        {{ formatTime(resource.start) }} - {{ formatTime(resource.end) }}
      </div>
    </div>
  </NuxtLink>
</template>
