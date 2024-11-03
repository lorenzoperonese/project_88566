<script setup lang="ts">
const message = ref('')

const $props = defineProps({
  messages: { type: Array as PropType<ChatMessage[]>, required: true },
  currentUserId: { type: String, required: true },
  currentRoomId: { type: String }
})

const $emits = defineEmits<{
  (e: 'send-message', message: string): void
}>()

const goToBottom = async () => {
  console.log('Scrolling')
  // Wait for messages to load
  await nextTick()
  const chat = document.getElementById('messages-container')
  if (chat) {
    chat.scrollTop = chat.scrollHeight
  }
}

watch(
  () => $props.messages,
  async () => {
    goToBottom()
  }
)

onMounted(() => {
  goToBottom()
})

function sendMessage() {
  $emits('send-message', message.value)
  message.value = ''
}
</script>

<template>
  <div class="flex h-screen flex-col bg-primary-content">
    <div class="md:hidden">
      <label for="rooms" class="btn btn-primary drawer-button"
        >Open drawer</label
      >
    </div>
    <div
      class="h-full flex-1 flex-col overflow-y-auto px-4 py-2"
      id="messages-container"
    >
      <div v-for="m in messages" :key="m.id">
        <div
          class="chat"
          :class="{
            'chat-start': currentUserId != m.senderId,
            'chat-end': currentUserId == m.senderId
          }"
        >
          <div
            class="chat-bubble"
            :class="{ 'chat-bubble-accent': currentUserId == m.senderId }"
          >
            {{ m.content }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-between gap-4 p-2" v-show="currentRoomId">
      <input
        type="text"
        placeholder="Type here"
        class="input input-bordered w-full"
        v-model="message"
        @keyup.enter="sendMessage"
      />
      <button class="btn btn-primary" @click="sendMessage">Send</button>
    </div>
  </div>
</template>
