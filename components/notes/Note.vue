<script setup lang="ts">
const $props = defineProps({
  note: { type: Object as PropType<Note>, required: true }
})

const $emits = defineEmits<{
  (e: 'delete'): void
}>()
</script>

<template>
  <div class="m-2 flex justify-between gap-4 rounded-lg border p-2">
    <div class="w-full">
      <NuxtLink :to="`/notes/${$props.note.id}`">
        <!-- div>ID: {{ $props.note.id }}</div -->
        <div class="text-2xl font-extrabold">{{ $props.note.title }}</div>
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
        class="rounded-lg border bg-red-200 p-2 hover:bg-red-400"
        @click="$emits('delete')"
      >
        Delete
      </button>
    </div>
  </div>
</template>
