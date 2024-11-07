<script setup lang="ts">
definePageMeta({
  layout: 'navbar'
})

const _route = useRoute()
const _id = _route.params.id

// one of these will generate an error "Event not found"
let _event = await $fetch(`/api/events/${_id}`)
let _eventGuest = await $fetch(`/api/events-guest/${_id}`)

async function update() {
  _event = (await $fetch(`/api/events/${_id}`)) as any
  _eventGuest = (await $fetch(`/api/events-guest/${_id}`)) as any
  editMode.value = false
}

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
      <CalendarEventAdder :event="_event" @close="update" />
    </div>
  </div>
  <div v-else-if="_eventGuest">
    <CalendarShowEvent :event="_eventGuest" />
    <div>Cannot edit guest events</div>
  </div>
</template>
