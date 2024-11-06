<script setup lang="ts">
const session = ref<User | null>(null)

fetch('/api/session')
  .then((response) => {
    if (!response.ok) {
      throw new Error('During profile fetch: ' + response.statusText)
    }
    return response.json()
  })
  .then((data) => {
    session.value = data
  })
  .catch((e) => {
    console.error(e)
  })
</script>

<template>
  <div class="">
    <h2 class="text-center text-2xl font-bold">Profile</h2>

    <div class="divider divider-neutral"></div>

    <div v-if="session" class="flex flex-col gap-4">
      <div>
        <span> Username: </span>
        <span class="text-lg font-bold"> {{ session.username }} </span>
      </div>
    </div>
  </div>
</template>
