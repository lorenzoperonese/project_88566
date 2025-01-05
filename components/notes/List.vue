<script setup lang="ts">
const $props = defineProps<{
  notes: Note[] | null
}>()

const $emits = defineEmits<{
  (e: 'delete' | 'duplicate', id: string): void
}>()

const sorting = ref('0')
const state = ref('all')

const sortedNotes = computed(() => {
  if (!$props.notes) return []

  let notes
  if (state.value === 'all') {
    notes = $props.notes
  } else {
    notes = $props.notes.filter((note) => {
      return note.state === state.value
    })
  }

  if (sorting.value === '0') {
    return notes.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sorting.value === '1') {
    return notes.sort((a, b) => {
      if (!a.updated_at || !b.updated_at) return 0
      return b.updated_at - a.updated_at
    })
  } else if (sorting.value === '2') {
    return notes.sort((a, b) => b.body.length - a.body.length)
  } else {
    return notes
  }
})
</script>

<template>
  <div class="mt-10 flex flex-col gap-4">
    <div class="flex justify-between md:flex-row">
      <div class="form-control">
        <div class="label">
          <span class="label-text">Sorting: </span>
        </div>
        <select
          class="select select-bordered select-xs md:select-md"
          v-model="sorting"
        >
          <option value="0">Alphabetical</option>
          <option value="1">Modification date</option>
          <option value="2">Length</option>
        </select>
      </div>

      <div class="form-control">
        <div class="label">
          <span class="label-text">State: </span>
        </div>
        <select
          class="select select-bordered select-xs md:select-md"
          v-model="state"
        >
          <option value="all">All</option>
          <option value="private">Private</option>
          <option value="public">Public</option>
          <option value="shared">Shared</option>
        </select>
      </div>
    </div>

    <div v-if="$props.notes?.length || 0 > 0" class="flex flex-col gap-4">
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
