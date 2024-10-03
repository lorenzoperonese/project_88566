<script setup lang="ts">
const end = new Date().getTime()

const $props = defineProps<{
  task?: Task
}>()

const _title = ref('')
const _endDate = ref<string>(formatDate(end))
const _endTime = ref<string>(formatTime(end))
const _note = ref('')
const _category = ref('Not categorized')
const _completed = ref(false)

if ($props.task) {
  _title.value = $props.task.title
  _endDate.value = formatDate($props.task.end)
  _endTime.value = formatTime($props.task.end)
  _note.value = $props.task.note || ''
  _category.value = $props.task.category || 'Not categorized'
  _completed.value = $props.task.completed
}

const _errorMessage = ref('')

function saveTask() {
  _errorMessage.value = ''
  const endDate = new Date(_endDate.value + ' ' + _endTime.value).getTime()

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
    completed: _completed.value
  }

  if (e.title.length == 0) {
    _errorMessage.value = 'Invalid input'
    return
  }

  if ($props.task) {
    e.id = $props.task.id
    $fetch(`/api/tasks/${$props.task.id}`, {
      method: 'PUT',
      body: JSON.stringify(e)
    })
  } else {
    $fetch('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(e)
    })
  }
  navigateTo('/calendar')
}
function deleteTask() {
  $fetch(`/api/tasks/${$props.task?.id}`, {
    method: 'DELETE'
  })
  navigateTo('/calendar')
}
</script>
<template>
  <div class="w-1/5">
    <h1 class="text-xl font-bold">
      {{ $props.task ? 'Modify task' : 'Add task' }}
    </h1>

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
      <div v-if="$props.task">
        <label>Completed:</label>
        <input
          v-model="_completed"
          class="rounded border p-2"
          type="checkbox"
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
          v-if="$props.task"
          class="w-full rounded border bg-orange-300 p-2 hover:bg-orange-500"
          @click="deleteTask()"
        >
          Delete task
        </button>

        <button
          class="w-full rounded border bg-blue-300 p-2 hover:bg-blue-500"
          @click="saveTask()"
        >
          {{ $props.task ? 'Save' : 'Add task' }}
        </button>
      </div>
    </form>
    <p class="text-red-500">{{ _errorMessage }}</p>
  </div>
</template>
