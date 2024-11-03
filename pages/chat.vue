<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'

const { $toast } = useNuxtApp()

const current_room_id = ref<string | undefined>()
const new_message_sender = ref('')
const new_message_toast = ref(false)
const error = ref('')

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

const roomFromReceiver = (senderId: string) => {
  return rooms.value.find((r) => r.receiver.id == senderId)
}

watch(data, (newData) => {
  console.log('New data:', newData)

  const d = JSON.parse(newData)

  console.log('here3')

  if (d.type == 'chat_message') {
    if (
      current_room_id.value &&
      current_room_id.value == roomFromReceiver(d.senderId)?.id
    ) {
      fetchMessages(current_room_id.value)
    } else {
      $toast.info('New message from ' + roomFromReceiver(d.senderId)?.roomName)
    }
  } else if (d.type == 'room_add') {
    console.log('Adding room')
    fetchRooms()
  }
})

onMounted(async () => {
  await fetchRooms()
})

async function fetchRooms() {
  const data = await $fetch('/api/chat/rooms')
  rooms.value = data as ChatRoom[]
}

async function fetchMessages(roomId: string) {
  console.log('Fetching messages')

  const data = await $fetch(`/api/chat/rooms/${roomId}`)
  messages.value = data as ChatMessage[]
  console.log('Messages fetched: ', messages.value)
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
        :currentRoomId="current_room_id"
        @send-message="sendMessage"
        class="w-full"
      />
    </div>
  </div>
</template>
