<script setup lang="ts">
const $props = defineProps<{
  start: string
}>()

const _advance = ref(1)
const _period = ref(1)
const _endTime = ref<string>($props.start)
</script>

<template>
  <div>
    <form>
      <input v-model="_advance" type="number" class="rounded border p-2" />
      <select v-model="_period">
        <option value="1">Day</option>
        <option value="2">Week</option>
        <option value="3">Month</option>
        <option value="4">Year</option>
      </select>
      before at
      <input v-model="_endTime" type="time" class="border p-2" />
    </form>
  </div>
</template>
