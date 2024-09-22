<script setup lang="ts">
const $props = defineProps({
  notes: { type: Array as PropType<Note[]>, required: true }
})
</script>

<template>
  <div>
    <div v-if="$props.notes.length > 0">
      <template v-for="note in $props.notes" :key="note.id">
        <RouterLink :to="`/notes/${note.id}`">
          <NotesNote :note="note" />
        </RouterLink>
      </template>
    </div>
    <div v-else>No notes yet...</div>
  </div>
</template>
