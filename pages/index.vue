<script setup lang="ts">
definePageMeta({
  layout: 'navbar'
})

const { data: settings } = await useFetch<Settings>('/api/settings')

const me = await getME()

async function fetchSettings() {
  const tmp = await $fetch('/api/settings')
  if (!tmp) {
    return
  }
  settings.value = tmp as Settings
}

const updateSettings = inject('settings')
watch(updateSettings as any, () => {
  if ((updateSettings as any).value) {
    fetchSettings()
  }
})
</script>

<template>
  <div class="flex flex-col items-center">
    <h1 class="p-5 text-xl font-bold">Home page</h1>
    <div
      class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-6"
    >
      <RouterLink
        class="h-full w-60 overflow-clip rounded-lg bg-base-300 p-4 shadow-lg"
        to="/calendar"
      >
        <div class="text-center text-lg font-bold">Calendar</div>

        <div class="divider"></div>

        <CalendarPreview
          :settings="settings.home"
          v-if="settings?.home.showCalendar"
          class="max-h-72 overflow-y-auto py-2"
        />
      </RouterLink>

      <NuxtLink
        class="h-full w-60 overflow-clip rounded-lg bg-base-300 p-4 shadow-lg"
        to="/notes"
      >
        <div class="text-center text-lg font-bold">Notes</div>

        <div class="divider"></div>

        <NotesPreview
          :settings="settings.home"
          v-if="settings?.home.showNotes"
          class="max-h-72 overflow-y-auto py-2"
        />
      </NuxtLink>
      <NuxtLink
        class="h-full w-60 overflow-clip rounded-lg bg-base-300 p-4 shadow-lg"
        to="/pomodoro"
      >
        <div class="text-center text-lg font-bold">Pomodoro</div>

        <div class="divider"></div>

        <PomodoroPreview
          :settings="settings.home"
          v-if="settings?.home.showPomodoro"
          class="max-h-72 overflow-y-auto py-2"
        />
      </NuxtLink>
      <NuxtLink
        class="h-full w-60 overflow-clip rounded-lg bg-base-300 p-4 shadow-lg"
        to="/chat"
      >
        <div class="text-center text-lg font-bold">Chat</div>

        <div class="divider"></div>

        <ChatPreview
          :settings="settings.home"
          v-if="settings?.home.showChat"
          class="max-h-72 overflow-y-auto py-2"
        />
      </NuxtLink>

      <NuxtLink
        class="h-full w-60 overflow-clip rounded-lg bg-base-300 p-4 shadow-lg"
        to="/projects"
      >
        <div class="text-center text-lg font-bold">Projects</div>

        <div class="divider"></div>

        <ProjectsPreview
          :settings="settings.home"
          v-if="settings?.home.showProjects"
          class="max-h-72 overflow-y-auto py-2"
        />
      </NuxtLink>

      <NuxtLink
        v-if="isAdmin(me)"
        class="h-full w-60 overflow-clip rounded-lg bg-base-300 p-4 shadow-lg"
        to="/resources"
      >
        <div class="text-center text-lg font-bold">Resources</div>

        <div class="divider"></div>

        <div class="text-center">No preview available</div>
      </NuxtLink>
    </div>
  </div>
</template>
