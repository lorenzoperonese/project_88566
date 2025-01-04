<script setup lang="ts">
const $props = defineProps({
  pomodoro: { type: Object as PropType<PomodoroEvent>, required: true },
  today: { type: Date, required: true },
  displayDate: { type: Date, required: false },
  fullDate: { type: Boolean, default: false }
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
  <NuxtLink :to="`/calendar/p/${$props.pomodoro.id}`">
    <div
      class="mt-1 cursor-pointer rounded bg-error-content p-1 text-xs text-error hover:bg-red-200"
      :class="{ 'opacity-60': isInPast }"
    >
      <div
        :class="[
          'font-semibold',
          { 'line-through': $props.pomodoro.cycles === 0 }
        ]"
        class="overflow-x-clip whitespace-nowrap"
      >
        {{ $props.pomodoro.title }}
      </div>
      <div class="hidden md:block">
        <div>
          🍅 {{ $props.pomodoro.study }} - {{ $props.pomodoro.break }} -
          {{ $props.pomodoro.cycles }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
