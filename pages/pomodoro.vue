<script setup lang="ts">
definePageMeta({
  layout: 'navbar'
})

interface Timer {
  study: number
  break: number
  cycles: number
}

const showPropose = ref(false)
const isTimerRunning = ref(false)
const timer = ref<Timer>({
  study: 30,
  break: 5,
  cycles: 5
})

function handleProposalAccept(proposal: Timer) {
  timer.value = proposal
  showPropose.value = false
}

function handleTimerStart() {
  isTimerRunning.value = true
}

function handleTimerStop() {
  isTimerRunning.value = false
}
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="mb-6 text-center text-3xl font-bold">Pomodoro Timer</h1>

    <div v-if="!isTimerRunning" class="mb-4 text-center">
      <button class="btn btn-info" @click="showPropose = !showPropose">
        {{ showPropose ? 'Imposta manualmente' : 'Proponi un Pomodoro' }}
      </button>
    </div>

    <PomodoroPropose
      v-if="showPropose && !isTimerRunning"
      @accept="handleProposalAccept"
    />
    <PomodoroForm
      v-else
      :timer="timer"
      @start="handleTimerStart"
      @stop="handleTimerStop"
    />
  </div>
</template>
