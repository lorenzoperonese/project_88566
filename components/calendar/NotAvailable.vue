<script setup lang="ts">
const $props = defineProps({
  notAvailable: { type: Object as PropType<NotAvailable>, required: true },
  today: { type: Date, required: true },
  displayDate: { type: Date, required: false },
  fullDate: { type: Boolean, default: false },
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
  <NuxtLink :to="`/calendar/n/${$props.notAvailable.id}`">
    <div
      class="mt-1 cursor-pointer rounded bg-warning-content p-1 text-xs text-neutral-300 hover:bg-yellow-100"
      :class="{ 'opacity-60': isInPast }"
    >
      <div class="overflow-x-clip whitespace-nowrap font-semibold">
        Not available
      </div>
      <div :class="{ 'hidden md:block': $props.isResponsive }">
        <div>
          {{ formatTime($props.notAvailable.start) }} -
          {{ formatTime($props.notAvailable.end) }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
