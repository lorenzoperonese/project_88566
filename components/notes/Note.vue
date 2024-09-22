<script setup lang="ts">
const $props = defineProps({
  note: { type: Object as PropType<Note>, required: true }
})
</script>

<template>
  <div class="m-2 rounded-lg border p-2">
    <div>ID: {{ $props.note.id }}</div>
    <div>Title: {{ $props.note.title }}</div>
    <div>Body: {{ $props.note.body }}</div>
  </div>
</template>
