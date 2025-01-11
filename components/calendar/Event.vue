<script setup lang="ts">
const $props = defineProps({
  event: { type: Object as PropType<EventType>, required: true },
  today: { type: Date, required: true },
  displayDate: { type: Date, required: false },
  guest: { type: Boolean, default: false },
  isResponsive: { type: Boolean, default: true }
})

const isInPast = computed(() => {
  if ($props.displayDate) {
    return isInThePast($props.today, $props.displayDate)
  } else {
    return false
  }
})

const timeFrame = computed(() => {
  if (
    $props.event.end - $props.event.start <= 24 * 60 * 60 * 1000 ||
    $props.displayDate === undefined
  ) {
    return `${formatTime($props.event.start)} - ${formatTime($props.event.end)}`
  }

  if (
    !(
      isToday(new Date($props.event.start), $props.displayDate) ||
      isToday(new Date($props.event.end), $props.displayDate)
    )
  ) {
    return 'All day'
  }

  if (isToday(new Date($props.event.start), $props.displayDate)) {
    return `${formatTime($props.event.start)} - 23:59`
  } else if (isToday(new Date($props.event.end), $props.displayDate)) {
    return `00:00 - ${formatTime($props.event.end)}`
  }

  return `${formatTime($props.event.start)} - ${formatTime($props.event.end)}`
})
</script>

<template>
  <NuxtLink
    :to="guest ? `/calendar/e/guest/${event.id}` : `/calendar/e/${event.id}`"
  >
    <div
      class="mt-1 w-full cursor-pointer rounded bg-primary-content p-1 text-xs text-primary hover:bg-blue-200"
      :class="{ 'opacity-60': isInPast }"
    >
      <div class="overflow-x-clip whitespace-nowrap text-xs font-semibold">
        {{ event.title }}
      </div>
      <div :class="{ 'hidden md:block': $props.isResponsive }">
        <div>{{ timeFrame }}</div>
        <div
          :class="{ 'hidden lg:block': $props.isResponsive }"
          class="overflow-x-clip"
        >
          <div v-if="event.location" class="whitespace-nowrap">
            📍 {{ event.location }}
          </div>
          <div v-if="event.category" class="whitespace-nowrap">
            🏷️ {{ event.category }}
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
