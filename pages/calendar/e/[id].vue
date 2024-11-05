<script setup lang="ts">
const _route = useRoute()
const _id = _route.params.id

const _event = await $fetch(`/api/events/${_id}`)

const editMode = ref(false)
</script>

<template>
  <div v-if="_event">
    <div v-if="!editMode">
      <CalendarShowEvent :event="_event" />
      <button class="btn btn-primary w-full" @click="editMode = true">
        Edit
      </button>
    </div>
    <div v-else>
      <CalendarEventAdder :event="_event" />
    </div>
  </div>
</template>
