<script setup lang="ts">
import { wsState } from '@/utils/websocket'

const connected = computed(() => wsState.connected)
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex gap-2">
      <span>Status:</span>
      <span
        class="font-bold"
        :class="[{ 'text-success': connected, 'text-error': !connected }]"
        >{{ connected ? 'connected' : 'disconnected' }}</span
      >
    </div>
    <div class="flex gap-2">
      <span>Transport:</span>
      <span class="font-bold">{{ wsState.transport }}</span>
    </div>
  </div>
</template>
