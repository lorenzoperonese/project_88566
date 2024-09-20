<script setup lang="ts">
const { signOut } = useAuth()

function logout() {
  try {
    signOut({ callbackUrl: '/login' })
  } catch (err) {
    console.error(err)
  }
}
</script>

<template>
  <div>
    <h1>PROFILE</h1>
    <button @click="logout()">LOG OUT</button>
  </div>
</template>
