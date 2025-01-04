<script setup lang="ts">
const $props = defineProps({
  task: { type: Object as PropType<Task>, required: true },
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
  <NuxtLink :to="`/calendar/t/${$props.task.id}`">
    <div
      class="mt-1 cursor-pointer rounded bg-primary-content p-1 text-xs text-accent hover:bg-blue-200"
      :class="{ 'opacity-60': isInPast }"
    >
      <div
        :class="['font-semibold', { 'line-through': $props.task.completed }]"
        class="overflow-x-clip whitespace-nowrap"
      >
        {{ $props.task.title }}
      </div>
      <div class="hidden md:block">
        <div>
          <div v-if="$props.fullDate">
            {{ formatDate(task.end) }} - {{ formatTime(task.end) }}
          </div>
          <div v-else>{{ formatTime(task.end) }}</div>
        </div>
        <div class="hidden lg:block" v-if="$props.task.category">
          🏷️ {{ $props.task.category }}
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
