<script setup lang="ts">
definePageMeta({
  layout: 'navbar'
})

const { data: _notes } = await useFetch<Note[]>('/api/notes')
const { data: _notesCategories } = await useFetch<NoteCategory[]>(
  '/api/notes-categories'
)

const _search = ref('')

const _newCategory = ref('')

const _filteredNotes = computed(() => {
  if (_search.value.length == 0) {
    return _notes.value
  }

  if (_notes.value === null) return []

  const f = _notes.value.filter((e) => {
    return e.title.includes(_search.value) || e.body.includes(_search.value)
  })
  return f
})

provide('notesCategories', _notesCategories)

function addNote(n: Note) {
  try {
    $fetch('/api/notes', {
      method: 'POST',
      body: JSON.stringify(n)
    })
  } catch (err) {
    console.error(err)
  }

  fetchNotes()
}

function addCategory(c: NoteCategory) {
  try {
    $fetch('/api/notes-categories', {
      method: 'POST',
      body: JSON.stringify(c)
    })

    _newCategory.value = ''
  } catch (err) {
    console.error(err)
  }

  fetchCategories()
}

async function fetchNotes() {
  const res = await $fetch('/api/notes')
  if (res) {
    _notes.value = res
  } else {
    console.error("Can't fetch notes")
  }
}

async function fetchCategories() {
  const res = await $fetch('/api/notes-categories')
  if (res) {
    _notesCategories.value = res
  } else {
    console.error("Can't fetch notes categories")
  }
}

async function deleteNote(id: string) {
  try {
    await $fetch(`/api/notes/${id}`, { method: 'delete' })
  } catch (err) {
    console.log(err)
  }

  fetchNotes()
}

async function deleteCategory(id: string) {
  try {
    await $fetch(`/api/notes-categories/${id}`, { method: 'delete' })
  } catch (err) {
    console.log(err)
  }

  fetchCategories()
}

const me = await getME()

function duplicate(id: string) {
  if (_notes.value === null) return

  const n = _notes.value.find((x) => x.id == id)

  if (!n) {
    console.error("Can't find note for duplication")
    return
  }

  if (n.user_id != me.id) {
    n.user_id = '0'
    n.state = 'private'
    n.shared_with = []
  }

  addNote(n)
}
</script>

<template>
  <div class="flex">
    <NotesMenu
      v-model="_search"
      :categories="_notesCategories"
      class="h-full border-r border-r-neutral"
      style="height: calc(100vh - var(--navbar-height))"
      @add-category="addCategory"
      @delete-category="deleteCategory"
    />

    <div
      class="w-full overflow-y-auto p-5"
      style="height: calc(100vh - var(--navbar-height))"
    >
      <NotesAdder :categories="_notesCategories" @save="addNote" />
      <NotesList
        :notes="_search ? _filteredNotes : _notes"
        class=""
        @delete="deleteNote"
        @duplicate="duplicate"
      />
    </div>
  </div>
</template>
