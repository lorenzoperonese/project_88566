<script setup lang="ts">
const { data: _users } = await useFetch<User[]>('/api/users')

const { $toast } = useNuxtApp()

const $props = defineProps({
  state: { type: String as PropType<String>, default: 'private' }
})

const _state = ref<string>($props.state.toString())
const guest = ref('')
const guests = ref<string[]>([])
const guestsIDs = ref<string[]>([])

const $emits = defineEmits<{
  (e: 'save', g: string[], s: string): void
}>()

function addGuest() {
  console.log(guest.value)
  if (guest.value.trim() == '') {
    $toast.error('Username is required')
    return
  }

  if (!_users.value) {
    $toast.error('User not found')
    return
  }

  const user = _users.value.filter((u) => u.username === guest.value)[0]
  if (!user) {
    $toast.error('User not found')
    return
  }

  if (guests.value.includes(guest.value)) {
    $toast.error('Username already added')
    return
  }

  guests.value.push(guest.value)
  guestsIDs.value.push(
    _users.value.filter((u) => u.username === guest.value)[0].id
  )
  guest.value = ''
}

const modal = useTemplateRef('note-modal')
function stateManagement() {
  modal.value?.showModal()
}

function save() {
  $emits('save', guestsIDs.value, _state.value)
  modal.value?.close()
}
</script>

<template>
  <div>
    <div>
      <button
        class="btn btn-neutral btn-sm md:btn-md"
        @click.prevent="stateManagement()"
      >
        {{ _state }}
      </button>
    </div>
    <dialog ref="note-modal" class="modal modal-bottom sm:modal-middle">
      <div class="modal-box">
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-bold">Note sharing</h3>

          <select v-model="_state" class="select select-bordered w-full">
            <option value="private">Private</option>
            <option value="public">Public</option>
            <option value="shared">Shared</option>
          </select>

          <div v-show="_state == 'shared'" class="flex flex-col gap-2">
            <div>
              <h4 class="text-lg font-bold">Guests</h4>
              <ul class="list-disc">
                <li v-for="g in guests" :key="g">{{ g }}</li>
              </ul>
            </div>
            <div class="flex gap-2">
              <input
                type="text"
                placeholder="username"
                class="input input-bordered"
                v-model="guest"
              />
              <button class="btn btn-success" @click="addGuest">Add</button>
            </div>
          </div>
        </div>

        <div class="modal-action">
          <button class="btn" @click="save">Close</button>
        </div>
      </div>
    </dialog>
  </div>
</template>
