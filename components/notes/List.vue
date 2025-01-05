<script setup lang="ts">
const $props = defineProps<{
  notes: Note[] | null
}>()

const $emits = defineEmits<{
  (e: 'delete' | 'duplicate', id: string): void
  (e: 'mobileSearch'): void
  (e: 'mobileCategories'): void
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

      <div class="flex items-end md:hidden">
        <button class="btn btn-neutral btn-sm" @click="$emits('mobileSearch')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-4 w-4 opacity-70"
          >
            <path
              fill-rule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div class="flex items-end md:hidden">
        <button
          class="btn btn-neutral btn-sm"
          @click="$emits('mobileCategories')"
        >
          <img src="/assets/categories.svg" class="h-6 w-6" />
        </button>
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
