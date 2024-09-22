<script setup lang="ts">
import Note from './Note.vue'

const $props = defineProps({
  notes: { type: Array as PropType<Note[]>, required: true }
})
</script>

<template>
  <div>
    Notes list
    <div v-if="$props.notes.length > 0">
      <template v-for="note in $props.notes" :key="(note as any).id">
        <Note :note="note" />
      </template>
    </div>
    <div v-else>No notes yet...</div>
  </div>
</template>
