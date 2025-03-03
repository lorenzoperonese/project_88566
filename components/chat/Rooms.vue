<script setup lang="ts">
const { $toast } = useNuxtApp()

const { data: _users } = await useFetch<User[]>('/api/users')
const modal = useTemplateRef('room_adder_modal')

function showModal() {
  modal.value?.showModal()
}

function closeModal() {
  modal.value?.close()
}

const current_room_id = defineModel<string | undefined>({
  default: undefined
})

const add_room_name = ref('')
const search = ref('')

const $props = defineProps({
  rooms: { type: Array as PropType<ChatRoom[]>, required: true }
})

const $emits = defineEmits<{
  (e: 'add-room', room: string): void
}>()

function addRoom() {
  const receiver_id = _users.value?.find(
    (u) => u.username == add_room_name.value
  )?.id

  if (!receiver_id) {
    $toast.error('User not found')
    closeModal()
    return
  }

  $emits('add-room', receiver_id)
  closeModal()
}

const searchRooms = computed(() => {
  return $props.rooms.filter((r) => r.roomName.includes(search.value))
})
</script>

<template>
  <div class="flex flex-col p-2">
    <header>
      <div class="flex justify-between gap-4">
        <label class="input input-bordered flex flex-1 items-center gap-2">
          <input
            v-model="search"
            type="text"
            class="grow"
            placeholder="Search"
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-4 w-4 opacity-70"
          >
            <path
              fill-rule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clip-rule="evenodd"
            />
          </svg>
        </label>
        <div class="grid">
          <button
            class="btn btn-circle btn-info btn-sm place-self-center"
            @click="showModal"
          >
            <svg
              class="h-5 w-5 opacity-70"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" />
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        </div>
      </div>

      <dialog ref="room_adder_modal" class="modal modal-top md:modal-middle">
        <div class="modal-box">
          <h3 class="text-lg font-bold">Add room:</h3>
          <div class="mt-5 flex justify-between gap-2">
            <input
              v-model="add_room_name"
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full"
            />
            <button class="btn btn-info" @click="addRoom">Add</button>
          </div>
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </header>

    <div class="divider"></div>

    <main>
      <div class="flex flex-col gap-2">
        <template v-for="r in searchRooms" :key="r.id">
          <div
            :class="{
              'border-neutral-content bg-base-200': current_room_id == r.id
            }"
            class="flex items-center rounded border border-neutral p-2 text-lg font-bold hover:border-neutral-content hover:bg-base-200"
            @click="current_room_id = r.id"
          >
            <div class="flex justify-start gap-4">
              <img
                :src="getAvatarLink(r.receiver.avatar)"
                alt="avatar"
                class="h-10 w-10 rounded-full"
              />
              <div class="flex items-center">
                {{ r.roomName }}
              </div>
            </div>
          </div>
        </template>
      </div>

      <div v-if="searchRooms.length == 0">No rooms found :(</div>
    </main>
  </div>
</template>
