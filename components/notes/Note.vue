<script setup lang="ts">
const $props = defineProps({
  note: { type: Object as PropType<Note>, required: true }
})

const categories = inject('notesCategories') as Ref<NoteCategory[]>

const _categoryName = computed(() => {
  if (categories) {
    if ($props.note.category_id) {
      return categories.value.find((e) => e.id == $props.note.category_id)?.name
    } else {
      return 'Not categorized'
    }
  }

  return 'Error'
})

const $emits = defineEmits<{
  (e: 'delete' | 'duplicate'): void
}>()
</script>

<template>
  <div class="m-2 flex justify-between gap-4 rounded-lg border p-2">
    <div class="w-full">
      <NuxtLink :to="`/notes/${$props.note.id}`">
        <!-- div>ID: {{ $props.note.id }}</div -->
        <div class="flex justify-between">
          <div class="text-2xl font-extrabold">{{ $props.note.title }}</div>
          <div class="h-full text-gray-600">
            {{ _categoryName }}
          </div>
        </div>
        <div class="prose prose-sm">
          <MDC :value="$props.note.body" />
        </div>
      </NuxtLink>
    </div>
    <div class="flex flex-col gap-2">
      <NuxtLink
        class="rounded-lg border bg-blue-200 p-2 hover:bg-blue-400"
        :to="`/notes/editor/${$props.note.id}`"
      >
        Modify
      </NuxtLink>
      <button
        class="rounded-lg border bg-green-200 p-2 hover:bg-green-400"
        @click="$emits('duplicate')"
      >
        Duplicate
      </button>
      <button
        class="rounded-lg border bg-red-200 p-2 hover:bg-red-400"
        @click="$emits('delete')"
      >
        Delete
      </button>
    </div>
  </div>
</template>
