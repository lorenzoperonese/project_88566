<script setup lang="ts"></script>

<template>
  <div class="flex flex-col gap-4">
    <form method="dialog" class="md:hidden">
      <button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
        ✕
      </button>
    </form>
    <h1 class="text-center text-xl font-bold">Debug</h1>
    <p>This pages is for debugging purposes only</p>
    <div class="divider">Push Notifications</div>
    <PushNotificationsDebug />
    <div class="divider">Internal Notifications</div>
    <NotificationsMenuDebug />
    <div class="divider">Websockets</div>
    <Connection />
  </div>
</template>
