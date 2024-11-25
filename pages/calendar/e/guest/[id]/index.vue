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
  <div v-if="_eventGuest">
    <CalendarShowEvent :event="_eventGuest" />
    <div>Cannot edit guest events</div>
  </div>
  <div v-else>{{ navigateTo(`/calendar/e/guest/${_id}/accept`) }}</div>
</template>
