<script setup lang="ts">
const session = ref<User | null>(null)

const { $toast } = useNuxtApp()

fetch('/api/session')
  .then((response) => {
    if (!response.ok) {
      throw new Error('During profile fetch: ' + response.statusText)
    }
    return response.json()
  })
  .then((data) => {
    session.value = data
    if (session.value) {
      avatar.value = session.value.avatar
    }
  })
  .catch((e) => {
    console.error(e)
  })

const avatar = ref('Aidan')
const passwd = ref('')

async function updatePassword() {
  if (!passwd.value) {
    $toast.error('Password cannot be empty')
    return
  }

  try {
    await $fetch('/api/password', {
      method: 'PUT',
      body: JSON.stringify({ password: passwd.value })
    })
    $toast.success('Password updated')
  } catch (e) {
    console.error(e)
    $toast.error('Failed to update password')
    return
  }
}
</script>

<template>
  <div class="">
    <h2 class="text-center text-2xl font-bold">Profile</h2>

    <div class="divider divider-neutral"></div>

    <div v-if="session" class="flex flex-col gap-4">
      <div>
        <span> Username: </span>
        <span class="text-lg font-bold"> {{ session.username }} </span>
      </div>

      <div class="form-control">
        <div class="label">
          <span class="label-text"> Change password </span>
        </div>
        <div class="flex justify-between gap-2">
          <input
            v-model="passwd"
            type="password"
            class="input input-sm input-bordered flex-1 md:input-md"
          />
          <button
            class="btn btn-primary btn-sm md:btn-md"
            @click="updatePassword"
          >
            Change
          </button>
        </div>
      </div>

      <div class="flex gap-4">
        <div class="flex items-center">
          <span> Avatar: </span>
        </div>
        <AvatarSelector v-model="session.avatar" class="" />
      </div>
    </div>
  </div>
</template>
