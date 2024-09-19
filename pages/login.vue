<script setup lang="ts">
import { ref } from 'vue';

const { status, signIn } = useAuth();

const _username = ref("");
const _password = ref("");

async function login() {
  const credentials = { username: _username.value, password: _password.value };
  await signIn(credentials, { callbackUrl: '/' });
}
</script>

<template>
  <div>
    <h1>LOGIN</h1>
    <form @click.prevent="">
      <label for="username">Username: </label>
      <input id="username" type="text" v-model="_username" />

      <label for="password">Password: </label>
      <input id="password" type="password" v-model="_password" />

      <button @click="login">
        Login
      </button>
    </form>
  </div>
  <div>
    {{ _username }} {{ _password }}
  </div>
  <div>
    {{ status }}
  </div>
</template>
