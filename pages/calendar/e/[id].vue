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
  <div v-if="_event" class="max-w-md p-2">
    <div v-if="!editMode">
      <CalendarShowEvent :event="_event" />
      <button class="btn btn-primary w-full" @click="editMode = true">
        Edit
      </button>
    </div>
    <div v-else class="flex justify-center">
      <CalendarEventAdder
        :event="_event"
        @close="update"
        class="w-full max-w-xs p-4 md:max-w-2xl"
      />
    </div>
  </div>
</template>
