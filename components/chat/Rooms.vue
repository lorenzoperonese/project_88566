<script setup lang="ts">
import { defineProps, defineEmits, defineModel } from 'vue'

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
  $emits('add-room', add_room_name.value)
}

const searchRooms = computed(() => {
  return $props.rooms.filter((r) => r.roomName.includes(search.value))
})
</script>

<template>
  <div class="flex flex-col p-2">
    <header>
      <div class="flex justify-between gap-4">
        <input
          type="text"
          placeholder="Search"
          class="input input-bordered w-full"
          v-model="search"
        />
        <button class="btn btn-secondary" onclick="room_adder.showModal()">
          Add room
        </button>
      </div>

      <dialog id="room_adder" class="modal">
        <div class="modal-box">
          <h3 class="text-lg font-bold">Add room:</h3>
          <div class="mt-5 flex justify-between gap-2">
            <input
              type="text"
              placeholder="Type here"
              class="input input-bordered w-full"
              v-model="add_room_name"
            />
            <form method="dialog">
              <button class="btn btn-primary" @click="addRoom">Add</button>
            </form>
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
            @click="current_room_id = r.id"
            class="flex items-center justify-center rounded border border-neutral p-2 text-lg font-bold hover:border-neutral-content hover:bg-base-200"
          >
            {{ r.roomName }}
          </div>
        </template>
      </div>

      <div v-if="searchRooms.length == 0">No rooms found :(</div>
    </main>
  </div>
</template>
