<script setup lang="ts">
import { register } from 'vue-advanced-chat'
import type {
  Room as ChatRoom,
  Message as ChatMessage
} from 'vue-advanced-chat'

register()

import { useWebSocket } from '@vueuse/core'

// TODO: DA CAMBIARE
const { status, data, send, open, close } = useWebSocket(
  'ws://localhost:3000/_ws'
)

watch(data, (newData) => {
  console.log('New data:', newData)

  if (newData.type != 'chat_message') return

  if (current_room_user_id.value == newData.roomId) {
    messages_loaded.value = false
    loading_messages.value = true

    let tmp = messages.value
    tmp.push(newData.message)
    messages.value = tmp

    loading_messages.value = false
    messages_loaded.value = true
  }

  console.log(newData)
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

const currentUserId = ref(userID)
const rooms = ref<ChatRoom[]>([])
const messages = ref<ChatMessage[]>([])
const roomActions = [
  { name: 'inviteUser', title: 'Invite User' },
  { name: 'removeUser', title: 'Remove User' },
  { name: 'deleteRoom', title: 'Delete Room' }
]

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

  //try {
  //  const { data, error } = await useFetch(`/api/chat/rooms/${roomId}`, {
  //    method: 'POST',
  //    body: JSON.stringify({
  //      content: content,
  //      roomId: roomId
  //    })
  //  })
  //
  //  if (error.value) {
  //    console.error('Error sending message')
  //    throw error.value.data.err
  //  }
  //
  //  console.log(data)
  //  console.log('Message sent:')
  //  let tmp = messages.value as ChatMessage[]
  //  tmp.push(data.value as ChatMessage)
  //  messages.value = tmp as ChatMessage[]
  //  console.log(messages.value)
  //} catch (e: any) {
  //  console.error(e)
  //}

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
    <vue-advanced-chat
      :current-user-id="currentUserId"
      :rooms-loaded="rooms_loaded"
      :messages-loaded="messages_loaded"
      :rooms="JSON.stringify(rooms)"
      :messages="JSON.stringify(messages)"
      :room-actions="JSON.stringify(roomActions)"
      :show-files="false"
      :show-audio="false"
      @add-room="showAddRoom"
      @fetch-messages="fetchMessages($event.detail[0])"
      @send-message="sendMessage($event.detail[0])"
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
