<script setup lang="ts">
const today = await getToday()
const end = new Date(today.getTime() + 1000 * 60 * 60)

const $props = defineProps<{
  resource?: Resource
  isResourceNew?: boolean
}>()

const $emits = defineEmits<{
  (e: 'close'): void
}>()

const { data: resouceList } = await useFetch<ResourceList[]>(
  '/api/resources-list'
)

const { $toast } = useNuxtApp()

const { data: _users } = await useFetch<User[]>('/api/users')

const _resouceName = ref('null')
const _startDate = ref<string>(formatDate(today.getTime()))
const _startTime = ref<string>(formatTime(today.getTime()))
const _endDate = ref<string>(formatDate(end.getTime()))
const _endTime = ref<string>(formatTime(end.getTime()))
const _note = ref<string | null>(null)

if ($props.resource) {
  _resouceName.value = $props.resource.title
  _startDate.value = formatDate($props.resource.start)
  _startTime.value = formatTime($props.resource.start)
  _endDate.value = formatDate($props.resource.end)
  _endTime.value = formatTime($props.resource.end)
  _note.value = $props.resource.note || null
}

async function saveResource() {
  const startDate = new Date(
    _startDate.value + ' ' + _startTime.value
  ).getTime()
  const endDate = new Date(_endDate.value + ' ' + _endTime.value).getTime()

  const e: Resource = {
    id: '0',
    title: _resouceName.value,
    start: startDate,
    end: endDate,
    note: _note.value || undefined
  }

  if (e.title.trim() === '') {
    $toast.error('Title is required')
    return
  }
  if (e.start > e.end) {
    $toast.error('Start date must be before end date')
    return
  }

  if (!$props.isResourceNew && $props.resource) {
    e.id = $props.resource.id
    await $fetch(`/api/resources/${$props.resource.id}`, {
      method: 'PUT',
      body: JSON.stringify(e)
    })
  } else {
    await $fetch('/api/resources', {
      method: 'POST',
      body: JSON.stringify(e)
    })
  }
  $emits('close')
}

function deleteResource() {
  $fetch(`/api/resources/${$props.resource?.id}`, {
    method: 'DELETE'
  })
  navigateTo('/calendar')
}
</script>

<template>
  <div class="">
    <h1 class="text-xl font-bold">
      {{ $props.resource ? 'Modify resource time' : 'Add resource time' }}
    </h1>
    <form class="flex flex-col gap-2" @submit.prevent="">
      <div>
        <label>Resource name:</label>
        <select v-model="_resouceName" class="select select-bordered">
          <option value="null">None</option>
          <option v-for="r in resouceList" :value="r.name">{{ r.name }}</option>
        </select>
      </div>

      <div>
        <label>Start:</label>
        <input v-model="_startDate" class="input input-bordered" type="date" />
        <input v-model="_startTime" class="input input-bordered" type="time" />
      </div>

      <div>
        <label>End:</label>
        <input v-model="_endDate" class="input input-bordered" type="date" />
        <input v-model="_endTime" class="input input-bordered" type="time" />
      </div>

      <div>
        <label>Note:</label>
        <textarea
          v-model="_note"
          class="textarea textarea-bordered w-full"
          placeholder="Bio"
        ></textarea>
      </div>

      <div class="flex justify-evenly">
        <NuxtLink
          v-if="$props.isResourceNew"
          :to="{ name: 'calendar' }"
          class="btn btn-neutral w-2/5"
          @click="deleteResource()"
        >
          Close
        </NuxtLink>

        <button
          v-if="!$props.isResourceNew"
          class="btn btn-error w-2/5"
          @click="deleteResource()"
        >
          Delete resource
        </button>

        <button class="btn btn-success w-2/5" @click="saveResource()">
          {{ $props.isResourceNew ? 'Add resource' : 'Save' }}
        </button>
      </div>
    </form>
  </div>
</template>
