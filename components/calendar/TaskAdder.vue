<script setup lang="ts">
const end = await getToday()

const $props = defineProps<{
  task?: Task
}>()

const $emits = defineEmits<{
  (e: 'close'): void
}>()

const _title = ref('')
const _endDate = ref<string>(formatDate(end.getTime()))
const _endTime = ref<string>(formatTime(end.getTime()))
const _note = ref<string>('')
const _category = ref('Not categorized')
const _completed = ref(false)

if ($props.task) {
  _title.value = $props.task.title
  _endDate.value = formatDate($props.task.end)
  _endTime.value = formatTime($props.task.end)

  if ($props.task.note) _note.value = $props.task.note

  _category.value = $props.task.category || 'Not categorized'
  _completed.value = $props.task.completed
}

const _errorMessage = ref('')

function saveTask() {
  _errorMessage.value = ''
  const endDate = new Date(_endDate.value + ' ' + _endTime.value).getTime()

  const e: Task = {
    id: '0',
    title: _title.value,
    end: endDate,
    note: _note.value,
    category: _category.value,
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
  $emits('close')
}
function deleteTask() {
  $fetch(`/api/tasks/${$props.task?.id}`, {
    method: 'DELETE'
  })
  $emits('close')
}
</script>
<template>
  <div class="">
    <h1 class="text-xl font-bold">
      {{ $props.task ? 'Modify task' : 'Add task' }}
    </h1>

    <form class="flex flex-col gap-2" @submit.prevent="">
      <div>
        <label>Title:</label>
        <input
          v-model="_title"
          class="input input-bordered"
          type="text"
          required
        />
      </div>

      <div>
        <label>End:</label>
        <input v-model="_endDate" class="input input-bordered" type="date" />
        <input v-model="_endTime" class="input input-bordered" type="time" />
      </div>

      <div>
        <label>Note:</label>
        <textarea v-model="_note" class="textarea textarea-bordered w-full">
        </textarea>
      </div>

      <div>
        <label>Category:</label>
        <input v-model="_category" class="input input-bordered" type="string" />
        <div class="form-control" v-if="$props.task">
          <label class="label flex w-24 cursor-pointer gap-4">
            <span class="label-text">Completed</span>
            <input v-model="_completed" class="checkbox" type="checkbox" />
          </label>
        </div>
      </div>

      <div class="flex justify-evenly">
        <button
          v-if="$props.task"
          class="btn btn-error w-2/5"
          @click="deleteTask()"
        >
          Delete task
        </button>

        <button class="btn btn-success w-2/5" @click="saveTask()">
          {{ $props.task ? 'Save' : 'Add task' }}
        </button>
      </div>
    </form>
    <p class="text-red-500">{{ _errorMessage }}</p>
  </div>
</template>
