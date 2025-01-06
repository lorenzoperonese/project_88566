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

const me = await getME()
const isMine = computed(() => {
  if (!_note) return false
  return _note.user_id === me.id
})
</script>

<template>
  <div
    class="overflow-y-auto p-2"
    style="height: calc(100vh - var(--navbar-height))"
  >
    <div class="flex justify-between">
      <NuxtLink to="/notes" class="btn btn-neutral btn-sm md:btn-md">
        Go Back
      </NuxtLink>
      <NuxtLink
        v-if="isMine && _note"
        class="btn btn-info btn-sm md:btn-md"
        :to="`/notes/editor/${_note.id}`"
      >
        Modify
      </NuxtLink>
    </div>
    <div v-if="_note" class="mb-16 flex flex-col items-center">
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
      <div v-show="_note.todos && _note.todos.length > 0" class="divider"></div>
      <div
        v-show="_note.todos && _note.todos.length > 0"
        class="flex w-full flex-col items-center gap-4"
      >
        <div class="text-2xl font-bold">Todos:</div>
        <div class="w-full max-w-xl">
          <div v-for="t in _note.todos" class="grid grid-cols-2 gap-y-2">
            <div :class="{ 'line-through': t.done }" class="text-lg font-bold">
              {{ t.title }}
            </div>
            <div>{{ formatTime(t.end) }} {{ formatDate(t.end) }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>Something went wrong :(</div>
  </div>
</template>
