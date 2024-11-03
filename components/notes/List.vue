<script setup lang="ts">
const $props = defineProps({
  notes: { type: Array as PropType<Note[]>, required: true }
})

const $emits = defineEmits<{
  (e: 'delete' | 'duplicate', id: string): void
}>()
</script>

<template>
  <div class="mt-10">
    <div v-if="$props.notes.length > 0" class="flex flex-col gap-4">
      <template v-for="note in $props.notes" :key="note.id">
        <NotesNote
          :note="note"
          @delete="$emits('delete', note.id)"
          @duplicate="$emits('duplicate', note.id)"
        />
      </template>
    </div>
    <div v-else class="grid h-40">
      <div class="place-self-center">No notes yet...</div>
    </div>
  </div>
</template>
