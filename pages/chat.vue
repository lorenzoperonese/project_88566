<script setup lang="ts">
import { wsState, socket } from '@/utils/websocket'
definePageMeta({
  layout: 'navbar'
})

const { $toast } = useNuxtApp()

const current_room_id = ref<string | undefined>()

const { getSession } = useAuth()
const session = await getSession()
const userID: string = (toRaw(session) as any)?.s.user_id
const rooms = ref<ChatRoom[]>([])
const messages = ref<ChatMessage[]>([])

watch(current_room_id, async (newRoomId) => {
  if (newRoomId) {
    console.log('Room changed')
    await fetchMessages(newRoomId)
  }
})

const userAvatar = computed(() => {
  return (
    rooms.value.find((r) => r.id == current_room_id.value)?.receiver.avatar ||
    ''
  )
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
  <div style="height: calc(100vh - var(--navbar-height))">
    <div class="block h-full w-full md:flex">
      <ChatRooms
        v-model="current_room_id"
        :rooms="rooms"
        class="hidden h-full md:block"
        @add-room="addRoom"
      />

      <ChatRooms
        v-show="current_room_id === undefined"
        v-model="current_room_id"
        :rooms="rooms"
        class="block h-full md:hidden"
        @add-room="addRoom"
      />

      <ChatMessages
        v-show="current_room_id !== undefined"
        class="h-full w-full"
        :messages="messages"
        :current-user-id="userID"
        :current-user-avatar="userAvatar"
        :current-room-id="current_room_id"
        :rooms="rooms"
        @send-message="sendMessage"
        @back="current_room_id = undefined"
      />
    </div>
  </div>
</template>
