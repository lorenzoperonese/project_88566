<script setup lang="ts">
const end = await getToday()

const me = await getME()

const { data: _users } = await useFetch<User[]>('/api/users')

const $props = defineProps<{
  notAvailable?: NotAvailable
}>()

const $emits = defineEmits<{
  (e: 'close'): void
}>()

const { $toast } = useNuxtApp()

const _startDate = ref<string>(formatDate(end.getTime()))
const _startTime = ref<string>(formatTime(end.getTime()))
const _endDate = ref<string>(formatDate(end.getTime()))
const _endTime = ref<string>(formatTime(end.getTime() + 60 * 60 * 1000))

if ($props.notAvailable) {
  _startDate.value = formatDate($props.notAvailable.start)
  _startTime.value = formatTime($props.notAvailable.start)
  _endDate.value = formatDate($props.notAvailable.end)
  _endTime.value = formatTime($props.notAvailable.end)
}

async function saveNotAvailable() {
  const startDate = new Date(
    _startDate.value + ' ' + _startTime.value
  ).getTime()
  const endDate = new Date(_endDate.value + ' ' + _endTime.value).getTime()

  if (startDate >= endDate) {
    $toast.error('Start date must be before end date')
    return
  }

  const e: NotAvailable = {
    id: '0',
    start: startDate,
    end: endDate,
    user_id: me.id
  }

  if ($props.notAvailable) {
    e.id = $props.notAvailable.id
    await $fetch(`/api/not-available/${$props.notAvailable.id}`, {
      method: 'PUT',
      body: JSON.stringify(e)
    })
  } else {
    await $fetch('/api/not-available', {
      method: 'POST',
      body: JSON.stringify(e)
    })
  }
  $emits('close')
}

function deleteNotAvailable() {
  $fetch(`/api/not-available/${$props.notAvailable?.id}`, {
    method: 'DELETE'
  })
  $emits('close')
}
</script>
<template>
  <div class="">
    <h1 class="text-xl font-bold">
      {{ $props.notAvailable ? 'Modify Not Available' : 'Add Not Available' }}
    </h1>

    <form class="flex flex-col gap-2" @submit.prevent="">
      <div class="form-control bordered">
        <div class="label">
          <label class="label-text">Start</label>
        </div>
        <div class="flex flex-col justify-between gap-4 sm:flex-row">
          <input
            v-model="_startDate"
            class="input input-bordered w-full"
            type="date"
          />
          <input
            v-model="_startTime"
            class="input input-bordered w-full"
            type="time"
          />
        </div>
      </div>

      <div class="form-control bordered">
        <div class="label">
          <label class="label-text">End</label>
        </div>
        <div class="flex flex-col justify-between gap-4 sm:flex-row">
          <input
            v-model="_endDate"
            class="input input-bordered w-full"
            type="date"
          />
          <input
            v-model="_endTime"
            class="input input-bordered w-full"
            type="time"
          />
        </div>
      </div>

      <div class="flex justify-evenly">
        <button
          v-if="$props.notAvailable"
          class="btn btn-error w-2/5"
          @click="deleteNotAvailable()"
        >
          Delete Not Available
        </button>

        <button class="btn btn-success w-2/5" @click="saveNotAvailable()">
          {{ $props.notAvailable ? 'Save' : 'Add Not Available' }}
        </button>
      </div>
    </form>
  </div>
</template>
