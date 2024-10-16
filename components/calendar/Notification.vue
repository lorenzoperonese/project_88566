<script setup lang="ts">
const $emits = defineEmits<{
  (e: 'close'): void
  (e: 'save', n: Notify[] | null): void
}>()

const $props = defineProps<{
  end: number
  notify: Notify[] | null
}>()

const onoff = ref(false)
const _advance = ref(1)
const _period = ref(1)
const _hour = ref(formatTime(new Date($props.end).getTime()))

if ($props.notify && $props.notify.length > 0) {
  onoff.value = true
  _advance.value = $props.notify[0].advance
  _period.value = $props.notify[0].period
  _hour.value = formatTime(new Date($props.notify[0].hour).getTime())
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
  const notification = {
    advance: _advance.value,
    period: _period.value,
    hour: new Date('1900-01-01 ' + _hour.value).getTime()
  } as Notify

  if (notification.advance < 1 || notification.advance == undefined) {
    _errorMessage.value = 'Value must be greater than 0'
    return
  }
  const n: Notify[] = []
  n.push(notification)
  $emits('save', n)
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
        <h1 class="text-xl font-bold">Notifications</h1>
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
          <input
            v-model="_advance"
            type="number"
            min="1"
            required
            class="w-10 rounded border p-2 outline-none invalid:border-red-500 invalid:text-red-600 hover:bg-gray-200"
          />
          <select v-model="_period">
            <option value="1">{{ _advance === 1 ? 'Day' : 'Days' }}</option>
            <option value="2">{{ _advance === 1 ? 'Week' : 'Weeks' }}</option>
            <option value="3">{{ _advance === 1 ? 'Month' : 'Months' }}</option>
            <option value="4">{{ _advance === 1 ? 'Year' : 'Years' }}</option>
          </select>
          before at
          <input v-model="_hour" type="time" class="border p-2" />
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
