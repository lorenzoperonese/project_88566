<script setup lang="ts">
definePageMeta({
  layout: 'navbar'
})

const _route = useRoute()
const _id = _route.params.id
const _note = await $fetch(`/api/notes/${_id}`)
const _categories = await $fetch('/api/notes-categories')

const _categoryName = computed(() => {
  if (_note) {
    if (_note.category_id) {
      return _categories.find((e) => e.id == _note.category_id)?.name
    } else {
      return 'Not categorized'
    }
  }

  return 'Error'
})
</script>

<template>
  <div class="p-2">
    <NuxtLink to="/notes" class="btn btn-neutral"> Go Back </NuxtLink>
    <div v-if="_note">
      <h1 class="text-4xl font-extrabold">
        {{ _note.title }}
      </h1>
      <h2 class="text-xl font-extrabold text-gray-400">
        {{ _categoryName }}
      </h2>
      <h3 class="text-lg font-bold text-gray-300">
        {{ _note.state }}
      </h3>
      <h4>
        Created: {{ formatDate(_note.created_at || 0) }} -
        {{ formatTime(_note.created_at || 0) }}
      </h4>
      <h4>
        Updated: {{ formatDate(_note.updated_at || 0) }} -
        {{ formatTime(_note.updated_at || 0) }}
      </h4>
      <div class="prose">
        <MDC :value="_note.body" />
      </div>
    </div>
    <div v-else>Something went wrong :(</div>
  </div>
</template>
