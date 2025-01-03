<script setup lang="ts">
const $props = defineProps({
  noteTask: { type: Object as PropType<NoteTask>, required: true },
  today: { type: Date, required: true },
  displayDate: { type: Date, required: false },
  fullDate: { type: Boolean, default: false }
})

const isInPast = computed(() => {
  if ($props.displayDate) {
    return isInThePast($props.today, $props.displayDate)
  } else {
    return false
  }
})
</script>

<template>
  <NuxtLink :to="`/notes/${$props.noteTask.note_id}`">
    <div
      class="mt-1 cursor-pointer rounded bg-primary-content p-1 text-xs text-accent hover:bg-blue-200"
      :class="{ 'opacity-60': isInPast }"
    >
      <div :class="['font-semibold', { 'line-through': $props.noteTask.done }]">
        {{ $props.noteTask.title }}
      </div>
      <div>
        <div v-if="$props.fullDate">
          {{ formatDate(noteTask.end) }} - {{ formatTime(noteTask.end) }}
        </div>
        <div v-else>{{ formatTime(noteTask.end) }}</div>
      </div>
    </div>
  </NuxtLink>
</template>
