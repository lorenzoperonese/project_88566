<script setup lang="ts">
const _notes = ref<Note[]>([])

const __showSideMenu = ref(false)
const _search = ref('')

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

function add(n: Note) {
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

async function fetchNotes() {
  const res = await $fetch('/api/notes')
  if (res) {
    _notes.value = res
  } else {
    console.error("Can't fetch notes")
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

function duplicate(id: string) {
  const n = _notes.value.find((x) => x.id == id)

  if (n) {
    add(n)
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
          <div class="mt-2">
            <input
              v-model="_search"
              type="text"
              class="w-full rounded-lg border p-2 outline-none"
              placeholder="Search..."
            />
          </div>
        </div>
      </Transition>
      <div class="w-full p-5">
        <NotesAdder @save="add" />
        <NotesList
          :notes="_search ? _filteredNotes : _notes"
          class="h-svh overflow-y-auto"
          @delete="deleteNote"
          @duplicate="duplicate"
        />
      </div>
    </div>

    <button
      class="position absolute left-5 top-5"
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
