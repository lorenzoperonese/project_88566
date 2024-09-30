<script setup lang="ts">
const _route = useRoute()
const _id = _route.params.id
const _task = await $fetch(`/api/tasks/${_id}`)
</script>

<template>
  <div>{{ _task }}</div>
</template>
