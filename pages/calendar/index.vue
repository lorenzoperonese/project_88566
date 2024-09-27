<script setup lang="ts">
const { data: _events } = await useFetch('/api/events')
</script>
<template>
  <div>
    <h1 class="text-xl font-bold">CALENDAR</h1>

    <div class="flex flex-col gap-2 p-2">
      <div v-for="e in _events" :key="e.id" class="rounded border p-2">
        {{ e }}
      </div>
    </div>

    <NuxtLink
      to="/calendar/add"
      class="rounded border bg-blue-300 p-2 hover:bg-blue-500"
    >
      Add
    </NuxtLink>
  </div>
</template>
