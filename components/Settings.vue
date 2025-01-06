<script setup lang="ts">
const { data: settings } = await useFetch<Settings>('/api/settings')

const localSettings = ref<Settings>(
  settings.value || {
    home: {
      showCalendar: true,
      showNotes: true,
      showPomodoro: true,
      showChat: true,
      showProjects: true,
      calendarFilter: 'all',
      notesFilter: 'all',
      pomodoroShowTimeIfPaused: true,
      chatShowHub: true,
      chatLimit: 10,
      projectsLimit: 10
    }
  }
)

async function updateSettings() {
  await $fetch('/api/settings', {
    method: 'PUT',
    body: JSON.stringify(localSettings.value)
  })
}

const refreshSettings = inject('settings')

watch(
  localSettings,
  async () => {
    await updateSettings()
    ;(refreshSettings as any).value = true
    await new Promise((resolve) => setTimeout(resolve, 100))
    ;(refreshSettings as any).value = false
  },
  { deep: true }
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <form method="dialog" class="md:hidden">
      <button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">
        ✕
      </button>
    </form>
    <div class="mb-4">
      <h1 class="text-center text-xl font-bold">Settings</h1>
    </div>
    <CalendarSettingsPanel />
    <ThemeSelector />
    <div class="divider">Home</div>
    <form>
      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text">Show calendar preview</span>
          <input
            type="checkbox"
            v-model="localSettings.home.showCalendar"
            class="checkbox"
          />
        </label>

        <label class="label cursor-pointer">
          <span class="label-text">Show notes preview</span>
          <input
            type="checkbox"
            v-model="localSettings.home.showNotes"
            class="checkbox"
          />
        </label>

        <label class="label cursor-pointer">
          <span class="label-text">Show pomodoro preview</span>
          <input
            type="checkbox"
            v-model="localSettings.home.showPomodoro"
            class="checkbox"
          />
        </label>

        <label class="label cursor-pointer">
          <span class="label-text">Show chat preview</span>
          <input
            type="checkbox"
            v-model="localSettings.home.showChat"
            class="checkbox"
          />
        </label>

        <label class="label cursor-pointer">
          <span class="label-text">Show projects preview</span>
          <input
            type="checkbox"
            v-model="localSettings.home.showProjects"
            class="checkbox"
          />
        </label>

        <div class="label">
          <span class="label-text">Calendar filter</span>
        </div>
        <select
          class="select select-bordered"
          v-model="localSettings.home.calendarFilter"
        >
          <option value="all">All</option>
          <option value="events">Events only</option>
          <option value="tasks">Tasks only</option>
        </select>

        <div class="label">
          <span class="label-text">Notes filter</span>
        </div>
        <select
          class="select select-bordered"
          v-model="localSettings.home.notesFilter"
        >
          <option value="all">All</option>
          <option value="private">Private notes only</option>
          <option value="shared">Shared notes only</option>
          <option value="public">Public notes only</option>
        </select>

        <label class="label cursor-pointer">
          <span class="label-text">Show pomodoro time if paused</span>
          <input
            type="checkbox"
            v-model="localSettings.home.pomodoroShowTimeIfPaused"
            class="checkbox"
          />
        </label>

        <label class="label cursor-pointer">
          <span class="label-text">Show chat Hub</span>
          <input
            type="checkbox"
            v-model="localSettings.home.chatShowHub"
            class="checkbox"
          />
        </label>

        <div class="label">
          <span class="label-text">Chat Limit</span>
        </div>
        <input
          type="number"
          min="1"
          v-model="localSettings.home.chatLimit"
          class="input input-bordered w-full max-w-xs invalid:border-error invalid:text-error"
        />

        <div class="label">
          <span class="label-text">Projects Limit</span>
        </div>
        <input
          type="number"
          min="1"
          v-model="localSettings.home.projectsLimit"
          class="input input-bordered w-full max-w-xs invalid:border-error invalid:text-error"
        />
      </div>
    </form>
  </div>
</template>
