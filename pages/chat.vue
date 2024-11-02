<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'

// TODO: DA CAMBIARE
const { status, data, send, open, close } = useWebSocket(
  'ws://localhost:3000/_ws'
)

watch(data, (newData) => {
  console.log('New data:', newData)

  const d = JSON.parse(newData)

  if (d.type == 'chat_message') {
    if (current_room_user_id.value == d.roomId) {
      messages_loaded.value = false
      loading_messages.value = true

      let tmp = messages.value
      tmp.push(d.message)
      messages.value = tmp

      loading_messages.value = false
      messages_loaded.value = true
    }
  } else if (d.type == 'room_add') {
    console.log('Adding room')
    fetchRooms()
  }
})

send(JSON.stringify({ type: 'message', data: 'Hello' }))

const adding_room = ref(false)
const add_room_name = ref('')
const current_room_user_id = ref('')
const error = ref('')

const loading_rooms = ref(true)
const loading_messages = ref(true)
const rooms_loaded = ref(false)
const messages_loaded = ref(false)
const { getSession } = useAuth()
const userID: string = (toRaw(await getSession()) as any)?.s.user_id

const rooms = ref<ChatRoom[]>([])
const messages = ref<ChatMessage[]>([])

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

async function fetchMessages({ room, options }: any) {
  room = toRaw(room) as ChatRoom
  console.log(room)
  console.log(options)
  console.log('Fetching messages')
  loading_messages.value = true
  messages_loaded.value = false

  const data = await $fetch(`/api/chat/rooms/${room.roomId}`)
  messages.value = data as ChatMessage[]
  console.log('Messages fetched: ', messages.value)
  loading_messages.value = false
  messages_loaded.value = true
}

function showAddRoom() {
  adding_room.value = true
}

async function addRoom() {
  // Should check if this room exist :)
  // add_room_name.value

  try {
    send(
      JSON.stringify({
        type: 'room_add',
        person: add_room_name.value,
        senderId: userID
      })
    )

    fetchRooms()
  } catch (e: any) {
    console.error(e)
    error.value = e
  }
}

async function sendMessage({
  roomId,
  content,
  files,
  replyMessage,
  userTag
}: {
  roomId: string
  content: string
  files: any[]
  replyMessage: any
  userTag: any
}) {
  console.log('Sending message')
  console.log(roomId)
  console.log(content)
  console.log(files)
  console.log(replyMessage)
  console.log(userTag)

  try {
    send(
      JSON.stringify({
        type: 'chat_message',
        roomId: roomId,
        content: content,
        senderId: userID
      })
    )
  } catch (e: any) {
    console.error(e)
    error.value = e
  }
}
</script>

<template>
  <div>
    <button @click="showAddRoom">Add room</button>
    <div>Rooms: {{ rooms }}</div>
    <div>Messages: {{ messages }}</div>

    <!-- DA SPOSTARE -->
    <div v-show="adding_room" class="mt-5">
      <input type="text" class="rounded border p-2" v-model="add_room_name" />
      <button class="rounded border p-2 hover:bg-gray-200" @click="addRoom">
        Add Room
      </button>
      <div class="text-red-600">
        {{ error }}
      </div>
    </div>
  </div>
</template>
