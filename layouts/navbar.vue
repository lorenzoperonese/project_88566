<script setup lang="ts">
import { Profile, Settings, Debug } from '#components'
import { wsState } from '@/utils/websocket'
const modal = useTemplateRef('navbar-modal')

const { data: pending } = await useFetch<number>('/api/notifications/number')
const { data: session } = await useFetch<User>('/api/session')

const component = ref('')
const showDropdown1 = ref(false)
const showDropdown2 = ref(false)

const me = await getME()

const avatar = computed(() => {
  let a = 'Aidan'
  if (session.value) {
    a = session.value.avatar
  }

  return getAvatarLink(a)
})

const showComponent = computed(() => {
  switch (component.value) {
    case 'Profile':
      return Profile
    case 'Settings':
      return Settings
    case 'Debug':
      return Debug
    default:
      return Profile
  }
})

function showProfile() {
  component.value = 'Profile'
  showModal()
}

function showSettings() {
  component.value = 'Settings'
  showModal()
}

function showDebug() {
  component.value = 'Debug'
  showModal()
}

function showModal() {
  modal.value?.showModal()
}

function closeModal() {
  modal.value?.close()
}

async function logout() {
  localStorage.removeItem('pomodoro-status')
  localStorage.removeItem('pomodoro-timer')

  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    if (subscription) {
      await subscription.unsubscribe()
      try {
        await $fetch('/api/notify', {
          method: 'DELETE',
          body: JSON.stringify(subscription)
        })
      } catch (err) {
        console.error(err)
      }
    }
  }

  const { signOut } = useAuth()

  try {
    signOut({ callbackUrl: '/login' })
  } catch (err) {
    console.error(err)
  }
}

async function updatePending() {
  try {
    const tmp = await $fetch('/api/notifications/number')
    pending.value = tmp as number
  } catch (error) {
    console.error(error)
  }
}

watch(wsState.notifications, updatePending)
</script>

<template>
  <div class="grid grid-cols-3 bg-base-300 p-2">
    <div class="lg:col-span-2">
      <div class="dropdown block lg:hidden">
        <div
          tabindex="0"
          role="button"
          class="btn btn-circle btn-ghost"
          @click="showDropdown1 = !showDropdown1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </div>
        <ul
          v-if="showDropdown1"
          tabindex="0"
          class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-300 p-2 shadow"
        >
          <li>
            <NuxtLink to="/">Home</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="{ name: 'calendar' }">Calendar</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="{ name: 'notes' }">Note</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="{ name: 'pomodoro' }">Pomodoro</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="{ name: 'chat' }">Chat</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="{ name: 'projects' }">Projects</NuxtLink>
          </li>
          <li v-if="me.admin">
            <NuxtLink :to="{ name: 'resources' }">Resources</NuxtLink>
          </li>
        </ul>
      </div>

      <div class="hidden lg:block">
        <NuxtLink class="btn btn-ghost text-lg" to="/">Home</NuxtLink>
        <NuxtLink class="btn btn-ghost text-lg" :to="{ name: 'calendar' }"
          >Calendar</NuxtLink
        >
        <NuxtLink class="btn btn-ghost text-lg" :to="{ name: 'notes' }"
          >Note</NuxtLink
        >
        <NuxtLink class="btn btn-ghost text-lg" :to="{ name: 'pomodoro' }"
          >Pomodoro</NuxtLink
        >
        <NuxtLink class="btn btn-ghost text-lg" :to="{ name: 'chat' }"
          >Chat</NuxtLink
        >
        <NuxtLink class="btn btn-ghost text-lg" :to="{ name: 'projects' }"
          >Projects</NuxtLink
        >
        <NuxtLink
          v-if="me.admin"
          class="btn btn-ghost text-lg"
          :to="{ name: 'resources' }"
          >Resources</NuxtLink
        >
      </div>
    </div>
    <div class="flex justify-center lg:hidden">
      <NuxtLink to="/" class="btn btn-ghost text-xl">Selfie</NuxtLink>
    </div>

    <div class="col-start-3 flex justify-end">
      <NotificationsDropdown
        class="hidden md:block"
        :pending="pending"
        @update="updatePending"
      />
      <NotificationsModal
        class="block md:hidden"
        :pending="pending"
        @update="updatePending"
      />

      <div class="dropdown dropdown-end">
        <div
          tabindex="0"
          role="button"
          class="avatar btn btn-circle btn-ghost"
          @click="showDropdown2 = !showDropdown2"
        >
          <div class="w-10 rounded-full">
            <img alt="avatar" :src="avatar" />
          </div>
        </div>
        <ul
          v-if="showDropdown2"
          tabindex="0"
          class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-300 p-2 shadow"
        >
          <li @click="showProfile">
            <a class="justify-between"> Profile </a>
          </li>
          <li @click="showSettings"><a>Settings</a></li>
          <li @click="showDebug"><a>Debug</a></li>
          <li @click="logout"><a>Logout</a></li>
        </ul>
      </div>
    </div>
  </div>

  <slot></slot>

  <dialog ref="navbar-modal" class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <component :is="showComponent" @close="closeModal" />
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
