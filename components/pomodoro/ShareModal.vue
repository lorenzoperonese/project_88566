<script setup lang="ts">
const { data: _users } = await useFetch<User[]>('/api/users')

const { $toast } = useNuxtApp()

const $props = defineProps({
  study: { type: Number as PropType<number>, default: 30 },
  break: { type: Number as PropType<number>, default: 5 },
  cycles: { type: Number as PropType<number>, default: 5 }
})

const modal = useTemplateRef('share-pomodoro-modal')
const _user = ref<string>('')

function open() {
  modal.value?.showModal()
}

function close() {
  modal.value?.close()
}

function share() {
  if (_user.value.trim() == '') {
    $toast.error('Username is required')
    return
  }

  if (!_users.value) {
    $toast.error('Users not found')
    return
  }

  const user = _users.value.filter((u) => u.username === _user.value)[0]

  if (!user) {
    $toast.error('User not found')
    return
  }

  sendNotificationFront(
    'Pomodoro shared',
    'You have a new shared pomodoro',
    user.username,
    'pomodoro-shared',
    `${$props.study},${$props.break},${$props.cycles}`
  )

  $toast.success('Pomodoro shared with ' + _user.value)
  close()
}
</script>

<template>
  <div>
    <button class="btn btn-secondary" @click="open()">Condividi</button>
    <dialog
      ref="share-pomodoro-modal"
      class="modal modal-bottom sm:modal-middle"
    >
      <div class="modal-box">
        <div class="flex flex-col gap-2">
          <h3 class="text-lg font-bold">Pomodoro sharing</h3>

          <div class="form-control">
            <div class="label">
              <label class="label-text">User</label>
            </div>
            <input v-model="_user" type="text" class="input input-bordered" />
          </div>

          <div class="modal-action">
            <button class="btn" @click="close">Close</button>
            <button class="btn btn-success" @click="share">Share</button>
          </div>
        </div>
      </div>
    </dialog>
  </div>
</template>
