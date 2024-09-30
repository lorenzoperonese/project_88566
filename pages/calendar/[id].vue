<script setup lang="ts">
const _route = useRoute()
const _id = _route.params.id
const _event = await $fetch(`/api/events/${_id}`)
</script>

<template>
  <div>{{ _event }}</div>
</template>
