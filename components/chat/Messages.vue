<script setup lang="ts">
const message = ref('')

const $props = defineProps({
  messages: { type: Array as PropType<ChatMessage[]>, required: true },
  currentUserId: { type: String, required: true },
  currentUserAvatar: { type: String, required: true },
  currentRoomId: { type: String },
  rooms: { type: Array as PropType<ChatRoom[]>, required: true }
})

const $emits = defineEmits<{
  (e: 'send-message', message: string): void
  (e: 'back'): void
}>()

const goToBottom = async () => {
  // Wait for messages to load
  await nextTick()
  const chat = document.getElementById('messages-container')
  if (chat) {
    chat.scrollTop = chat.scrollHeight
  }
}

const roomName = computed(() => {
  return $props.rooms.find((r) => r.id == $props.currentRoomId)?.roomName
})

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
  <div class="flex flex-col bg-base-100 md:bg-base-200">
    <div
      class="grid grid-cols-3 items-center border-b bg-base-200 p-2 md:hidden"
    >
      <button class="btn btn-outline btn-sm w-16" @click="$emits('back')">
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M6 12H18M6 12L11 7M6 12L11 17"
              class="stroke-neutral-content"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </g>
        </svg>
      </button>
      <div class="flex items-center gap-2">
        <img
          :src="getAvatarLink($props.currentUserAvatar)"
          alt="avatar"
          class="h-10 w-10 rounded-full"
        />
        <div class="text-xl font-bold">
          {{ roomName }}
        </div>
      </div>
    </div>
    <div
      id="messages-container"
      class="h-full flex-1 flex-col overflow-y-auto px-4 py-2"
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

    <div
      v-show="currentRoomId"
      class="mx-4 mb-2 flex justify-between gap-4 p-2"
    >
      <input
        v-model="message"
        type="text"
        placeholder="Type here"
        class="input input-bordered w-full placeholder:text-gray-600"
        @keyup.enter="sendMessage"
      />
      <button class="btn btn-primary" @click="sendMessage">Send</button>
    </div>
  </div>
</template>
