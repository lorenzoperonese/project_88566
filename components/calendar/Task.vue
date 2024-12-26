<script setup lang="ts">
const $props = defineProps({
  task: { type: Object as PropType<Task>, required: true },
  today: { type: Date, required: true },
  fullDate: { type: Boolean, default: false }
})
</script>

<template>
  <NuxtLink :to="`/calendar/t/${$props.task.id}`">
    <div
      class="mt-1 cursor-pointer rounded bg-primary-content p-1 text-xs text-accent hover:bg-blue-200"
      :class="{ 'opacity-60': isInThePast($props.today, task) }"
    >
      <div
        :class="['font-semibold', { 'line-through': $props.task.completed }]"
      >
        {{ $props.task.title }}
      </div>
      <div>
        <div v-if="$props.fullDate">
          {{ formatDate(task.end) }} - {{ formatTime(task.end) }}
        </div>
        <div v-else>{{ formatTime(task.end) }}</div>
      </div>
      <div v-if="$props.task.category">🏷️ {{ $props.task.category }}</div>
    </div>
  </NuxtLink>
</template>
