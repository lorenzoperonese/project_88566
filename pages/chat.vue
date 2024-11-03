<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'

const adding_room = ref(false)
const current_room_id = ref<string | undefined>()
const error = ref('')

const loading_rooms = ref(true)
const loading_messages = ref(true)
const rooms_loaded = ref(false)
const messages_loaded = ref(false)
const { getSession } = useAuth()
const userID: string = (toRaw(await getSession()) as any)?.s.user_id

const rooms = ref<ChatRoom[]>([])
const messages = ref<ChatMessage[]>([])

watch(current_room_id, async (newRoomId) => {
  if (newRoomId) {
    console.log('Room changed')
    await fetchMessages(newRoomId)
  }
})

// TODO: DA CAMBIARE
const { status, data, send, open, close } = useWebSocket(
  'ws://localhost:3000/_ws'
)

watch(data, (newData) => {
  console.log('New data:', newData)

  const d = JSON.parse(newData)

  console.log('here3')

  if (d.type == 'chat_message') {
    if (current_room_id.value) {
      fetchMessages(current_room_id.value)
    }
    //console.log("here4")
    //if (current_room_user_id.value == d.roomId) { messages_loaded.value = false
    //  loading_messages.value = true
    //
    //  let tmp = messages.value
    //  tmp.push(d.message)
    //  messages.value = tmp
    //
    //  loading_messages.value = false
    //  messages_loaded.value = true
    //}
  } else if (d.type == 'room_add') {
    console.log('Adding room')
    fetchRooms()
  }
})

onMounted(async () => {
  await fetchRooms()
})

async function fetchRooms() {
  rooms_loaded.value = false
  const data = await $fetch('/api/chat/rooms')
  rooms.value = data as ChatRoom[]
  loading_rooms.value = false
  rooms_loaded.value = true
}

async function fetchMessages(roomId: string) {
  console.log('Fetching messages')
  loading_messages.value = true
  messages_loaded.value = false

  const data = await $fetch(`/api/chat/rooms/${roomId}`)
  messages.value = data as ChatMessage[]
  console.log('Messages fetched: ', messages.value)
  loading_messages.value = false
  messages_loaded.value = true
}

async function addRoom(name: string) {
  try {
    send(
      JSON.stringify({
        type: 'room_add',
        person: name,
        senderId: userID
      })
    )

    fetchRooms()
  } catch (e: any) {
    console.error(e)
    error.value = e
  }
}

async function sendMessage(message: string) {
  try {
    send(
      JSON.stringify({
        type: 'chat_message',
        roomId: current_room_id.value,
        content: message,
        senderId: userID
      })
    )

    if (current_room_id.value) {
      fetchMessages(current_room_id.value)
    }
  } catch (e: any) {
    console.error(e)
    error.value = e
  }
}
</script>

<template>
  <div class="h-screen min-h-screen">
    <div class="flex h-full">
      <ChatRooms
        :rooms="rooms"
        class="w-1/3"
        @add-room="addRoom"
        v-model="current_room_id"
      />
      <ChatMessages
        :messages="messages"
        :currentUserId="userID"
        @send-message="sendMessage"
        class="w-full"
      />
    </div>
  </div>
</template>
