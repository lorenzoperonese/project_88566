<script setup lang="ts">
const $props = defineProps({
  event: { type: Object as PropType<EventType>, required: true },
  today: { type: Date, required: true }
})
</script>

<template>
  <NuxtLink :to="`/calendar/e/${event.id}`">
    <div
      class="mt-1 w-full cursor-pointer rounded bg-primary-content p-1 text-xs text-primary hover:bg-blue-200"
      :class="{ 'opacity-60': isInThePast($props.today, event) }"
    >
      <div class="font-semibold">{{ event.title }}</div>
      <div>{{ formatTime(event.start) }} - {{ formatTime(event.end) }}</div>
      <div v-if="event.location">📍 {{ event.location }}</div>
      <div v-if="event.category">🏷️ {{ event.category }}</div>
    </div>
  </NuxtLink>
</template>
