<script setup lang="ts">
const { signOut, data } = useAuth()

function logout() {
  try {
    signOut({ callbackUrl: '/login' })
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div class="p-2">
    <h1 class="font-bold text-2xl">PROFILE</h1>
    <div v-if="data">
      Logged in as {{ (data as any).s.username }}
    </div>
    <button class="p-2 rounded border hover:bg-red-300" @click="logout()">LOG OUT</button>
  </div>
</template>
