<script setup lang="ts">
import { useWebSocket } from '@vueuse/core'

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
const { status, data, send, open, close } = useWebSocket(
  `ws://${window.location.host}/_ws`
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
  } else if (d.type == 'error') {
    $toast.error(d.message)
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
  if (rooms.value.find((r) => r.roomName == name)) {
    $toast.error('Room already exists')
    return
  }

  const res = send(
    JSON.stringify({
      type: 'room_add',
      person: name,
      senderId: userID
    })
  )

  if (!res) {
    $toast.error('Error adding room')
    return
  }

  fetchRooms()
}

async function sendMessage(message: string) {
  const res = send(
    JSON.stringify({
      type: 'chat_message',
      roomId: current_room_id.value,
      content: message,
      senderId: userID
    })
  )

  if (!res) {
    $toast.error('Error sending message')
    return
  }

  if (current_room_id.value) {
    fetchMessages(current_room_id.value)
  }
}

const closeRooms = () => {
  const rooms = document.getElementById('rooms') as HTMLInputElement
  rooms.checked = false
}
</script>

<template>
  <div class="h-screen">
    <div class="drawer h-full md:drawer-open">
      <input id="rooms" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex h-full flex-col">
        <ChatMessages
          :messages="messages"
          :currentUserId="userID"
          :currentRoomId="current_room_id"
          @send-message="sendMessage"
        />
      </div>
      <div class="drawer-side">
        <label
          for="rooms"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>

        <div
          class="h-full w-full overflow-clip border-r border-r-neutral bg-base-100 p-2"
        >
          <div class="mx-2 mb-4 flex justify-between">
            <div class="flex items-center justify-center">
              <h2 class="text-2xl font-bold">Rooms</h2>
            </div>
            <button class="btn btn-square md:hidden" @click="closeRooms">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <ChatRooms
            :rooms="rooms"
            class="h-full w-full"
            @add-room="addRoom"
            v-model="current_room_id"
          />
        </div>
      </div>
    </div>
  </div>
</template>
