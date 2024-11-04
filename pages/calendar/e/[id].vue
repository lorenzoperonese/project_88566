<script setup lang="ts">
const _route = useRoute()
const _id = _route.params.id

const _event = await $fetch(`/api/events/${_id}`)
</script>

<template>
  <div class="flex h-full items-center justify-center">
    <CalendarEventAdder v-if="_event" :event="_event" />
  </div>
</template>
