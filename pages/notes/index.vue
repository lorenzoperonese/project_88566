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
    <div class="flex">
      <Transition name="slide-fade">
        <div
          v-show="__showSideMenu"
          class="z-10 w-80 bg-white p-4 drop-shadow-lg"
        >
          <div class="flex justify-between border-b pb-2">
            <div class="p-2 text-xl font-bold">Filters</div>
            <button
              class="rounded-lg border p-2 hover:bg-gray-200"
              @click="__showSideMenu = false"
            >
              Close
            </button>
          </div>
          <div class="mb-2 mt-2 border-b pb-2">
            <input
              v-model="_search"
              type="text"
              class="w-full rounded-lg border p-2 outline-none"
              placeholder="Search..."
            />
          </div>
          <div>
            <div class="text-lg font-bold">Categories</div>
            <div class="ml-2">
              <ul class="list-inside list-disc">
                <li
                  v-for="category in _notesCategories"
                  :key="category.id"
                  class="flex justify-between"
                >
                  <div>
                    {{ category.name }}
                  </div>
                  <button
                    class="text-gray-400 hover:text-black"
                    @click="deleteCategory(category.id)"
                  >
                    x
                  </button>
                </li>
              </ul>
            </div>
            <div class="ml-2 flex justify-between">
              <input
                v-model="_newCategory"
                type="text"
                class="border-b outline-none"
                placeholder="New category"
              />
              <button
                class="text-xl text-gray-400 hover:text-black"
                @click="
                  addCategory({
                    id: '0',
                    name: _newCategory
                  })
                "
              >
                +
              </button>
            </div>
          </div>
        </div>
      </Transition>
      <div class="w-full p-5">
        <NotesAdder @save="addNote" />
        <NotesList
          :notes="_search ? _filteredNotes : _notes"
          class="h-svh overflow-y-auto"
          @delete="deleteNote"
          @duplicate="duplicate"
        />
      </div>
    </div>

    <button
      class="position absolute left-5 top-5 rounded-lg border p-2"
      @click="__showSideMenu = true"
    >
      MENU
    </button>
  </div>
</template>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s linear;
}

.slide-fade-leave-active {
  transition: all 0.3s linear;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(-400px);
}
</style>
