<script setup lang="ts">
import { wsState, socket } from '@/utils/websocket'
definePageMeta({
  layout: 'navbar'
})

const { $toast } = useNuxtApp()

const current_room_id = ref<string | undefined>()

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

const roomFromReceiver = (senderId: string) => {
  return rooms.value.find((r) => r.receiver.id == senderId)
}

watch(wsState.chatMessages, (newData) => {
  console.log('New message received')
  const d = newData[newData.length - 1] as ChatMessage
  if (
    current_room_id.value &&
    current_room_id.value == roomFromReceiver(d.senderId)?.id
  ) {
    fetchMessages(current_room_id.value)
  } else {
    $toast.info('New message from ' + roomFromReceiver(d.senderId)?.roomName)
  }
})

watch(wsState.rooms, fetchRooms)

const route = useRoute()

onMounted(async () => {
  await fetchRooms()
  if (route.query.id) {
    current_room_id.value = route.query.id as string
    console.log('Room id:', current_room_id.value)
  }
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
  if (rooms.value.find((r) => r.roomName == name)) {
    $toast.error('Room already exists')
    return
  }

  socket.emit(
    'room_add',
    {
      receiverId: name,
      senderId: userID
    },
    (value: any) => {
      if (value.type !== 'success') {
        $toast.error('Error adding room')
        console.error(value.message)
        return
      }
      fetchRooms()
    }
  )
}

async function sendMessage(message: string) {
  if (!current_room_id.value) {
    $toast.error('No room selected')
    return
  }

  socket.emit(
    'chat_message',
    {
      roomId: current_room_id.value,
      content: message,
      senderId: userID
    },
    (value: any) => {
      if (value.type !== 'success') {
        $toast.error('Error sending message')
        console.error(value.message)
        return
      }
      if (current_room_id.value) {
        fetchMessages(current_room_id.value)
      }
    }
  )
}
</script>

<template>
  <div class="flex" style="height: calc(100vh - var(--navbar-height))">
    <ChatRooms
      v-model="current_room_id"
      :rooms="rooms"
      class="h-full"
      @add-room="addRoom"
    />

    <ChatMessages
      class="w-full"
      :messages="messages"
      :current-user-id="userID"
      :current-room-id="current_room_id"
      @send-message="sendMessage"
    />
  </div>
</template>
