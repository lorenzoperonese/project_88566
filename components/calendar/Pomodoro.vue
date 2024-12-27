<script setup lang="ts">
const $props = defineProps({
  pomodoro: { type: Object as PropType<PomodoroEvent>, required: true },
  today: { type: Date, required: true },
  fullDate: { type: Boolean, default: false }
})
</script>

<template>
  <NuxtLink :to="`/calendar/p/${$props.pomodoro.id}`">
    <div
      class="mt-1 cursor-pointer rounded bg-primary-content p-1 text-xs text-accent hover:bg-blue-200"
      :class="{ 'opacity-60': isInThePastPomodoro($props.today, pomodoro) }"
    >
      <div
        :class="[
          'font-semibold',
          { 'line-through': $props.pomodoro.cycles === 0 }
        ]"
      >
        {{ $props.pomodoro.title }}
      </div>
      <div>
        <div>
          {{ formatDate($props.pomodoro.date) }}
        </div>
        <div>
          🍅 {{ $props.pomodoro.study }} - {{ $props.pomodoro.break }} -
          {{ $props.pomodoro.cycles }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
