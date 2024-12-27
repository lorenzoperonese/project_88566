<script setup lang="ts">
definePageMeta({
  layout: 'navbar'
})

interface Timer {
  study: number
  break: number
  cycles: number
}

const _route = useRoute()

const showPropose = ref(false)
const isTimerRunning = ref(false)
const timer = ref<Timer>({
  study: 30,
  break: 5,
  cycles: 5
})

if (_route.query.id) {
  let tmp = await $fetch(`/api/pomodoro-events/${_route.query.id}`)
  if (tmp) {
    timer.value.study = tmp.study
    timer.value.break = tmp.break
    timer.value.cycles = tmp.cycles
  }
}

function handleProposalAccept(proposal: Timer) {
  timer.value = proposal
  showPropose.value = false
}

const animationState = ref<'study' | 'break' | 'stop'>('break')
const animationTimer = ref(30)

function handleTimerStart() {
  isTimerRunning.value = true
  animationState.value = 'study'
}

function handleTimerStop() {
  isTimerRunning.value = false
  animationState.value = 'stop'
}

function handleTimerPause() {
  animationState.value = 'break'
}
</script>

<template>
  <div>
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
        v-model="animationTimer"
        :timer="timer"
        @start="handleTimerStart"
        @stop="handleTimerStop"
        @pause="handleTimerPause"
      />
    </div>
    <div class="grid">
      <PomodoroAnimation
        class="place-self-center"
        :state="animationState"
        :timer="animationTimer"
      />
    </div>
  </div>
</template>
