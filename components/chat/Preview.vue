<script setup lang="ts">
const rooms = ref<ChatRoom[]>([])

async function fetchRooms() {
  const data = await $fetch('/api/chat/rooms')
  rooms.value = data as ChatRoom[]
}

onMounted(async () => {
  await fetchRooms()
})
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <NuxtLink
      v-for="n in rooms"
      :key="n.id"
      class="w-full rounded border border-neutral-700 p-2 hover:bg-base-100"
      :to="`/chat?id=${n.id}`"
    >
      {{ n.roomName }}
    </NuxtLink>

    <div v-if="rooms?.length == 0" class="text-center">No chat yet</div>
  </div>
</template>

<style></style>
