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
const _id = ref(_route.query.id as string | undefined)

const showPropose = ref(false)
const isTimerRunning = ref(false)
const timer = ref<Timer>({
  study: 30,
  break: 5,
  cycles: 5
})

if (_route.query.study && _route.query.break && _route.query.cycles) {
  timer.value = {
    study: parseInt(_route.query.study as string),
    break: parseInt(_route.query.break as string),
    cycles: parseInt(_route.query.cycles as string)
  }
}

async function fetchPomodoro() {
  if (_id.value) {
    let tmp = await $fetch(`/api/pomodoro-events/${_id.value}`)
    if (tmp) {
      timer.value = {
        study: tmp.study,
        break: tmp.break,
        cycles: tmp.cycles
      } as Timer
    }
  }
}
await fetchPomodoro()

if (_id.value) {
  let tmp = await $fetch(`/api/pomodoro-events/${_id.value}`)
  if (tmp) {
    timer.value.study = tmp.study
    timer.value.break = tmp.break
    timer.value.cycles = tmp.cycles
  }
}

function handleProposalAccept(proposal: Timer) {
  _id.value = undefined
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
  fetchPomodoro()
  isTimerRunning.value = false
  animationState.value = 'stop'
}

function handleTimerPause() {
  animationState.value = 'break'
}

function handleCycle() {
  if (_id.value) {
    $fetch(`/api/pomodoro-events/decrement/${_id.value}`, {
      method: 'PUT'
    })
  }
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
        @cycle="handleCycle"
      />
    </div>
    <div class="grid" v-show="!showPropose">
      <PomodoroAnimation
        class="place-self-center"
        :state="animationState"
        :timer="animationTimer"
      />
    </div>
  </div>
</template>
