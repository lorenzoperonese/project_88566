<script setup lang="ts">
definePageMeta({
  layout: 'navbar'
})

const _route = useRoute()
const _id = _route.params.id
const _pomodoro = await $fetch(`/api/pomodoro-events/${_id}`)
</script>

<template>
  <div class="flex justify-center">
    <CalendarPomodoroAdder
      v-if="_pomodoro"
      :event="_pomodoro"
      @close="navigateTo('/calendar')"
    />
  </div>
</template>
