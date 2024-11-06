<script setup lang="ts">
definePageMeta({
  layout: 'navbar'
})
</script>

<template>
  <div>
    <h1 class="p-5 text-xl font-bold">Home page</h1>
    <div class="flex flex-col gap-2 p-5 md:flex-row">
      <RouterLink class="btn" to="/calendar">Calendario</RouterLink>
      <NuxtLink class="btn" to="/notes">Notes</NuxtLink>
      <NuxtLink class="btn" to="/pomodoro">Pomodoro</NuxtLink>
      <NuxtLink class="btn" to="/chat">Chat</NuxtLink>
    </div>

    <h1 class="mt-5 pl-5 text-xl font-bold">Notifications</h1>
    <div class="p-5">
      <NotifyPermission />
    </div>

    <div class="divider"></div>

    <NotificationsMenu />
  </div>
</template>
