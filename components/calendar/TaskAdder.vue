<script setup lang="ts">
const end = await getToday()
const _guest = ref('')
const _guests = ref<string[]>([])
const _guestsIDs = ref<string[]>([])

const me = await getME()

const { data: _users } = await useFetch<User[]>('/api/users')

const $props = defineProps<{
  task?: Task
}>()

const isMyNote = computed(() => {
  if (!me || !$props.task) return true

  return me.id === $props.task.user_id
})
console.log('IS MY NOTE: ', isMyNote.value)

const $emits = defineEmits<{
  (e: 'close'): void
}>()

const { $toast } = useNuxtApp()

const _title = ref('')
const _endDate = ref<string>(formatDate(end.getTime()))
const _endTime = ref<string>(formatTime(end.getTime() + 60 * 60 * 1000))
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
  _guests.value = $props.task.users
  const guestsIDs = _users.value
    ?.filter((u) => _guests.value.includes(u.username))
    .map((u) => u.id)

  if (guestsIDs) _guestsIDs.value = guestsIDs
}

async function saveTask() {
  const endDate = new Date(_endDate.value + ' ' + _endTime.value).getTime()

  const e: Task = {
    id: '0',
    title: _title.value,
    end: endDate,
    note: _note.value,
    category: _category.value,
    completed: _completed.value,
    user_id: '0',
    users: _guestsIDs.value
  }

  if (e.title.trim() === '') {
    $toast.error('Title is required')
    return
  }
  if (!e.category) {
    e.category = 'Not categorized'
  }

  if ($props.task) {
    e.id = $props.task.id
    await $fetch(`/api/tasks/${$props.task.id}`, {
      method: 'PUT',
      body: JSON.stringify(e)
    })
  } else {
    await $fetch('/api/tasks', {
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

function addGuest() {
  console.log(_guest.value)
  if (_guest.value.trim() == '') {
    $toast.error('Username is required')
    return
  }

  if (!_users.value) {
    $toast.error('User not found')
    return
  }

  if (_guest.value == me.username) {
    $toast.error('You cannot add yourself')
    return
  }

  const user = _users.value.filter((u) => u.username === _guest.value)[0]
  if (!user) {
    $toast.error('User not found')
    return
  }

  if (_guests.value.includes(_guest.value)) {
    $toast.error('Username already added')
    return
  }

  _guests.value.push(_guest.value)
  _guestsIDs.value.push(
    _users.value.filter((u) => u.username === _guest.value)[0].id
  )
  _guest.value = ''
}
</script>
<template>
  <div class="">
    <h1 class="text-xl font-bold">
      {{ $props.task ? 'Modify task' : 'Add task' }}
    </h1>

    <form class="flex flex-col gap-2" @submit.prevent="">
      <div class="form-control bordered">
        <div class="label">
          <label class="label-text">Title</label>
        </div>
        <input
          v-model="_title"
          class="input input-bordered"
          :disabled="!isMyNote"
          type="text"
          required
        />
      </div>

      <div class="form-control bordered">
        <div class="label">
          <label class="label-text">End</label>
        </div>
        <div class="flex justify-between gap-4">
          <input
            v-model="_endDate"
            class="input input-bordered w-full"
            :disabled="!isMyNote"
            type="date"
          />
          <input
            v-model="_endTime"
            class="input input-bordered w-full"
            :disabled="!isMyNote"
            type="time"
          />
        </div>
      </div>

      <div class="form-control bordered">
        <div class="label">
          <label class="label-text">Note</label>
        </div>
        <textarea
          v-model="_note"
          class="textarea textarea-bordered w-full"
          :disabled="!isMyNote"
        >
        </textarea>
      </div>

      <div class="form-control bordered">
        <div class="label">
          <label class="label-text">Category</label>
        </div>
        <input
          v-model="_category"
          class="input input-bordered"
          type="string"
          :disabled="!isMyNote"
        />
        <div v-if="$props.task" class="form-control">
          <label class="label flex w-24 cursor-pointer gap-4">
            <span class="label-text">Completed</span>
            <input v-model="_completed" class="checkbox" type="checkbox" />
          </label>
        </div>
      </div>

      <div class="form-control bordered">
        <div class="label">
          <label class="label-text">Guests</label>
        </div>
        <div class="flex gap-4" :class="{ hidden: !isMyNote }">
          <input
            type="text"
            placeholder="username"
            class="input input-bordered w-1/2"
            v-model="_guest"
          />
          <button class="btn btn-neutral" @click="addGuest">Add</button>
        </div>
        <ul class="list-disc">
          <li v-for="g in _guests" :key="g">{{ g }}</li>
        </ul>
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
  </div>
</template>
