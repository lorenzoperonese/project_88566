<script setup lang="ts">
const $props = defineProps({
  notes: { type: Array as PropType<Note[]>, required: true }
})

const $emits = defineEmits<{
  (e: 'delete' | 'duplicate', id: string): void
}>()

const sorting = ref('0')

const sortedNotes = computed(() => {
  if (sorting.value === '0') {
    return $props.notes.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sorting.value === '1') {
    return $props.notes.sort((a, b) => {
      if (!a.updated_at || !b.updated_at) return 0
      return b.updated_at - a.updated_at
    })
  } else if (sorting.value === '2') {
    return $props.notes.sort((a, b) => b.body.length - a.body.length)
  } else {
    return $props.notes
  }
})
</script>

<template>
  <div class="mt-10 flex flex-col gap-4">
    <div class="flex gap-2">
      <div class="label">
        <span class="label-text">Sorting: </span>
      </div>
      <select class="select select-bordered" v-model="sorting">
        <option value="0">Alphabetical</option>
        <option value="1">Modification date</option>
        <option value="2">Length</option>
      </select>
    </div>
    <div v-if="$props.notes.length > 0" class="flex flex-col gap-4">
      <template v-for="note in sortedNotes" :key="note.id">
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
