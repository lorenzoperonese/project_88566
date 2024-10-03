<script setup lang="ts">
const $emits = defineEmits<{
  (e: 'close'): void
  (e: 'save', r: Repetition): void
}>()

const $props = defineProps({
  day: { type: String, required: true }
})

const day = new Date($props.day).getDate()

const weekNumber = (d: string) => {
  const date = new Date(d)
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
  const firstMonday = new Date(firstDayOfMonth)
  while (firstMonday.getDay() !== 1)
    firstMonday.setDate(firstMonday.getDate() + 1)
  if (date < firstMonday) return 1
  const daysDifference = Math.floor(
    (date.valueOf() - firstMonday.valueOf()) / (24 * 60 * 60 * 1000)
  )
  const value = Math.floor(daysDifference / 7) + 2
  return value === 1
    ? value.toString() + 'st'
    : value === 2
      ? value.toString() + 'nd'
      : value === 3
        ? value.toString() + 'rd'
        : value.toString() + 'th'
}

const weekDay = days[(new Date($props.day).getDay() + 6) % 7] // TODO CAMBIARE

const _repetition = ref(1)
const _eventPeriod = ref<EventPeriod>(1)
const _weekDays = ref<number[]>([])
const _monthRepetition = ref(1)
const _ends = ref('Never')
const _endDate = ref($props.day)
const _endAfter = ref(1)

const _errorMessage = ref('')

function reset() {
  _repetition.value = 1
  _eventPeriod.value = 1
  _weekDays.value = []
  _monthRepetition.value = 0
  _ends.value = 'Never'
  _endDate.value = $props.day
  _endAfter.value = 1
  _errorMessage.value = ''
}

function save() {
  const r = {
    every: _repetition.value,
    period: _eventPeriod.value
  } as Repetition

  if (r.every < 1 || r.every == undefined) {
    _errorMessage.value = 'Value must be greater than 0'
    return
  }
  if (_eventPeriod.value == 2) {
    r.repeatOn = _weekDays.value
    if (r.repeatOn.length == 0) {
      _errorMessage.value = 'Select at least one day'
      return
    } else _errorMessage.value = ''
  } else if (_eventPeriod.value == 3) {
    _errorMessage.value = ''
    r.repeatOn = _monthRepetition.value
  }

  /*if (_ends.value == 'Never') {
  } else */
  if (_ends.value == 'Day') {
    r.end = new Date(_endDate.value).getTime()
  } else if (_ends.value == 'After') {
    r.end = _endAfter.value
  }
  $emits('save', r)
}

function cancel() {
  reset()
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
            required
            class="w-10 rounded border p-2 outline-none invalid:border-red-500 invalid:text-red-600 hover:bg-gray-200"
          />
          <select
            v-model="_eventPeriod"
            class="rounded border bg-white px-2 hover:bg-gray-200"
          >
            <option value="1">{{ _repetition == 1 ? 'Day' : 'Days' }}</option>
            <option value="2">{{ _repetition == 1 ? 'Week' : 'Weeks' }}</option>
            <option value="3">
              {{ _repetition == 1 ? 'Month' : 'Months' }}
            </option>
            <option value="4">{{ _repetition == 1 ? 'Year' : 'Years' }}</option>
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
            <option value="1">Monthly on day {{ day }}</option>
            <option value="2">
              Monthly on the {{ weekNumber($props.day) }} {{ weekDay }}
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
        <p class="mt-2 text-center text-red-500">{{ _errorMessage }}</p>
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
