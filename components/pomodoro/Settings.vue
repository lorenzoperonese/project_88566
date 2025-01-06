<script setup lang="ts">
import { useSound } from '@vueuse/sound'

const settings = defineModel<{
  enableSound: boolean
  enableNotifications: boolean
  alarmSound: string
  musicSound: string
  volume: number
}>({
  default: () => ({
    enableSound: false,
    enableNotifications: false,
    alarmSound: '',
    musicSound: '',
    volume: 80
  })
})

const { play: playAlarm1, stop: stopAlarm1 } = useSound('/music/alarm.mp3', {
  interrupt: true
})
const { play: playAlarm2, stop: stopAlarm2 } = useSound(
  '/music/piano-alarm-01.mp3',
  { interrupt: true }
)
const { play: playAlarm3, stop: stopAlarm3 } = useSound(
  '/music/piano-alarm-02.mp3',
  { interrupt: true }
)

const { play: playMusic1, stop: stopMusic1 } = useSound('/music/lofi-01.mp3', {
  interrupt: true
})
const { play: playMusic2, stop: stopMusic2 } = useSound('/music/lofi-02.mp3', {
  interrupt: true
})
const { play: playMusic3, stop: stopMusic3 } = useSound('/music/ocean.mp3', {
  interrupt: true
})
const { play: playMusic4, stop: stopMusic4 } = useSound('/music/rain.mp3', {
  interrupt: true
})

watch(
  () => settings.value.alarmSound,
  (newSound, oldSound) => {
    stopAlarm(oldSound)
    playAlarm(newSound)
  }
)

function playAlarm(value: string) {
  if (value === 'alarm') {
    playAlarm1()
  } else if (value === 'piano-alarm-01') {
    playAlarm2()
  } else if (value === 'piano-alarm-02') {
    playAlarm3()
  }
}

function stopAlarm(value: string) {
  if (value === 'alarm') {
    stopAlarm1()
  } else if (value === 'piano-alarm-01') {
    stopAlarm2()
  } else if (value === 'piano-alarm-02') {
    stopAlarm3()
  }
}

watch(
  () => settings.value.musicSound,
  (newSound, oldSound) => {
    stopMusic(oldSound)
    playMusic(newSound)
  }
)

function playMusic(value: string) {
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

function stopMusic(value: string) {
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

const modal = useTemplateRef('settings-pomodoro-modal')

function openModal() {
  modal.value?.showModal()
}

function closeModal() {
  modal.value?.close()
}

function stopSounds() {
  closeModal()
  stopAlarm1()
  stopAlarm2()
  stopAlarm3()
  stopMusic1()
  stopMusic2()
  stopMusic3()
  stopMusic4()
}
</script>

<template>
  <div>
    <button class="btn btn-neutral" @click="openModal()">Settings</button>
    <dialog
      ref="settings-pomodoro-modal"
      class="modal modal-bottom sm:modal-middle"
      @close="stopSounds()"
    >
      <div class="modal-box">
        <h3 class="text-lg font-bold">Pomodoro settings</h3>
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">Enable sound</span>
            <input
              type="checkbox"
              class="toggle"
              v-model="settings.enableSound"
            />
          </label>
        </div>
        <div class="form-control">
          <label class="label cursor-pointer">
            <span class="label-text">Enable notifications</span>
            <input
              type="checkbox"
              class="toggle"
              v-model="settings.enableNotifications"
            />
          </label>
        </div>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Alarm sound</span>
          </div>
          <select class="select select-bordered" v-model="settings.alarmSound">
            <option value="">None</option>
            <option value="alarm">Alarm</option>
            <option value="piano-alarm-01">Piano 1</option>
            <option value="piano-alarm-02">Piano 2</option>
          </select>
        </label>
        <label class="form-control w-full max-w-xs">
          <div class="label">
            <span class="label-text">Music</span>
          </div>
          <select class="select select-bordered" v-model="settings.musicSound">
            <option value="">None</option>
            <option value="lofi-01">Lofi 1</option>
            <option value="lofi-02">Lofi 2</option>
            <option value="ocean">Ocean</option>
            <option value="rain">Rain</option>
          </select>
        </label>

        <form method="dialog" class="mt-2">
          <button class="btn">Close</button>
        </form>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>
