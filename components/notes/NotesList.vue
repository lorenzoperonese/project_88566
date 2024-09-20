<script setup lang="ts">
import Note from './Note.vue'

const $props = defineProps({
  notes: { required: true }
})
</script>

<template>
  <div>
    Notes list
    <div v-for="note in $props.notes" :key="(note as any).id">
      <Note :note="note" />
    </div>
  </div>
</template>
