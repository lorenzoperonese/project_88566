<script setup lang="ts">
import { ref } from 'vue'
const { $registerPushNotifications } = useNuxtApp()

// login page is in dark mode by default
document.documentElement.setAttribute('data-theme', 'dark')
const { status, signIn } = useAuth()

function changeTheme() {
  fetch('/api/session')
    .then((response) => {
      if (!response.ok) {
        throw new Error('During profile fetch: ' + response.statusText)
      }
      return response.json()
    })
    .then((data) => {
      if (data) {
        const theme = data.theme
        document.documentElement.setAttribute('data-theme', theme)
      }
    })
    .catch((e) => {
      console.error(e)
    })
}

if (status.value == 'authenticated') {
  changeTheme()
  navigateTo('/')
}

const _username = ref('')
const _password = ref('')
const _error = ref('')

async function login() {
  const credentials = { username: _username.value, password: _password.value }
  try {
    await signIn(credentials, { callbackUrl: '/' })
    changeTheme()
    wsSendAuth()

    await setThemeFromBackend()

    if (window.Notification?.permission === 'granted') {
      try {
        const subscription = await $registerPushNotifications()
        console.log('Registered:', subscription)
      } catch (err) {
        console.error('Failed:', err)
      }
    }
  } catch (err: Error) {
    console.error(err)
    _error.value = err.response._data.err
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-base-200">
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-base md:text-xl">Login</h2>
        <form @click.prevent="">
          <div class="form-control">
            <label for="input-mail" class="label">
              <span class="label-text text-xs md:text-base">
                Username or mail
              </span>
            </label>
            <div
              class="input input-bordered flex items-center gap-2 has-[:invalid]:border-error"
            >
              <input
                id="input-text"
                v-model="_username"
                type="text"
                class="X-required grow text-xs invalid:text-error md:text-base"
                placeholder="Enter Username"
              />
            </div>
          </div>

          <div class="form-control">
            <label for="input-password" class="label">
              <span class="label-text text-xs md:text-base"> Password </span>
            </label>
            <div
              class="input input-bordered flex items-center gap-2 has-[:invalid]:border-error"
            >
              <input
                id="input-password"
                v-model="_password"
                type="password"
                class="X-required grow text-xs invalid:text-error md:text-base"
                placeholder="Enter password"
              />
            </div>
          </div>

          <div class="mt-5 text-error">
            {{ _error }}
          </div>

          <div class="form-control mt-6">
            <button class="btn btn-primary text-base md:text-lg" @click="login">
              Login
            </button>
          </div>
        </form>

        <div class="divider text-xs md:text-base">OR</div>
        <div class="text-center">
          <p class="text-xs md:text-base">Don't have an account?</p>
          <NuxtLink
            to="/register"
            class="link link-primary text-xs md:text-base"
            >Sign up now</NuxtLink
          >
        </div>
      </div>
    </div>
  </div>
</template>
