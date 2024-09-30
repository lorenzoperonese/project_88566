<script setup lang="ts">
const today = new Date()
const end = new Date(today.getTime() + 60 * 60 * 1000)
const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

function formatDate(date: Date) {
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

function formatTime(date: Date) {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

const _title = ref('')
const _startDate = ref<string>(formatDate(today))
const _startTime = ref<string>(formatTime(today))
const _endDate = ref<string>(formatDate(end))
const _endTime = ref<string>(formatTime(end))
const _location = ref('')
const _note = ref('')
const _category = ref('Not categorized')
const _repetition = ref<Repetition | undefined>(undefined)

const _showRepetition = ref(false)

const _errorMessage = ref('')
const _summaryMessage = ref('')

function addRepetition(r: Repetition) {
  _errorMessage.value = ''
  _showRepetition.value = false
  _repetition.value = r
  //_summaryMessage.value =
  if (r.every != 1) {
    let tmp
    switch (r.period) {
      case 1:
        tmp = 'days'
        break
      case 2:
        tmp = 'weeks'
        break
      case 3:
        tmp = 'months'
        break
      default:
        tmp = 'years'
    }
    _summaryMessage.value = `Every ${r.every} ${tmp}`
  } else {
    switch (r.period) {
      case 1:
        _summaryMessage.value = 'Daily'
        break
      case 2:
        _summaryMessage.value = 'Weekly'
        break
      case 3:
        _summaryMessage.value = 'Monthly'
        break
      default:
        _summaryMessage.value = 'Yearly'
    }
  }
  if (r.period == 2 && r.repeatOn && Array.isArray(r.repeatOn)) {
    // 2nd and 3rd condition are for typescript
    _summaryMessage.value +=
      ', on ' + r.repeatOn.map((e: number) => days[e]).join(', ')
  } else if (r.period == 3) {
    _summaryMessage.value +=
      r.repeatOn == 1 ? ', on the same date' : `, on the same weekday`
  }
  //_summaryMessage.value;
  if (r.end === undefined) {
    _summaryMessage.value += ', forever'
  } else if (typeof r.end === 'number') {
    _summaryMessage.value += `, for ${r.end} times`
  } else {
    _summaryMessage.value += `, until ${r.end.toISOString().split('T')[0]}`
  }
}

function add() {
  _errorMessage.value = ''
  const startDate = new Date(_startDate.value + ' ' + _startTime.value)
  const endDate = new Date(_endDate.value + ' ' + _endTime.value)

  const ifEmtpyNull = (a: string) => {
    if (a.length == 0) {
      return undefined
    }

    return a
  }

  const e: EventType = {
    id: '0',
    title: _title.value,
    start: startDate,
    end: endDate,
    location: ifEmtpyNull(_location.value),
    note: ifEmtpyNull(_note.value),
    category: ifEmtpyNull(_category.value),
    repetition: _repetition.value
  }

  if (e.title.length == 0 || e.start > e.end) {
    _errorMessage.value = 'Invalid input'
    return
  }

  $fetch('/api/events', {
    method: 'POST',
    body: JSON.stringify(e)
  })
  navigateTo('/calendar')
}
</script>
<template>
  <div>
    <h1 class="text-xl font-bold">Add event</h1>

    <form class="flex flex-col gap-2" @submit.prevent="">
      <div>
        <label>Title:</label>
        <input v-model="_title" class="rounded border p-2" />
      </div>

      <div>
        <label>Start:</label>
        <input v-model="_startDate" class="rounded border p-2" type="date" />
        <input v-model="_startTime" class="rounded border p-2" type="time" />
      </div>

      <div>
        <label>End:</label>
        <input v-model="_endDate" class="rounded border p-2" type="date" />
        <input v-model="_endTime" class="rounded border p-2" type="time" />
      </div>

      <div>
        <label>Location:</label>
        <input v-model="_location" class="rounded border p-2" type="string" />
      </div>

      <div>
        <label>Note:</label>
        <textarea v-model="_note" class="rounded border p-2"> </textarea>
      </div>

      <div>
        <label>Category:</label>
        <input v-model="_category" class="rounded border p-2" type="string" />
      </div>

      <div>
        <button
          class="rounded border bg-orange-300 p-2 hover:bg-orange-500"
          @click="_showRepetition = true"
        >
          Repetition
        </button>
        <p>{{ _summaryMessage }}</p>
        <CalendarRepetition
          v-show="_showRepetition"
          :day="_startDate"
          @close="_showRepetition = false"
          @save="addRepetition"
        />
      </div>

      <div class="flex">
        <NuxtLink class="w-full" to="/calendar">
          <div
            class="w-full rounded border bg-red-300 p-2 text-center hover:bg-red-500"
          >
            Cancel
          </div>
        </NuxtLink>

        <button
          class="w-full rounded border bg-blue-300 p-2 hover:bg-blue-500"
          @click="add()"
        >
          Add event
        </button>
      </div>
    </form>
    <p class="text-red-500">{{ _errorMessage }}</p>
  </div>
</template>
