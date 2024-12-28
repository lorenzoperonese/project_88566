<script setup lang="ts">
const rooms = ref<ChatRoom[]>([])

async function fetchRooms() {
  const data = await $fetch('/api/chat/rooms')
  rooms.value = data as ChatRoom[]
}

const $props = defineProps<{
  settings: HomeSettings
}>()

const fRooms = computed(() => {
  if ($props.settings.chatLimit < rooms.value.length) {
    return rooms.value.slice(0, $props.settings.chatLimit)
  } else {
    return rooms.value
  }
})

onMounted(async () => {
  await fetchRooms()
})
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <NuxtLink
      v-for="n in fRooms"
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
