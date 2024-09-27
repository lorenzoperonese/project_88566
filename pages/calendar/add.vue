<script setup lang="ts">
const today = new Date()

function formatDate(today: Date) {
  let month = (today.getMonth() + 1).toString()
  if (month.length == 1) {
    month = '0' + month
  }

  let day = today.getDate().toString()
  if (day.length == 1) {
    day = '0' + day
  }

  return `${today.getFullYear()}-${month}-${day}`
}

const _title = ref('')
const _startDate = ref<string>(formatDate(today))
const _startTime = ref('')
const _endDate = ref<string>(formatDate(today))
const _endTime = ref('')
const _location = ref('')
const _note = ref('')
const _category = ref('')

const _showRepetition = ref(false)

function addRepetition(r: Repetition) {
  _showRepetition.value = false
  console.log(r)
}

function add() {
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
    category: ifEmtpyNull(_category.value)
  }

  $fetch('/api/events', {
    method: 'POST',
    body: JSON.stringify(e)
  })
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
        <CalendarRepetition
          v-show="_showRepetition"
          :day="_startDate"
          @close="_showRepetition = false"
          @save="addRepetition"
        />
      </div>

      <button
        class="rounded border bg-blue-300 p-2 hover:bg-blue-500"
        @click="add()"
      >
        Add event
      </button>
    </form>
  </div>
</template>
