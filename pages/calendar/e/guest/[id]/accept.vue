<script setup lang="ts">
definePageMeta({
  layout: 'navbar'
})

const _route = useRoute()
const _id = _route.params.id

const _eventGuest = await $fetch(`/api/events-guest/${_id}`, {
  query: { status: 'waiting' }
})

function acceptEvent() {
  fetch(`/api/events-guest/${_id}`, {
    method: 'POST'
  })
  navigateTo('/calendar')
}

function rejectEvent() {
  fetch(`/api/events-guest/${_id}`, {
    method: 'DELETE'
  })
  navigateTo('/calendar')
}
</script>

<template>
  <div v-if="_eventGuest">
    <CalendarShowEvent :event="_eventGuest" />
    <button class="btn btn-error w-full" @click="rejectEvent">Reject</button>
    <button class="btn btn-success w-full" @click="acceptEvent">Accept</button>
  </div>
</template>
