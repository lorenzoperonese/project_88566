<script setup lang="ts">
const { data: notes } = await useFetch<Note[]>('/api/notes')
const $props = defineProps<{
  settings: HomeSettings
}>()

const fNotes = computed(() => {
  if (!notes.value) return []

  if ($props.settings.notesFilter == 'all') return notes.value

  return notes.value.filter((n) => n.state === $props.settings.notesFilter)
})
</script>

<template>
  <div class="flex w-full flex-col gap-2">
    <NuxtLink
      v-for="n in fNotes"
      :key="n.id"
      class="w-full rounded border border-neutral-700 p-2 hover:bg-base-100"
      :to="`/notes/${n.id}`"
    >
      {{ n.title }}
    </NuxtLink>

    <div v-if="notes?.length == 0" class="text-center">Nothing here yet</div>
  </div>
</template>
