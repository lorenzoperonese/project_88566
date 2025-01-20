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

async function addNote(n: Note) {
  try {
    await $fetch('/api/notes', {
      method: 'POST',
      body: JSON.stringify(n)
    })
  } catch (err) {
    console.error(err)
  }

  fetchNotes()
}

async function addCategory(c: NoteCategory) {
  try {
    await $fetch('/api/notes-categories', {
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

// On mobile this view is a lot different
const _mobileSearching = ref(false)

watch(_mobileSearching, (val) => {
  _search.value = ''
})

const _mobileCategories = ref(false)
const modal = useTemplateRef('notes_categories_modal')

watch(_mobileCategories, (val) => {
  if (val) {
    showMobileCategories()
  } else {
    hideMobileCategories()
  }
})

const showMobileCategories = () => {
  if (modal.value === null) return
  modal.value.showModal()
}

const hideMobileCategories = () => {
  if (modal.value === null) return
  modal.value.close()
}
</script>

<template>
  <div>
    <div class="flex">
      <NotesMenu
        v-show="!_mobileSearching"
        v-model="_search"
        :categories="_notesCategories"
        :modal="false"
        class="hidden h-full border-r border-r-neutral md:block"
        style="height: calc(100vh - var(--navbar-height))"
        @add-category="addCategory"
        @delete-category="deleteCategory"
      />

      <div
        class="w-full overflow-y-auto p-5"
        style="height: calc(100vh - var(--navbar-height))"
      >
        <NotesAdder
          v-show="!_mobileSearching"
          class="flex-1"
          :categories="_notesCategories"
          @save="addNote"
        />

        <div>
          <input
            v-show="_mobileSearching"
            v-model="_search"
            type="text"
            placeholder="Search..."
            class="input input-bordered w-full p-2 placeholder:text-gray-600"
          />
        </div>

        <NotesList
          :notes="_search ? _filteredNotes : _notes"
          class=""
          @delete="deleteNote"
          @duplicate="duplicate"
          @mobile-search="_mobileSearching = !_mobileSearching"
          @mobile-categories="_mobileCategories = !_mobileCategories"
        />
      </div>
    </div>

    <dialog
      ref="notes_categories_modal"
      class="modal modal-bottom sm:modal-middle"
    >
      <div class="modal-box">
        <NotesMenu
          v-show="!_mobileSearching"
          v-model="_search"
          :categories="_notesCategories"
          :modal="true"
          class=""
          @add-category="addCategory"
          @delete-category="deleteCategory"
        />
        <div class="modal-action">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Close</button>
          </form>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>

    <TmButton class="fixed bottom-4 left-4" @update="fetchNotes()" />
  </div>
</template>
