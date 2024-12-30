<script setup lang="ts">
//import { useWebSocket } from '@vueuse/core'

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

// TODO: DA CAMBIARE
//const { status, data, send, open, close } = useWebSocket(
//  `ws://${window.location.host}/_ws`
//)

const roomFromReceiver = (senderId: string) => {
  return rooms.value.find((r) => r.receiver.id == senderId)
}

//watch(data, (newData) => {
//  console.log('New data:', newData)
//
//  const d = JSON.parse(newData)
//
//  console.log('here3')
//
//  if (d.type == 'chat_message') {
//    if (
//      current_room_id.value &&
//      current_room_id.value == roomFromReceiver(d.senderId)?.id
//    ) {
//      fetchMessages(current_room_id.value)
//    } else {
//      $toast.info('New message from ' + roomFromReceiver(d.senderId)?.roomName)
//    }
//  } else if (d.type == 'room_add') {
//    console.log('Adding room')
//    fetchRooms()
//  } else if (d.type == 'error') {
//    $toast.error(d.message)
//  }
//})

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

  //const res = send(
  //  JSON.stringify({
  //    type: 'room_add',
  //    person: name,
  //    senderId: userID
  //  })
  //)

  //if (!res) {
  //  $toast.error('Error adding room')
  //  return
  //}

  fetchRooms()
}

async function sendMessage(message: string) {
  //const res = send(
  //  JSON.stringify({
  //    type: 'chat_message',
  //    roomId: current_room_id.value,
  //    content: message,
  //    senderId: userID
  //  })
  //)

  //if (!res) {
  //  $toast.error('Error sending message')
  //  return
  //}

  if (current_room_id.value) {
    fetchMessages(current_room_id.value)
  }
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
