<script setup lang="ts">
import { wsState } from '@/utils/websocket'
wsConnect()

const connected = computed(() => wsState.connected)

const message = ref('')

function sendMessage() {
  wsSendMessage(message.value)
}
</script>

<template>
  <div>
    <p>Status: {{ connected ? 'connected' : 'disconnected' }}</p>
    <p>Transport: {{ wsState.transport }}</p>
    <div class="form-control w-full max-w-sm">
      <input
        v-model="message"
        type="text"
        class="input input-bordered"
        placeholder="Enter a message"
      />
      <button @click="sendMessage" class="btn btn-neutral">Send</button>
    </div>
  </div>
</template>
