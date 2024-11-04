<script setup lang="ts">
const { signOut } = useAuth()

const session = ref<User | null>(null)
const error = ref('')

fetch('/api/session')
  .then((response) => {
    if (!response.ok) {
      throw new Error('During profile fetch: ' + response.statusText)
    }
    return response.json()
  })
  .then((data) => {
    session.value = data
  })
  .catch((e) => {
    console.error(e)
  })

function logout() {
  try {
    signOut({ callbackUrl: '/login' })
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-base-200">
    <div class="card w-1/2 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="text-center text-2xl font-bold">Profile</h2>

        <div class="divider divider-neutral"></div>

        <div v-if="session" class="flex flex-col gap-4">
          <div>
            <span> Username: </span>
            <span class="text-lg font-bold"> {{ session.username }} </span>
          </div>

          <div class="mt-10 flex justify-center">
            <button class="btn btn-warning" @click="logout">LOGOUT</button>
          </div>
        </div>

        <div v-else class="text-error">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>
