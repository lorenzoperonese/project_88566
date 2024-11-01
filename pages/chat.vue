<script setup lang="ts">
import { register } from 'vue-advanced-chat'
import type {
  Room as ChatRoom,
  Message as ChatMessage
} from 'vue-advanced-chat'

register()

const adding_room = ref(false)
const add_room_name = ref('')
const error = ref('')

const loading_rooms = ref(true)
const loading_messages = ref(true)
const rooms_loaded = ref(false)
const messages_loaded = ref(false)

const currentUserId = ref('1')
const rooms = ref<ChatRoom[]>([])
const messages = ref<ChatMessage[]>([])
const roomActions = [
  { name: 'inviteUser', title: 'Invite User' },
  { name: 'removeUser', title: 'Remove User' },
  { name: 'deleteRoom', title: 'Delete Room' }
]

onMounted(async () => {
  await fetchRooms()
  await fetchMessages(1)
})

async function fetchRooms() {
  rooms_loaded.value = false

  const data = await $fetch('/api/chat/rooms')
  rooms.value = data as ChatRoom[]
  loading_rooms.value = false
  rooms_loaded.value = true
}

async function fetchMessages(room: number) {
  console.log('Fetching messages')
  loading_messages.value = true
  messages_loaded.value = false

  const data = await $fetch(`/api/chat/rooms/${room}`)
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
    const { data, error } = await useFetch('/api/chat/rooms', {
      method: 'POST',
      body: JSON.stringify({
        person: add_room_name.value
      })
    })

    if (error.value) {
      console.error('Error adding room')
      throw error.value.data.err
    }

    console.log(data)
    console.log('Adding room:')
    let tmp = rooms.value as ChatRoom[]
    // Fetch new room
    tmp.push(data.value as ChatRoom)

    rooms.value = tmp as ChatRoom[]
    console.log(rooms.value)

    adding_room.value = false
  } catch (e: any) {
    console.error(e)
    error.value = e
  }
}
</script>

<template>
  <div>
    <vue-advanced-chat
      :current-user-id="currentUserId"
      :rooms-loaded="rooms_loaded"
      :messages-loaded="messages_loaded"
      :rooms="JSON.stringify(rooms)"
      :messages="JSON.stringify(messages)"
      :room-actions="JSON.stringify(roomActions)"
      :show-files="false"
      :show-audio="false"
      @fetch-messages="fetchMessages(1)"
      @add-room="showAddRoom"
    />

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
