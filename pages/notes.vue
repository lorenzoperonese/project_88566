<script setup lang="ts">
const _notes = ref<Note[]>([])

function add() {
  try {
    useFetch('/api/notes', {
      method: 'POST',
      body: {
        title: 'Prova nota',
        body: 'Questo sarebbe il body della nota'
      }
    })
  } catch (err) {
    console.error(err)
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
    Hola
    <button class="rounded border p-2 hover:bg-gray-300" @click="add()">
      Add Note
    </button>
    <NotesList :notes="_notes" />
  </div>
</template>
