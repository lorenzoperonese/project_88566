<script setup lang="ts">
const _notes = ref<Note[]>([])

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
  <div class="p-5">
    <NotesAdder @save="add" />
    <NotesList :notes="_notes" @delete="deleteNote" @duplicate="duplicate" />
  </div>
</template>
