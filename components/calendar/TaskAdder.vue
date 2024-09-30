<script setup lang="ts">
const end = new Date()

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
const _endDate = ref<string>(formatDate(end))
const _endTime = ref<string>(formatTime(end))
const _note = ref('')
const _category = ref('Not categorized')

const _errorMessage = ref('')

function add() {
  _errorMessage.value = ''
  const endDate = new Date(_endDate.value + ' ' + _endTime.value)

  const ifEmtpyNull = (a: string) => {
    if (a.length == 0) {
      return undefined
    }

    return a
  }

  const e: Task = {
    id: '0',
    title: _title.value,
    end: endDate,
    note: ifEmtpyNull(_note.value),
    category: ifEmtpyNull(_category.value),
    completed: false
  }

  if (e.title.length == 0) {
    _errorMessage.value = 'Invalid input'
    return
  }

  $fetch('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(e)
  })
  navigateTo('/calendar')
}
</script>
<template>
  <div>
    <h1 class="text-xl font-bold">Add task</h1>

    <form class="flex flex-col gap-2" @submit.prevent="">
      <div>
        <label>Title:</label>
        <input v-model="_title" class="rounded border p-2" />
      </div>

      <div>
        <label>End:</label>
        <input v-model="_endDate" class="rounded border p-2" type="date" />
        <input v-model="_endTime" class="rounded border p-2" type="time" />
      </div>

      <div>
        <label>Note:</label>
        <textarea v-model="_note" class="rounded border p-2"> </textarea>
      </div>

      <div>
        <label>Category:</label>
        <input v-model="_category" class="rounded border p-2" type="string" />
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
          Add task
        </button>
      </div>
    </form>
    <p class="text-red-500">{{ _errorMessage }}</p>
  </div>
</template>
