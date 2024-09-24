<script setup lang="ts">
const $props = defineProps({
  notes: { type: Array as PropType<Note[]>, required: true }
})

const $emits = defineEmits<{
  (e: 'delete', id: string): void
}>()
</script>

<template>
  <div>
    <div v-if="$props.notes.length > 0">
      <template v-for="note in $props.notes" :key="note.id">
        <NotesNote :note="note" @delete="$emits('delete', note.id)" />
      </template>
    </div>
    <div v-else>No notes yet...</div>
  </div>
</template>
