<script setup lang="ts">
definePageMeta({
  layout: 'navbar'
})

const _route = useRoute()
const _id = _route.params.id
const _task = await $fetch(`/api/tasks/${_id}`)
</script>

<template>
  <div class="flex justify-center">
    <CalendarTaskAdder v-if="_task" :task="_task" />
  </div>
</template>
