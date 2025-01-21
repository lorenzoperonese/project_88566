<script setup lang="ts">
const { data: _users } = await useFetch<User[]>('/api/users')
const me = await getME()

const { $toast } = useNuxtApp()

const $props = defineProps({
  state: { type: String as PropType<string>, default: 'private' }
})

const _state = ref<string>($props.state.toString())
const guest = ref('')
const guests = ref<string[]>([])
const guestsIDs = ref<string[]>([])

const $emits = defineEmits<{
  (e: 'save', g: string[], s: string): void
}>()

function addGuest() {
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

  if (guest.value === me.username) {
    $toast.error('You cannot add yourself')
    return
  }

  guests.value.push(guest.value)
  guestsIDs.value.push(
    _users.value.filter((u) => u.username === guest.value)[0].id
  )
  guest.value = ''
}

function removedGuest(g: string) {
  const index = guests.value.indexOf(g)
  guests.value.splice(index, 1)
  guestsIDs.value.splice(index, 1)
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
                <li
                  v-for="g in guests"
                  :key="g"
                  class="flex items-center gap-2"
                >
                  <button
                    class="btn btn-circle btn-error btn-xs"
                    @click="removedGuest(g)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
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
                  <div class="flex items-center">
                    <div>
                      {{ g }}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            <div class="flex gap-2">
              <input
                v-model="guest"
                type="text"
                placeholder="username"
                class="input input-bordered"
              />
              <button class="btn btn-success" @click.prevent="addGuest">
                Add
              </button>
            </div>
          </div>
        </div>

        <div class="modal-action">
          <button class="btn" @click.prevent="save">Close</button>
        </div>
      </div>
    </dialog>
  </div>
</template>
