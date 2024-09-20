<script setup lang="ts">
const $props = defineProps({
  note: { required: true }
})
</script>

<template>
  <div class="m-2 rounded-lg border p-2">
    <div>ID: {{ (note as any).id }}</div>
    <div>Title: {{ (note as any).title }}</div>
    <div>Body: {{ (note as any).body }}</div>
  </div>
</template>
