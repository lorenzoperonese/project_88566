<script setup lang="ts">
definePageMeta({
  layout: 'navbar'
})

const _route = useRoute()
const _id = _route.params.id

const _eventGuest = await $fetch(`/api/events-guest/${_id}`, {
  query: { status: 'accepted' }
})
</script>

<template>
  <div v-if="_eventGuest" class="flex flex-col bg-base-200">
    <CalendarShowEvent :event="_eventGuest" />
    <div class="mb-6 text-center text-xl">Cannot edit guest events</div>
  </div>
  <div v-else>{{ navigateTo(`/calendar/e/guest/${_id}/accept`) }}</div>
</template>
