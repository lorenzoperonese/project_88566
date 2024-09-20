<script setup lang="ts">
import { ref } from "vue";

const { status, signIn } = useAuth();

const _username = ref("");
const _password = ref("");

async function login() {
  const credentials = { username: _username.value, password: _password.value };
  await signIn(credentials, { callbackUrl: "/" });
}
</script>

<template>
  <div class="grid h-full">
    <div class="place-self-center rounded-xl border p-5 shadow-xl">
      <h1 class="mb-5 text-center text-xl font-bold">Selfie</h1>
      <form @click.prevent="" class="flex flex-col gap-5">
        <div>
          <label for="username">Username: </label>
          <input
            id="username"
            v-model="_username"
            type="text"
            required
            class="rounded-lg border p-2 outline-none"
          />
        </div>

        <div>
          <label for="password">Password: </label>
          <input
            id="password"
            v-model="_password"
            type="password"
            required
            class="rounded-lg border p-2 outline-none"
          />
        </div>

        <button
          @click="login"
          class="rounded-lg border bg-blue-200 p-2 hover:bg-blue-400"
        >
          Login
        </button>
      </form>
    </div>
  </div>
</template>
