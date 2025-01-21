<script setup lang="ts">
import { useSound } from '@vueuse/sound'

import { watch } from 'vue'

const $props = defineProps({
  timer: { type: Object as PropType<Timer>, required: true }
})

const _pomodoroSettings = ref({
  enableSound: true,
  enableNotifications: true,
  alarmSound: 'alarm',
  musicSound: 'lofi-01',
  volume: 80
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

function start(recalculate = true) {
  if (_pomodoroSettings.value.enableSound) {
    playMusic(_pomodoroSettings.value.musicSound)
  }

  if (_study.value < 1 || _break.value < 1 || _cycles.value < 1) {
    $toast.error('Valori non validi')
    return
  }
  localStorage.setItem('study_time', _study.value.toString())
  localStorage.setItem('break_time', _break.value.toString())
  localStorage.setItem('cycles_tot', _cycles.value.toString())
  localStorage.setItem('pomodoro-status', 'running')
  localStorage.setItem(
    'cycle',
    ((_cycleCounter.value - 1) * 2 + (isStudying.value ? 1 : 2)).toString()
  )
  $emit('start')
  _counting.value = true
  if (!_paused.value && recalculate) calculateTime()
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
        if (_pomodoroSettings.value.enableSound) {
          playAlarm(_pomodoroSettings.value.alarmSound)
        }
        const msg = isStudying.value
          ? 'Complimenti, ora puoi riposarti!'
          : 'Pausa terminata, rimettiti al lavoro!'
        $toast.success(msg)
        if (_pomodoroSettings.value.enableNotifications) {
          postMessageToWoker({
            title: 'Pomodoro',
            body: msg
          })
        }
        if (!isStudying.value) _cycleCounter.value++
        isStudying.value = !isStudying.value
        localStorage.setItem(
          'cycle',
          (
            (_cycleCounter.value - 1) * 2 +
            (isStudying.value ? 1 : 2)
          ).toString()
        )
        calculateTime()
      }
    }
    localStorage.setItem(
      'pomodoro-timer',
      JSON.stringify({ h: _hours.value, m: _minutes.value, s: _seconds.value })
    )
  }, 1000)
}

function stop() {
  if (_pomodoroSettings.value.enableSound) {
    stopMusic(_pomodoroSettings.value.musicSound)
  }
  localStorage.setItem('pomodoro-status', 'stopped')
  localStorage.removeItem('cycle')
  localStorage.removeItem('study_time')
  localStorage.removeItem('break_time')
  localStorage.removeItem('cycles_tot')
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
  if (_pomodoroSettings.value.enableSound) {
    pauseMusic(_pomodoroSettings.value.musicSound)
  }
  localStorage.setItem('pomodoro-status', 'paused')
  _paused.value = true
  $emit('pause')
  if (_timer) clearInterval(_timer)
}

function restart() {
  if (_pomodoroSettings.value.enableSound) {
    stopMusic(_pomodoroSettings.value.musicSound)
  }

  _paused.value = false
  const msg = isStudying.value
    ? 'Resta concentrato stavolta'
    : 'Non esagerare con la pausa!'
  $toast.success(msg)
  if (_timer) clearInterval(_timer)
  calculateTime()
  start()
}

function skip() {
  if (_pomodoroSettings.value.enableSound) {
    stopMusic(_pomodoroSettings.value.musicSound)
  }
  _paused.value = false
  if (_timer) clearInterval(_timer)
  if (isStudying.value && _cycles.value <= _cycleCounter.value) {
    $emit('cycle')
    stop()
  } else {
    if (!isStudying.value) _cycleCounter.value++
    isStudying.value = !isStudying.value
    start()
  }
}

function adjustTime(value: number) {
  _minutes.value += value
  if (_minutes.value < 0) {
    if (_hours.value > 0) {
      _hours.value--
      _minutes.value += 60
    } else {
      _minutes.value = 0
    }
  } else if (_minutes.value > 59) {
    if (_hours.value < 99) {
      _hours.value++
      _minutes.value -= 60
    } else {
      _minutes.value = 59
    }
  }
}

onMounted(() => {
  const status = localStorage.getItem('pomodoro-status')
  if (status == 'running' || status == 'paused') {
    _counting.value = true
    isStudying.value = localStorage.getItem('cycle')
      ? parseInt(localStorage.getItem('cycle')!) % 2 == 1
      : true
    _cycleCounter.value = Math.ceil(
      parseInt(localStorage.getItem('cycle')!) / 2
    )
    _study.value = parseInt(localStorage.getItem('study_time')!)
    _break.value = parseInt(localStorage.getItem('break_time')!)
    _cycles.value = parseInt(localStorage.getItem('cycles_tot')!)
    const timer = localStorage.getItem('pomodoro-timer')
    if (timer) {
      const timerp = JSON.parse(timer)
      _hours.value = timerp.h
      _minutes.value = timerp.m
      _seconds.value = timerp.s
    }
    start(false)
  }
})

onBeforeUnmount(() => {
  if (_counting.value) {
    pause()
  }
})

const {
  play: playAlarm1,
  stop: stopAlarm1,
  pause: pauseAlarm1
} = useSound('/music/alarm.mp3', { interrupt: true })
const {
  play: playAlarm2,
  stop: stopAlarm2,
  pause: pauseAlarm2
} = useSound('/music/piano-alarm-01.mp3', { interrupt: true })
const {
  play: playAlarm3,
  stop: stopAlarm3,
  pause: pauseAlarm3
} = useSound('/music/piano-alarm-02.mp3', { interrupt: true })

const {
  play: playMusic1,
  stop: stopMusic1,
  pause: pauseMusic1,
  isPlaying: isPlayingMusic1
} = useSound('/music/lofi-01.mp3')
const {
  play: playMusic2,
  stop: stopMusic2,
  pause: pauseMusic2,
  isPlaying: isPlayingMusic2
} = useSound('/music/lofi-02.mp3')
const {
  play: playMusic3,
  stop: stopMusic3,
  pause: pauseMusic3,
  isPlaying: isPlayingMusic3
} = useSound('/music/ocean.mp3')
const {
  play: playMusic4,
  stop: stopMusic4,
  pause: pauseMusic4,
  isPlaying: isPlayingMusic4
} = useSound('/music/rain.mp3')

const playAlarm = (value: string) => {
  if (value === 'alarm') {
    playAlarm1()
  } else if (value === 'piano-alarm-01') {
    playAlarm2()
  } else if (value === 'piano-alarm-02') {
    playAlarm3()
  }
}

const stopAlarm = (value: string) => {
  if (value === 'alarm') {
    stopAlarm1()
  } else if (value === 'piano-alarm-01') {
    stopAlarm2()
  } else if (value === 'piano-alarm-02') {
    stopAlarm3()
  }
}

const playMusic = (value: string) => {
  if (value === 'lofi-01') {
    playMusic1()
  } else if (value === 'lofi-02') {
    playMusic2()
  } else if (value === 'ocean') {
    playMusic3()
  } else if (value === 'rain') {
    playMusic4()
  }
}

const stopMusic = (value: string) => {
  if (value === 'lofi-01') {
    stopMusic1()
  } else if (value === 'lofi-02') {
    stopMusic2()
  } else if (value === 'ocean') {
    stopMusic3()
  } else if (value === 'rain') {
    stopMusic4()
  }
}

const pauseMusic = (value: string) => {
  if (value === 'lofi-01') {
    pauseMusic1()
  } else if (value === 'lofi-02') {
    pauseMusic2()
  } else if (value === 'ocean') {
    pauseMusic3()
  } else if (value === 'rain') {
    pauseMusic4()
  }
}

// To keep the music playing when track ends
watch(
  () => [
    isPlayingMusic1.value,
    isPlayingMusic2.value,
    isPlayingMusic3.value,
    isPlayingMusic4.value
  ],
  (newVal: boolean[], oldVal: boolean[]) => {
    if (
      _pomodoroSettings.value.enableSound &&
      _counting.value &&
      !_paused.value
    ) {
      for (let i = 0; i < newVal.length; i++) {
        if (!newVal[i] && oldVal[i]) {
          playMusic(_pomodoroSettings.value.musicSound)
        }
      }
    }
  }
)
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
          <label class="mb-1 font-bold"
            >Cicli <span class="invisible sm:hidden">(min)</span></label
          >
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
          <PomodoroSettings v-model="_pomodoroSettings" />
        </div>
      </div>
    </div>

    <div v-else class="w-full max-w-xs text-center md:max-w-md">
      <h2 class="mb-4 text-4xl font-bold">{{ timeDisplay }}</h2>
      <p class="mb-4 text-xl">
        Ciclo {{ _cycleCounter }} - {{ isStudying ? 'Studio' : 'Pausa' }}
      </p>
      <div class="flex flex-col gap-2">
        <div class="grid grid-cols-4 gap-2">
          <button class="btn btn-primary flex-1" @click="adjustTime(-5)">
            -5
          </button>
          <button class="btn btn-primary flex-1" @click="adjustTime(-1)">
            -1
          </button>
          <button class="btn btn-primary flex-1" @click="adjustTime(1)">
            +1
          </button>
          <button class="btn btn-primary flex-1" @click="adjustTime(5)">
            +5
          </button>
        </div>
        <div class="grid grid-cols-2 gap-1">
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
  </div>
</template>
