<script setup lang="ts">
const end = await getToday()

const $props = defineProps<{
  event?: PomodoroEvent
}>()

const $emits = defineEmits<{
  (e: 'close'): void
}>()

const { $toast } = useNuxtApp()

const _title = ref('')
const _date = ref<string>(formatDate(end.getTime()))
const _study = ref<number>(30)
const _break = ref<number>(5)
const _cycles = ref<number>(5)

if ($props.event) {
  _title.value = $props.event.title
  _date.value = formatDate($props.event.date)
  _study.value = $props.event.study
  _break.value = $props.event.break
  _cycles.value = $props.event.cycles
}

function saveTask() {
  const date = new Date(_date.value).getTime()

  const e: PomodoroEvent = {
    id: '0',
    title: _title.value,
    date: date,
    study: _study.value,
    break: _break.value,
    cycles: _cycles.value,
    user_id: '0'
  }

  if (e.title.trim() === '') {
    $toast.error('Title is required')
    return
  }

  if ($props.event) {
    e.id = $props.event.id
    $fetch(`/api/pomodoro-events/${$props.event.id}`, {
      method: 'PUT',
      body: JSON.stringify(e)
    })
  } else {
    $fetch('/api/pomodoro-events', {
      method: 'POST',
      body: JSON.stringify(e)
    })
  }
  $emits('close')
}
function deleteTask() {
  $fetch(`/api/pomodoro-events/${$props.event?.id}`, {
    method: 'DELETE'
  })
  $emits('close')
}
</script>
<template>
  <div class="">
    <h1 class="text-xl font-bold">
      {{ $props.event ? 'Modify Pomodoro Event' : 'Add Pomodoro Event' }}
    </h1>

    <form class="flex flex-col gap-2" @submit.prevent="">
      <div class="form-control bordered">
        <div class="label">
          <label class="label-text">Title</label>
        </div>
        <input
          v-model="_title"
          class="input input-bordered"
          type="text"
          required
        />
      </div>

      <div class="form-control bordered">
        <div class="label">
          <label class="label-text">Day</label>
        </div>
        <div class="flex justify-between gap-4">
          <input
            v-model="_date"
            class="input input-bordered w-full"
            type="date"
          />
        </div>
      </div>

      <div class="form-control bordered">
        <div class="label">
          <label class="label-text">Study</label>
        </div>
        <input
          v-model="_study"
          class="input input-bordered"
          type="number"
          required
        />
      </div>

      <div class="form-control bordered">
        <div class="label">
          <label class="label-text">Break</label>
        </div>
        <input
          v-model="_break"
          class="input input-bordered"
          type="number"
          required
        />
      </div>

      <div class="form-control bordered">
        <div class="label">
          <label class="label-text">Cycles</label>
        </div>
        <input
          v-model="_cycles"
          class="input input-bordered"
          type="number"
          required
        />
      </div>

      <div class="flex flex-col gap-2">
        <NuxtLink
          v-if="$props.event"
          :to="`/pomodoro?id=${$props.event.id}`"
          class="btn btn-secondary w-full"
        >
          Go to Pomodoro
        </NuxtLink>

        <div class="flex justify-evenly">
          <button
            v-if="$props.event"
            class="btn btn-error w-2/5"
            @click="deleteTask()"
          >
            Delete Pomodoro
          </button>

          <button class="btn btn-success w-2/5" @click="saveTask()">
            {{ $props.event ? 'Save' : 'Add Pomodoro' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
