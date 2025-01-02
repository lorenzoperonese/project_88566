<script setup lang="ts">
definePageMeta({
  layout: 'navbar'
})

const _route = useRoute()
const _id = _route.params.id
const _notAvailable = await $fetch(`/api/not-available/${_id}`)
</script>

<template>
  <div class="flex justify-center">
    <CalendarNotAvailableAdder
      v-if="_notAvailable"
      :not-available="_notAvailable"
      @close="navigateTo('/calendar')"
    />
  </div>
</template>
