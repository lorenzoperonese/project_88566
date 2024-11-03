<script setup lang="ts">
import { defineProps } from 'vue'

const message = ref('')

const $props = defineProps({
  messages: { type: Array as PropType<ChatMessage[]>, required: true },
  currentUserId: { type: String, required: true }
})

const $emits = defineEmits<{
  (e: 'send-message', message: string): void
}>()

console.log($props.currentUserId)

function sendMessage() {
  $emits('send-message', message.value)
}
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="bg-primary-content">
      <div class="">
        <div v-for="m in messages" :key="m.id">
          <div
            class="chat"
            :class="{
              'chat-start': currentUserId != m.senderId,
              'chat-end': currentUserId == m.senderId
            }"
          >
            <div class="chat-bubble">
              {{ m.content }}
            </div>
          </div>
        </div>
      </div>

      <div>
        <input
          type="text"
          placeholder="Type here"
          class="input input-bordered m-2 w-[90%]"
          v-model="message"
        />
        <button class="btn btn-primary" @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>
