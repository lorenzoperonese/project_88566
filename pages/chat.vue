<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'

const adding_room = ref(false)
const add_room_name = ref('')
const current_room_user_id = ref('')
const current_room_id = ref('')
const message_content = ref('')
const error = ref('')

const loading_rooms = ref(true)
const loading_messages = ref(true)
const rooms_loaded = ref(false)
const messages_loaded = ref(false)
const { getSession } = useAuth()
const userID: string = (toRaw(await getSession()) as any)?.s.user_id

const rooms = ref<ChatRoom[]>([])
const messages = ref<ChatMessage[]>([])

// TODO: DA CAMBIARE
const { status, data, send, open, close } = useWebSocket(
  'ws://localhost:3000/_ws'
)

watch(data, (newData) => {
  console.log('New data:', newData)

  const d = JSON.parse(newData)

  console.log('here3')

  if (d.type == 'chat_message') {
    fetchMessages(rooms.value[0])
    //console.log("here4")
    //if (current_room_user_id.value == d.roomId) {
    //  messages_loaded.value = false
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
  console.log('here1')
  await fetchRooms()
  console.log('here2')

  current_room_id.value = rooms.value[0].id

  fetchMessages(rooms.value[0])
})

async function fetchRooms() {
  rooms_loaded.value = false
  const data = await $fetch('/api/chat/rooms')
  rooms.value = data as ChatRoom[]
  loading_rooms.value = false
  rooms_loaded.value = true
}

async function fetchMessages(room: ChatRoom) {
  console.log('Fetching messages')
  loading_messages.value = true
  messages_loaded.value = false

  const data = await $fetch(`/api/chat/rooms/${room.id}`)
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

async function sendMessage() {
  try {
    send(
      JSON.stringify({
        type: 'chat_message',
        roomId: current_room_id.value,
        content: message_content.value,
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
  </div>

  <div>
    <input class="rounded border p-2" type="text" v-model="message_content" />
    <button @click="sendMessage">Send</button>
  </div>

  <!--DA SPOSTARE-->
  <div v-show="adding_room" class="mt-5">
    <input type="text" class="rounded border p-2" v-model="add_room_name" />
    <button class="rounded border p-2 hover:bg-gray-200" @click="addRoom">
      Add Room
    </button>
    <div class="text-red-600">
      {{ error }}
    </div>
  </div>
</template>
