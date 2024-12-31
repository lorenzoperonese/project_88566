<script setup lang="ts">
import { ref } from 'vue'
import { postMessageToWoker } from '~/utils/worker'

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

    postMessageToWoker({ type: 'authenticated' })
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
        <h2 class="card-title">Login</h2>
        <form @click.prevent="">
          <div class="form-control">
            <label for="input-mail" class="label">
              <span class="label-text"> Username or mail </span>
            </label>
            <div
              class="input input-bordered flex items-center gap-2 has-[:invalid]:border-error"
            >
              <input
                id="input-text"
                v-model="_username"
                type="text"
                class="X-required grow invalid:text-error"
                placeholder="Enter Username"
              />
            </div>
          </div>

          <div class="form-control">
            <label for="input-password" class="label">
              <span class="label-text"> Password </span>
            </label>
            <div
              class="input input-bordered flex items-center gap-2 has-[:invalid]:border-error"
            >
              <input
                id="input-password"
                v-model="_password"
                type="password"
                class="X-required grow invalid:text-error"
                placeholder="Enter password"
              />
            </div>
          </div>

          <div class="mt-5 text-error">
            {{ _error }}
          </div>

          <div class="form-control mt-6">
            <button class="btn btn-primary" @click="login">Login</button>
          </div>
        </form>

        <div class="divider">OR</div>
        <div class="text-center">
          <p>Don't have an account?</p>
          <NuxtLink to="/register" class="link link-primary"
            >Sign up now</NuxtLink
          >
        </div>
      </div>
    </div>
  </div>
</template>
