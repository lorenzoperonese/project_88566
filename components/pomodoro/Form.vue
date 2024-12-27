<script setup lang="ts">
const $props = defineProps({
  timer: { type: Object as PropType<Timer>, required: true }
})

const actualTime = defineModel()

const { $toast } = useNuxtApp()
const _study = ref($props.timer.study)
const _break = ref($props.timer.break)
const _cycles = ref($props.timer.cycles)
const _counting = ref(false)
const _paused = ref(false)
const _cycleCounter = ref(1)

const _propose = ref(false)
const _seconds = ref(0)
const _minutes = ref(0)
const _hours = ref(0)
let _timer: NodeJS.Timeout | null = null

const isStudying = ref(true)

watch([_study, _break, isStudying], () => {
  if (isStudying.value == true) {
    if (typeof _study.value === 'number') actualTime.value = _study.value
    else actualTime.value = 0
  } else {
    if (typeof _break.value === 'number') actualTime.value = _break.value
    else actualTime.value = 0
  }
})

watch(_cycleCounter, () => {
  if (_cycleCounter.value > 1) {
    $emit('cycle')
  }
})

import { watch } from 'vue'

watch(
  () => $props.timer,
  (newVal) => {
    _study.value = newVal.study
    _break.value = newVal.break
    _cycles.value = newVal.cycles
  },
  { deep: true }
)

const $emit = defineEmits(['start', 'stop', 'pause', 'cycle'])

const timeDisplay = computed(() => {
  const pad = (num: number) => num.toString().padStart(2, '0')
  return `${pad(_hours.value)}:${pad(_minutes.value)}:${pad(_seconds.value)}`
})

function calculateTime() {
  const totalMinutes = isStudying.value ? _study.value : _break.value
  _hours.value = Math.floor(totalMinutes / 60)
  _minutes.value = totalMinutes % 60
  _seconds.value = 0
}

function start(toast: boolean = true) {
  if (_study.value < 1 || _break.value < 1 || _cycles.value < 1) {
    $toast.error('Valori non validi')
    return
  }
  $emit('start')
  _counting.value = true
  if (!_paused.value) calculateTime()
  else _paused.value = false

  _timer = setInterval(() => {
    if (_seconds.value > 0) {
      _seconds.value--
    } else if (_minutes.value > 0) {
      _minutes.value--
      _seconds.value = 59
    } else if (_hours.value > 0) {
      _hours.value--
      _minutes.value = 59
      _seconds.value = 59
    } else {
      if (isStudying.value && _cycles.value <= _cycleCounter.value) {
        $emit('cycle')
        stop()
      } else {
        const msg = isStudying.value
          ? 'Complimenti, ora puoi riposarti!'
          : 'Pausa terminata, rimettiti al lavoro!'
        $toast.success(msg)
        if (!isStudying.value) _cycleCounter.value++
        isStudying.value = !isStudying.value
        calculateTime()
      }
    }
  }, 1000)
}
function stop() {
  $emit('stop')
  _study.value = $props.timer.study
  _break.value = $props.timer.break
  _cycles.value = $props.timer.cycles
  _cycleCounter.value = 1
  _counting.value = false
  _paused.value = false
  isStudying.value = true
  if (_timer) clearInterval(_timer)
}

function pause() {
  _paused.value = true
  $emit('pause')
  if (_timer) clearInterval(_timer)
}

function restart() {
  _paused.value = false
  const msg = isStudying.value
    ? 'Resta concentrato stavolta'
    : 'Non esagerare con la pausa!'
  $toast.success(msg)
  if (_timer) clearInterval(_timer)
  calculateTime()
  start(false)
}

function skip() {
  _paused.value = false
  if (_timer) clearInterval(_timer)
  if (isStudying.value && _cycles.value <= _cycleCounter.value) {
    $emit('cycle')
    stop()
  } else {
    if (!isStudying.value) _cycleCounter.value++
    isStudying.value = !isStudying.value
    start(false)
  }
}
</script>

<template>
  <div class="grid h-full place-items-center">
    <div v-if="!_counting" class="text-center">
      <h2 class="mb-4 text-2xl font-bold">Imposta il tuo Pomodoro</h2>
      <div class="mb-4 flex space-x-4">
        <div class="flex flex-col">
          <label class="mb-1 font-bold">Studio (min)</label>
          <input
            v-model="_study"
            min="1"
            required
            type="number"
            class="input input-bordered w-full max-w-xs text-center invalid:border-error invalid:text-error"
          />
        </div>
        <div class="flex flex-col">
          <label class="mb-1 font-bold">Pausa (min)</label>
          <input
            v-model="_break"
            min="1"
            required
            type="number"
            class="input input-bordered w-full max-w-xs text-center invalid:border-error invalid:text-error"
          />
        </div>
        <div class="flex flex-col">
          <label class="mb-1 font-bold">Cicli</label>
          <input
            v-model="_cycles"
            min="1"
            required
            type="number"
            class="input input-bordered w-full max-w-xs text-center invalid:border-error invalid:text-error"
          />
        </div>
      </div>
      <div class="flex justify-center">
        <div class="flex gap-2">
          <button class="btn btn-success" @click="start()">Inizia</button>
          <PomodoroShareModal
            :study="_study"
            :break="_break"
            :cycle="_cycles"
          />
        </div>
      </div>
    </div>

    <div v-else class="text-center">
      <h2 class="mb-4 text-4xl font-bold">{{ timeDisplay }}</h2>
      <p class="mb-4 text-xl">
        Ciclo {{ _cycleCounter }} - {{ isStudying ? 'Studio' : 'Pausa' }}
      </p>
      <div class="flex w-96 flex-col gap-2">
        <button v-if="!_paused" class="btn btn-warning" @click="pause">
          Pausa
        </button>
        <button v-else class="btn btn-info" @click="start()">Riprendi</button>
        <button class="btn btn-secondary" @click="skip()">Salta</button>
        <button class="btn btn-error" @click="stop()">Ferma</button>
        <button class="btn btn-success" @click="restart()">Ricomincia</button>
      </div>
    </div>
  </div>
</template>
