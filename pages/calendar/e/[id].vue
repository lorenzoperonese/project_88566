<script setup lang="ts">
const _route = useRoute()
const _id = _route.params.id

const _event = await $fetch(`/api/events/${_id}`)

const editMode = ref(false)
</script>

<template>
  <div v-if="_event" class="flex h-full items-center justify-center">
    <div v-if="!editMode">
      <CalendarShowEvent :event="_event" />
      <button
        class="w-full rounded border bg-blue-300 p-2 hover:bg-blue-500"
        @click="editMode = true"
      >
        Edit
      </button>
    </div>
    <div v-else>
      <CalendarEventAdder :event="_event" />
    </div>
  </div>
</template>
