<script setup lang="ts">
import { ref } from 'vue'
import { EyeIcon, EyeOffIcon } from 'lucide-vue-next'
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

const showPassword = ref(false)

async function login() {
  const credentials = { username: _username.value, password: _password.value }
  console.log('Logging in')
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
  } catch (err: any) {
    console.error(err)
    _error.value = err.response._data.err
  }
}
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gradient-to-br from-base-300 to-base-200 p-4"
  >
    <div class="card w-full max-w-md bg-base-100 shadow-2xl">
      <div class="card-body space-y-6">
        <div class="space-y-2 text-center">
          <h2 class="text-2xl font-bold">Welcome Back</h2>
          <p class="text-sm text-base-content/70">
            Sign in to your Selfie account
          </p>
        </div>

        <form class="space-y-5" @submit.prevent="login">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Username</span>
            </label>
            <div class="relative">
              <input
                v-model="_username"
                type="text"
                class="X-required input input-bordered w-full bg-base-100 pl-4 pr-4 transition-colors focus:border-primary"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-medium">Password</span>
            </label>
            <div class="relative">
              <input
                v-model="_password"
                :type="showPassword ? 'text' : 'password'"
                class="X-required input input-bordered w-full bg-base-100 pr-10 transition-colors focus:border-primary"
                placeholder="Choose a password"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 hover:text-primary"
                @click="showPassword = !showPassword"
              >
                <EyeIcon v-if="!showPassword" class="h-5 w-5" />
                <EyeOffIcon v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            v-if="_error"
            class="rounded-lg bg-error/10 p-3 text-sm text-error"
          >
            {{ _error }}
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full text-lg font-semibold transition-all hover:brightness-105"
          >
            Sign In
          </button>
        </form>

        <div class="my-6 flex items-center gap-4">
          <div class="h-px flex-1 bg-base-content/10"></div>
          <span class="text-sm text-base-content/70">OR</span>
          <div class="h-px flex-1 bg-base-content/10"></div>
        </div>

        <div class="space-y-2 text-center">
          <p class="text-base-content/70">Don't have an account?</p>
          <NuxtLink
            to="/register"
            class="inline-block font-medium text-primary hover:underline"
          >
            Create an account
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
