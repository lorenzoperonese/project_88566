<script setup lang="ts"></script>

<template>
  <div>
    <h1 class="p-5 text-xl font-bold">Home page</h1>
    <div class="flex gap-2 p-5">
      <RouterLink class="btn" to="/calendar">Calendario</RouterLink>
      <NuxtLink class="btn" to="/notes">Notes</NuxtLink>
      <NuxtLink class="btn" to="/pomodoro">Pomodoro</NuxtLink>
      <NuxtLink class="btn" to="/chat">chat</NuxtLink>
      <NuxtLink class="btn" to="/profile">Profile </NuxtLink>
    </div>

    <h1 class="mt-5 pl-5 text-xl font-bold">Notifications</h1>
    <div class="p-5">
      <NotifyPermission />
    </div>
  </div>
</template>
