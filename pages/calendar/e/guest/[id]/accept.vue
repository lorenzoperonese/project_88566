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
  $fetch(`/api/events-guest/${_id}`, {
    method: 'POST'
  })
  navigateTo('/calendar')
}

function rejectEvent() {
  $fetch(`/api/events-guest/${_id}`, {
    method: 'DELETE'
  })
  navigateTo('/calendar')
}
</script>

<template>
  <div class="w-full">
    <div v-if="_eventGuest" class="flex flex-col bg-base-200 p-2">
      <CalendarShowEvent :event="_eventGuest" />
      <div class="mx-auto flex w-1/2 justify-evenly">
        <button class="btn btn-error w-2/5" @click="rejectEvent">Reject</button>
        <button class="btn btn-success w-2/5" @click="acceptEvent">
          Accept
        </button>
      </div>
    </div>
    <div v-else class="flex flex-col gap-2">
      <div class="text-xl font-bold text-error">Event not found</div>
      <NuxtLink to="/calendar" class="btn btn-primary w-full"
        >Back to calendar</NuxtLink
      >
    </div>
  </div>
</template>
