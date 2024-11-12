<script setup lang="ts">
const $emits = defineEmits<{
  (e: 'save', r: Repetition | null): void
}>()

const $props = defineProps<{
  day: string
  repetition: Repetition | null
}>()

const { $toast } = useNuxtApp()

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

function repetitions(n: number) {
  const obj = [
    { value: 1, name: 'Day' },
    { value: 2, name: 'Week' },
    { value: 3, name: 'Month' },
    { value: 4, name: 'Year' }
  ]
  if (n != 1) {
    for (let i = 0; i < obj.length; i++) obj[i].name += 's'
  }
  return obj
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
  _ends.value = $props.repetition.endAfter
    ? 'After'
    : $props.repetition.endOn
      ? 'On'
      : 'Never'
  _endDate.value =
    _ends.value == 'On' && $props.repetition.endOn
      ? formatDate($props.repetition.endOn)
      : $props.day
  _endAfter.value =
    _ends.value == 'After' && $props.repetition.endAfter
      ? $props.repetition.endAfter
      : 1
}

/*
function reset() {
  _repetition.value = 1
  _eventPeriod.value = 1
  _weekDays.value = []
  _monthRepetition.value = 0
  _ends.value = 'Never'
  _endDate.value = $props.day
  _endAfter.value = 1
}
*/

function save() {
  if (!onoff.value) {
    $emits('save', null)
    return
  }
  const r = {
    every: _repetition.value,
    period: _eventPeriod.value,
    repeatOn: null,
    endOn: null,
    endAfter: null
  } as Repetition

  if (r.every < 1 || r.every == undefined) {
    $toast.error('Value must be greater than 0')
    return
  }
  if (_eventPeriod.value == 2) {
    r.repeatOn = _weekDays.value
    if (r.repeatOn.length == 0) {
      $toast.error('Select at least one day')
      return
    }
  } else if (_eventPeriod.value == 3) {
    r.repeatOn = _monthRepetition.value
  }

  if (_ends.value == 'Day') {
    r.endOn = new Date(_endDate.value).getTime()
    if (r.endOn < new Date().getTime()) {
      $toast.error('End date must be in the future')
      return
    }
  } else if (_ends.value == 'After') {
    r.endAfter = _endAfter.value
  }
  $emits('save', r)
}

function close() {
  const el = document.getElementById('repetition_modal')

  if (el) {
    ;(el as any).close()
  }
}
</script>

<template>
  <div>
    <button
      class="btn btn-outline btn-primary w-full"
      onclick="repetition_modal.showModal()"
    >
      Repetitions
    </button>
    <dialog id="repetition_modal" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <div
          class="flex flex-col gap-4 place-self-center rounded-lg p-4"
          @click.stop=""
        >
          <header>
            <h1 class="text-xl font-bold">Repetition</h1>
          </header>
          <div>
            <label class="inline-flex cursor-pointer items-center">
              <div class="form-control w-52">
                <label class="label cursor-pointer">
                  <input
                    v-model="onoff"
                    type="checkbox"
                    class="toggle toggle-primary"
                  />
                </label>
              </div>
            </label>
          </div>
          <main v-show="onoff">
            <div class="flex gap-2">
              <div class="flex items-center">
                <div>Repeat every</div>
              </div>
              <input
                v-model="_repetition"
                type="number"
                min="1"
                required
                class="input input-bordered w-20 text-center"
              />

              <SelectDrop
                v-model="_eventPeriod"
                :options="repetitions(_repetition)"
              />
            </div>

            <div v-show="_eventPeriod == 2" class="flex gap-3">
              <template
                v-for="[i, o] in ['M', 'T', 'W', 'T', 'F', 'S', 'S'].entries()"
                :key="i"
              >
                <input
                  v-model="_weekDays"
                  type="checkbox"
                  :value="i"
                  class="checkbox"
                />
                <label>{{ o }}</label>
              </template>
            </div>

            <div v-show="_eventPeriod == 3" class="mt-2">
              <SelectDrop
                v-model="_monthRepetition"
                :options="[
                  { value: 1, name: 'Monthly on day ' + day },
                  {
                    value: 2,
                    name:
                      'Monthly on the' +
                      weekNumber($props.day) +
                      ' ' +
                      days[new Date($props.day).getDay()]
                  }
                ]"
              />
            </div>

            <div class="mt-4 flex flex-col">
              <h2 class="text-lg font-bold">Ends:</h2>

              <div class="form-control">
                <label class="label flex cursor-pointer justify-start gap-4">
                  <input
                    v-model="_ends"
                    type="radio"
                    name="end"
                    value="Never"
                    class="radio"
                  />
                  <span class="label-text">Never</span>
                </label>
              </div>

              <div></div>

              <div class="form-control">
                <label class="label flex cursor-pointer justify-start gap-4">
                  <input
                    v-model="_ends"
                    type="radio"
                    name="end"
                    class="peer radio"
                    value="Day"
                  />
                  <span class="label-text">Day</span>
                  <input
                    v-model="_endDate"
                    type="date"
                    class="input input-bordered ml-4 disabled:text-gray-500"
                    :disabled="_ends != 'Day'"
                  />
                </label>
              </div>

              <div class="form-control">
                <label class="label flex cursor-pointer justify-start gap-4">
                  <input
                    v-model="_ends"
                    type="radio"
                    name="end"
                    value="After"
                    class="radio"
                  />
                  <span class="label-text">After</span>

                  <input
                    v-model="_endAfter"
                    type="number"
                    min="1"
                    class="input input-bordered w-20 text-center"
                    required
                    :disabled="_ends != 'After'"
                  />
                </label>
              </div>
            </div>
          </main>
        </div>

        <div class="modal-action">
          <button class="btn" @click="close">Close</button>
          <form method="dialog" class="flex w-full justify-between">
            <button class="btn btn-primary" @click.prevent="" @click="save()">
              Save
            </button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>
