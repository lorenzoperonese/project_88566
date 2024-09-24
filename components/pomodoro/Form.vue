<script setup lang="ts">
const _study = ref(30)
const _break = ref(5)
const _cycles = ref(5)
const _counting = ref(false)
const _paused = ref(false)
const _cycleCounter = ref(1)

const _seconds = ref(0)
const _minutes = ref(0)
const _hours = ref(0)
let _timer: any

let isStuding = true

function calculateTime() {
  if (isStuding) {
    //_hours.value = Math.floor(_study.value / 60);
    //_minutes.value = _study.value % 60;
  } else {
    // During break
    //_hours.value = Math.floor(_break.value / 60);
    //_minutes.value = _break.value % 60;
  }
  _seconds.value = 5
}

function start() {
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
      if (!isStuding) {
        if (_cycles.value > _cycleCounter.value) {
          calculateTime()
          _cycleCounter.value++
        }
      } else {
        if (_cycles.value === _cycleCounter.value) {
          stop()
        } else {
          calculateTime()
        }
      }
      isStuding = !isStuding
    }
  }, 1000)
}
function stop() {
  _study.value = 30
  _break.value = 5
  _cycles.value = 5
  _cycleCounter.value = 1
  _counting.value = false
  _paused.value = false
  isStuding = true
  clearInterval(_timer)
}
function pause() {
  _paused.value = true
  clearInterval(_timer)
}
function restart() {
  _paused.value = false
  clearInterval(_timer)
  calculateTime()
  start()
}
function skip() {
  _paused.value = false
  clearInterval(_timer)
  if (isStuding && _cycles.value === _cycleCounter.value) stop()
  else {
    if (!isStuding) _cycleCounter.value++
    isStuding = !isStuding
    start()
  }
}
</script>

<template>
  <div class="grid h-full">
    <div class="place-self-center">
      <form v-if="!_counting" @click.prevent="">
        <div class="flex">
          <div class="flex flex-col">
            <label class="w-full text-center font-bold">Studio</label>
            <input
              v-model="_study"
              type="number"
              class="border py-4 text-center text-xl outline-none"
              min="0"
            />
          </div>
          <div class="flex flex-col">
            <label class="w-full text-center font-bold">Pausa</label>
            <input
              v-model="_break"
              type="number"
              class="border py-4 text-center text-xl outline-none"
              min="0"
            />
          </div>
          <div class="flex flex-col">
            <label class="w-full text-center font-bold">Cicli</label>
            <input
              v-model="_cycles"
              type="number"
              class="border py-4 text-center text-xl outline-none"
              min="0"
            />
          </div>
        </div>
        <div class="flex justify-center">
          <button
            class="mt-2 w-80 rounded bg-green-500 py-2 font-bold text-white hover:bg-green-700"
            @click="start()"
          >
            Start
          </button>
        </div>
      </form>

      <div v-else>
        <div>
          <div class="text-center text-xl">
            {{ _hours }}:{{ _minutes < 10 ? '0' : '' }}{{ _minutes }}:{{
              _seconds < 10 ? '0' : ''
            }}{{ _seconds }}
          </div>
          <div>
            Cycles: {{ _cycleCounter }}: {{ isStuding ? 'Studio' : 'Pausa' }}
          </div>
          <button
            class="mt-2 w-80 rounded bg-red-500 py-2 font-bold text-white hover:bg-red-700"
            @click="stop()"
          >
            Stop
          </button>

          <button
            v-if="!_paused"
            class="mt-2 w-80 rounded bg-yellow-500 py-2 font-bold text-white hover:bg-yellow-700"
            @click="pause()"
          >
            Pause
          </button>
          <button
            v-else
            class="mt-2 w-80 rounded bg-blue-500 py-2 font-bold text-white hover:bg-blue-700"
            @click="start()"
          >
            Resume
          </button>
        </div>
        <div>
          <button
            class="mt-2 w-80 rounded bg-green-500 py-2 font-bold text-white hover:bg-green-700"
            @click="restart()"
          >
            Restart cycle
          </button>
          <button
            class="mt-2 w-80 rounded bg-violet-500 py-2 font-bold text-white hover:bg-violet-700"
            @click="skip()"
          >
            End cycle
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
