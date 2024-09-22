<script setup lang="ts">
const _route = useRoute()
const _id = _route.params.id
const _note = ref<Note | null>(null)

onMounted(async () => {
  const res = await useFetch(`/api/notes/${_id}`)
  if (res.status.value == 'success' && res.data.value) {
    _note.value = res.data.value
  } else {
    console.error(res.error.value)
  }
})
</script>

<template>
  <div class="p-2">
    <div v-if="_note">
      <h1 class="text-2xl font-bold">
        {{ _note.title }}
      </h1>
      <p>
        {{ _note.body }}
      </p>
    </div>
    <div v-else>Something went wrong :(</div>
  </div>
</template>
