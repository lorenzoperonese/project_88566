<script setup lang="ts">
definePageMeta({
  layout: 'navbar'
})

const _route = useRoute()
const _id = _route.params.id

const { data: _event } = await useFetch<EventType>(`/api/events/${_id}`)

async function update() {
  const tmp = await $fetch(`/api/events/${_id}`)
  _event.value = tmp as EventType
  editMode.value = false
}

const editMode = ref(false)
</script>

<template>
  <div v-if="_event" class="w-full">
    <div v-if="!editMode" class="flex flex-col gap-2">
      <CalendarShowEvent :event="_event" />
      <button class="btn btn-primary w-full" @click="editMode = true">
        Edit
      </button>
    </div>
    <CalendarEventAdder v-else :event="_event" @close="update" />
  </div>
</template>
