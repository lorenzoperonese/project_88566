<script setup lang="ts">
const status = ref('')
const _hours = ref(0)
const _minutes = ref(0)
const _seconds = ref(0)

const $props = defineProps<{
  settings: HomeSettings
}>()

const timeDisplay = computed(() => {
  const pad = (num: number) => num.toString().padStart(2, '0')
  return `${pad(_hours.value)}:${pad(_minutes.value)}:${pad(_seconds.value)}`
})

onMounted(() => {
  status.value = localStorage.getItem('pomodoro-status') || 'stopped'
  let timer = localStorage.getItem('pomodoro-timer')
  if (timer) {
    let timerp = JSON.parse(timer)
    _hours.value = timerp.h
    _minutes.value = timerp.m
    _seconds.value = timerp.s
  }
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div
      class="text-center text-lg font-bold"
      v-if="status != 'stopped' && $props.settings.pomodoroShowTimeIfPaused"
    >
      {{ timeDisplay }}
    </div>
    <div class="text-center font-bold">
      {{ status }}
    </div>
  </div>
</template>
