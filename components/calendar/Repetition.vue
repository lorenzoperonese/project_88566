<script setup lang="ts">
const $emits = defineEmits<{
  (e: 'close'): void
  (e: 'save', r: Repetition | null): void
}>()

const $props = defineProps<{
  day: string
  repetition: Repetition | null
}>()

const onoff = ref(false)
const day = new Date($props.day).getDate()

const weekNumber = (d: string) => {
  const date = new Date(d)
  const day = date.getDate()
  const value = Math.ceil(day / 7)
  return value === 1
    ? value.toString() + 'st'
    : value === 2
      ? value.toString() + 'nd'
      : value === 3
        ? value.toString() + 'rd'
        : value.toString() + 'th'
}

const _repetition = ref(1)
const _eventPeriod = ref<RepetitionPeriod>(1)
const _weekDays = ref<number[]>([])
const _monthRepetition = ref(1)
const _ends = ref('Never')
const _endDate = ref($props.day)
const _endAfter = ref(1)

if ($props.repetition !== null) {
  onoff.value = true
  _repetition.value = $props.repetition.every
  _eventPeriod.value = $props.repetition.period
  if (
    _eventPeriod.value == 2 &&
    $props.repetition.repeatOn !== null &&
    Array.isArray($props.repetition.repeatOn)
  )
    _weekDays.value = $props.repetition.repeatOn
  else if (
    _eventPeriod.value == 3 &&
    $props.repetition.repeatOn !== null &&
    !Array.isArray($props.repetition.repeatOn)
  )
    _monthRepetition.value = $props.repetition.repeatOn
  _ends.value = $props.repetition.end
    ? $props.repetition.end < Date.now() / 2
      ? 'After'
      : 'On'
    : 'Never'
  _endDate.value =
    _ends.value == 'On' && $props.repetition.end !== null
      ? formatDate($props.repetition.end)
      : $props.day
  _endAfter.value =
    _ends.value == 'After' && $props.repetition.end !== null
      ? $props.repetition.end
      : 1
}

const _errorMessage = ref('')

/*
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
*/

function save() {
  if (!onoff.value) {
    $emits('save', null)
    return
  }
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

  if (_ends.value == 'Never') {
    r.end = null
  } else if (_ends.value == 'Day') {
    r.end = new Date(_endDate.value).getTime()
    if (r.end < new Date().getTime()) {
      _errorMessage.value = 'End date must be in the future'
      return
    }
  } else if (_ends.value == 'After') {
    const d = new Date('1900-01-01 00:00 AM').getTime()
    if (_endAfter.value > d) r.end = null
    else r.end = _endAfter.value
  }
  $emits('save', r)
}

function cancel() {
  // reset()
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
      <div>
        <label class="inline-flex cursor-pointer items-center">
          <input
            v-model="onoff"
            type="checkbox"
            value=""
            class="peer sr-only"
          />
          <div
            class="peer relative h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"
          ></div>
        </label>
      </div>
      <main v-show="onoff">
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
              Monthly on the {{ weekNumber($props.day) }}
              {{ days[new Date($props.day).getDay()] }}
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
