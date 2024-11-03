<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const add_room_name = ref('')

const $props = defineProps({
  rooms: { type: Array as PropType<ChatRoom[]>, required: true }
})

const $emits = defineEmits<{
  (e: 'add-room', room: string): void
}>()

function addRoom() {
  $emits('add-room', add_room_name.value)
}
</script>

<template>
  <div>
    <div>
      <button class="btn btn-secondary" onclick="room_adder.showModal()">
        Add room
      </button>
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
    </div>
    <div v-for="r in rooms" :key="r.id">
      <div class="border">
        {{ r.roomName }}
      </div>
    </div>
  </div>
</template>
