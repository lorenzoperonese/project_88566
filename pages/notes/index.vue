<script setup lang="ts">
const _notes = ref<Note[]>([])
const _notesCategories = ref<NoteCategory[]>([])

const __showSideMenu = ref(false)
const _search = ref('')

const _newCategory = ref('')

const _filteredNotes = computed<Note[]>(() => {
  if (_search.value.length == 0) {
    return _notes.value
  } else {
    const f = _notes.value.filter((e) => {
      return e.title.includes(_search.value) || e.body.includes(_search.value)
    })
    console.log(f)
    return f
  }
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

function duplicate(id: string) {
  const n = _notes.value.find((x) => x.id == id)

  if (n) {
    addNote(n)
  } else {
    console.error("Can't find not for duplication")
  }
}

onMounted(async () => {
  const res = await useFetch('/api/notes')
  if (res.status.value == 'success' && res.data.value) {
    _notes.value = res.data.value
  } else {
    console.error(res.error.value)
  }

  const res2 = await useFetch('/api/notes-categories')
  if (res2.status.value == 'success' && res2.data.value) {
    _notesCategories.value = res2.data.value
  } else {
    console.error(res2.error.value)
  }
})
</script>

<template>
  <div>
    <div class="drawer md:drawer-open">
      <input id="notes-menu" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content">
        <div class="w-full p-5">
          <NotesAdder :categories="_notesCategories" @save="addNote" />
          <NotesList
            :notes="_search ? _filteredNotes : _notes"
            class="h-svh overflow-y-auto"
            @delete="deleteNote"
            @duplicate="duplicate"
          />
        </div>

        <label for="notes-menu" class="btn btn-primary drawer-button md:hidden"
          >Open drawer</label
        >
      </div>
      <div class="drawer-side">
        <label
          for="notes-menu"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>
        <NotesMenu
          v-model="_search"
          :categories="_notesCategories"
          class="h-full border-r border-r-neutral"
          @add-category="addCategory"
          @delete-category="deleteCategory"
        />
      </div>
    </div>
  </div>
</template>
