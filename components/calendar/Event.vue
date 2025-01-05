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
        <div>{{ formatTime(event.start) }} - {{ formatTime(event.end) }}</div>
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
