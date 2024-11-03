<script setup lang="ts"></script>

<template>
  <div>
    <h1 class="p-5 text-xl font-bold">Home page</h1>
    <div class="flex gap-2 p-5">
      <RouterLink
        class="button rounded-lg border p-2 hover:bg-gray-200"
        to="/calendar"
        >Calendario</RouterLink
      >
      <NuxtLink
        class="button rounded-lg border p-2 hover:bg-gray-200"
        to="/notes"
        >Notes</NuxtLink
      >
      <NuxtLink
        class="button rounded-lg border p-2 hover:bg-gray-200"
        to="/pomodoro"
        >Pomodoro</NuxtLink
      >
      <NuxtLink
        class="button rounded-lg border p-2 hover:bg-gray-200"
        to="/chat"
        >chat</NuxtLink
      >
      <NuxtLink
        to="/profile"
        class="button rounded-lg border p-2 hover:bg-gray-200"
        >Profile
      </NuxtLink>
    </div>
    <NotifyPermission />
  </div>
</template>
