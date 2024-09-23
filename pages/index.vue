<script setup lang="ts"></script>

<template>
  <div>
    <h1 class="p-5 text-xl font-bold">Home page</h1>
    <div class="flex gap-2 p-5">
      <RouterLink
        to="/profile"
        class="button rounded-lg border p-2 hover:bg-gray-200"
        >Profile
      </RouterLink>
      <RouterLink
        class="button rounded-lg border p-2 hover:bg-gray-200"
        to="/notes"
        >Notes</RouterLink
      >
      <RouterLink
        class="button rounded-lg border p-2 hover:bg-gray-200"
        to="/pomodoro"
        >Pomodoro</RouterLink>
    </div>
  </div>
</template>
