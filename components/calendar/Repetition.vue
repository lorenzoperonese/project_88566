<script setup lang="ts">
const $emits = defineEmits<{
  (e: 'close'): void
  (e: 'save', r: Repetition): void
}>()

const $props = defineProps({
  day: { type: String, required: true }
})

const day = new Date($props.day).getDate()
const weekNumber = Math.floor((day - new Date($props.day).getDay() + 1) / 7) + 1
const weekDay = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturaday',
  'Sunday'
][(new Date($props.day).getDay() + 6) % 7] // TODO CAMBIARE
console.log(weekDay)

const _repetition = ref(1)
const _eventPeriod = ref<EventPeriod>(1)
const _weekDays = ref<number[]>([])
const _monthRepetition = ref(0)
const _ends = ref('Never')
const _endDate = ref($props.day)
const _endAfter = ref(1)

function save() {
  const r = {
    every: _repetition.value,
    period: _eventPeriod.value
  } as Repetition

  if (_eventPeriod.value == 2) {
    r.repeteOn = _eventPeriod.value
  } else if (_eventPeriod.value == 3) {
    r.repeteOn = _monthRepetition.value
  }

  /*if (_ends.value == 'Never') {
  } else */
  if (_ends.value == 'Day') {
    r.end = new Date(_endDate.value)
  } else if (_ends.value == 'After') {
    r.end = _endAfter.value
  }

  $emits('save', r)
}

function cancel() {
  $emits('close')
}
</script>

<template>
  <div
    class="absolute left-0 top-0 grid h-full w-full bg-gray-400 bg-opacity-50"
    @click="cancel()"
  >
    <div
      class="flex w-96 flex-col gap-4 place-self-center rounded-lg bg-white p-4"
      @click.stop=""
    >
      <header>
        <h1 class="text-xl font-bold">Repetition</h1>
      </header>

      <main>
        <div class="flex gap-2">
          <div>Repeat every</div>
          <input
            v-model="_repetition"
            type="number"
            min="1"
            class="w-10 rounded border p-2 hover:bg-gray-200"
          />
          <select
            v-model="_eventPeriod"
            class="rounded border bg-white px-2 hover:bg-gray-200"
          >
            <option value="1">Day</option>
            <option value="2">Week</option>
            <option value="3">Month</option>
            <option value="4">Year</option>
          </select>
        </div>

        <div v-show="_eventPeriod == 2" class="flex gap-3">
          <template
            v-for="[i, o] in ['M', 'T', 'W', 'T', 'F', 'S', 'S'].entries()"
            :key="i"
          >
            <input v-model="_weekDays" type="checkbox" :value="i" />
            <label>{{ o }}</label>
          </template>
        </div>

        <div v-show="_eventPeriod == 3" class="mt-2">
          <select v-model="_monthRepetition" class="rounded p-2">
            <option value="0">Every {{ day }}th of month</option>
            <option value="1">
              Every {{ weekNumber }}th {{ weekDay }} of the month
            </option>
          </select>
        </div>

        <div class="flex flex-col">
          <h2>Ends:</h2>
          <div>
            <input v-model="_ends" type="radio" name="end" value="Never" />
            <label>Never</label>
          </div>
          <div>
            <input
              v-model="_ends"
              type="radio"
              name="end"
              class="peer"
              value="Day"
            />
            <label>Day</label>
            <input
              v-model="_endDate"
              type="date"
              class="ml-4 disabled:text-gray-500"
              :disabled="_ends != 'Day'"
            />
          </div>
          <div>
            <input v-model="_ends" type="radio" name="end" value="After" />
            <label>After</label>
            <input
              v-model="_endAfter"
              type="number"
              min="1"
              class="ml-4 rounded border p-2 outline-none invalid:border-red-500 disabled:text-gray-500"
              required
              :disabled="_ends != 'After'"
            />
          </div>
        </div>
      </main>

      <footer>
        <div class="flex justify-evenly">
          <button
            class="rounded-lg border bg-red-300 p-2 hover:bg-red-500"
            @click="cancel()"
          >
            Cancel
          </button>
          <button
            class="rounded-lg border bg-blue-300 p-2 hover:bg-blue-500"
            @click="save()"
          >
            Save
          </button>
        </div>
      </footer>
    </div>
  </div>
</template>
