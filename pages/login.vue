<script setup lang="ts">
import { ref } from 'vue'

const { status, signIn } = useAuth()

if (status.value == 'authenticated') {
  navigateTo('/')
}

const _username = ref('')
const _password = ref('')
const _error = ref('')

async function login() {
  const credentials = { username: _username.value, password: _password.value }
  try {
    await signIn(credentials, { callbackUrl: '/' })
  } catch (err: Error) {
    console.error(err)
    _error.value = err.response._data.err
  }
}
</script>

<template>
  <div class="grid h-full">
    <div class="place-self-center rounded-xl border p-5 shadow-xl">
      <h1 class="mb-5 text-center text-xl font-bold">Selfie</h1>
      <form class="flex flex-col gap-5" @click.prevent="">
        <div>
          <label for="username">Username: </label>
          <input
            id="username"
            v-model="_username"
            type="text"
            required
            class="w-full rounded-lg border p-2 outline-none"
          />
        </div>

        <div>
          <label for="password">Password: </label>
          <input
            id="password"
            v-model="_password"
            type="password"
            required
            class="w-full rounded-lg border p-2 outline-none"
          />
        </div>

        <button
          class="rounded-lg border bg-blue-200 p-2 hover:bg-blue-400"
          @click="login"
        >
          Login
        </button>
        <div class="text-red-600">
          {{ _error }}
        </div>
      </form>
    </div>
  </div>
</template>
