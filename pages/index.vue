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

const pushPermission = ref(window.Notification?.permission)
function updatePushPermission() {
  pushPermission.value = window.Notification?.permission
}
</script>

<template>
  <div class="min-h-screen bg-base-100 px-4 py-8">
    <div class="container mx-auto max-w-7xl">
      <header class="mb-8 text-center">
        <h1 class="mb-2 text-3xl font-bold text-base-content">
          Hi {{ me.username.charAt(0).toUpperCase() + me.username.slice(1) }},
          Welcome to Your Dashboard
        </h1>
        <p class="text-base-content/70">
          Access all your tools and resources in one place
        </p>
      </header>

      <div
        class="grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <RouterLink
          to="/calendar"
          class="group card w-full max-w-sm bg-base-200 transition-all duration-300 hover:bg-base-300 hover:shadow-xl"
        >
          <div class="card-body">
            <div class="mb-4 flex items-center gap-3">
              <div class="rounded-lg bg-primary/10 p-2 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2
                class="card-title m-0 transition-colors group-hover:text-primary"
              >
                Calendar
              </h2>
            </div>
            <CalendarPreview
              v-if="settings?.home.showCalendar"
              :settings="settings.home"
              class="scrollbar-thin max-h-72 overflow-y-auto"
            />
          </div>
        </RouterLink>

        <NuxtLink
          to="/notes"
          class="group card w-full max-w-sm bg-base-200 transition-all duration-300 hover:bg-base-300 hover:shadow-xl"
        >
          <div class="card-body">
            <div class="mb-4 flex items-center gap-3">
              <div class="rounded-lg bg-accent/10 p-2 text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <h2
                class="card-title m-0 transition-colors group-hover:text-accent"
              >
                Notes
              </h2>
            </div>
            <NotesPreview
              v-if="settings?.home.showNotes"
              :settings="settings.home"
              class="scrollbar-thin max-h-72 overflow-y-auto"
            />
          </div>
        </NuxtLink>

        <NuxtLink
          to="/pomodoro"
          class="group card w-full max-w-sm bg-base-200 transition-all duration-300 hover:bg-base-300 hover:shadow-xl"
        >
          <div class="card-body">
            <div class="mb-4 flex items-center gap-3">
              <div class="rounded-lg bg-accent/10 p-2 text-red-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2
                class="card-title m-0 transition-colors group-hover:text-red-500"
              >
                Pomodoro
              </h2>
            </div>
            <PomodoroPreview
              v-if="settings?.home.showPomodoro"
              :settings="settings.home"
              class="scrollbar-thin max-h-72 overflow-y-auto"
            />
          </div>
        </NuxtLink>

        <NuxtLink
          to="/chat"
          class="group card w-full max-w-sm bg-base-200 transition-all duration-300 hover:bg-base-300 hover:shadow-xl"
        >
          <div class="card-body">
            <div class="mb-4 flex items-center gap-3">
              <div class="rounded-lg bg-info/10 p-2 text-info">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2
                class="card-title m-0 transition-colors group-hover:text-info"
              >
                Chat
              </h2>
            </div>
            <ChatPreview
              v-if="settings?.home.showChat"
              :settings="settings.home"
              class="scrollbar-thin max-h-72 overflow-y-auto"
            />
          </div>
        </NuxtLink>

        <NuxtLink
          to="/projects"
          class="group card w-full max-w-sm bg-base-200 transition-all duration-300 hover:bg-base-300 hover:shadow-xl"
        >
          <div class="card-body">
            <div class="mb-4 flex items-center gap-3">
              <div class="rounded-lg bg-success/10 p-2 text-success">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h2
                class="card-title m-0 transition-colors group-hover:text-success"
              >
                Projects
              </h2>
            </div>
            <ProjectsPreview
              v-if="settings?.home.showProjects"
              :settings="settings.home"
              class="scrollbar-thin max-h-72 overflow-y-auto"
            />
          </div>
        </NuxtLink>

        <NuxtLink
          v-if="isAdmin(me)"
          to="/resources"
          class="group card w-full max-w-sm bg-base-200 transition-all duration-300 hover:bg-base-300 hover:shadow-xl"
        >
          <div class="card-body">
            <div class="mb-4 flex items-center gap-3">
              <div class="rounded-lg bg-warning/10 p-2 text-warning">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h2
                class="card-title m-0 transition-colors group-hover:text-warning"
              >
                Resources
              </h2>
            </div>
            <div class="text-center text-base-content/70">
              No preview available
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <PushNotificationsAsk
      v-if="pushPermission == 'default'"
      @update="updatePushPermission"
      class="mt-8"
    />
  </div>
</template>
