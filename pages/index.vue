<script setup lang="ts">
definePageMeta({
  layout: 'navbar'
})
</script>

<template>
  <div>
    <h1 class="p-5 text-xl font-bold">Home page</h1>
    <div class="flex flex-col gap-2 p-5 md:flex-row">
      <RouterLink
        class="h-full w-60 overflow-clip rounded-lg bg-base-300 p-4 shadow-lg"
        to="/calendar"
      >
        <div class="text-center text-lg font-bold">Calendar</div>

        <div class="divider"></div>

        <CalendarPreview class="max-h-72 overflow-y-auto py-2" />
      </RouterLink>

      <NuxtLink
        class="h-full w-60 overflow-clip rounded-lg bg-base-300 p-4 shadow-lg"
        to="/notes"
      >
        <div class="text-center text-lg font-bold">Notes</div>

        <div class="divider"></div>

        <NotesPreview class="max-h-72 overflow-y-auto py-2" />
      </NuxtLink>
      <NuxtLink
        class="h-full w-60 overflow-clip rounded-lg bg-base-300 p-4 shadow-lg"
        to="/pomodoro"
      >
        <div class="text-center text-lg font-bold">Pomodoro</div>

        <div class="divider"></div>

        <PomodoroPreview class="max-h-72 overflow-y-auto py-2" />
      </NuxtLink>
      <NuxtLink
        class="h-full w-60 overflow-clip rounded-lg bg-base-300 p-4 shadow-lg"
        to="/chat"
      >
        <div class="text-center text-lg font-bold">Chat</div>

        <div class="divider"></div>

        <ChatPreview class="max-h-72 overflow-y-auto py-2" />
      </NuxtLink>

      <NuxtLink
        class="h-full w-60 overflow-clip rounded-lg bg-base-300 p-4 shadow-lg"
        to="/projects"
      >
        <div class="text-center text-lg font-bold">Projects</div>

        <div class="divider"></div>

        <ProjectsPreview class="max-h-72 overflow-y-auto py-2" />
      </NuxtLink>
    </div>

    <h1 class="mt-5 pl-5 text-xl font-bold">Notifications</h1>
    <div class="p-5">
      <NotifyPermission />
    </div>

    <div class="divider"></div>

    <NotificationsMenu />
  </div>
</template>
