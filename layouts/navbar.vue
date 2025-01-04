<script setup lang="ts">
import { Profile, Settings } from '#components'
import { wsState } from '@/utils/websocket'
const modal = useTemplateRef('navbar-modal')

const { data: pending } = await useFetch<number>('/api/notifications/number')
const { data: session } = await useFetch<User>('/api/session')

const component = ref('')

const avatar = computed(() => {
  let a = 'Aidan'
  if (session.value) {
    a = session.value.avatar
  }

  return getAvatarLink(a)
})

const showComponent = computed(() => {
  return component.value === 'Profile' ? Profile : Settings
})

function showProfile() {
  component.value = 'Profile'
  showModal()
}

function showSettings() {
  component.value = 'Settings'
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

  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()
  if (subscription) {
    subscription.unsubscribe()
    try {
      await $fetch('/api/notify', {
        method: 'DELETE',
        body: JSON.stringify(subscription)
      })
    } catch (err) {
      console.error(err)
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
        <div tabindex="0" role="button" class="btn btn-circle btn-ghost">
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
      </div>
    </div>
    <div class="flex justify-center lg:hidden">
      <NuxtLink to="/" class="btn btn-ghost text-xl">Selfie</NuxtLink>
    </div>

    <div class="col-start-3 flex justify-end">
      <div class="dropdown dropdown-left dropdown-bottom">
        <button class="btn btn-circle btn-ghost">
          <div class="indicator">
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span
              v-show="pending != 0"
              class="badge indicator-item badge-primary badge-xs"
            ></span>
          </div>
        </button>

        <div
          tabindex="0"
          class="menu dropdown-content menu-sm z-[1] mt-3 max-h-96 w-96 overflow-y-auto rounded-box bg-base-300 p-2 shadow"
        >
          <NotificationsList @update="updatePending" />
        </div>
      </div>

      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="avatar btn btn-circle btn-ghost">
          <div class="w-10 rounded-full">
            <img alt="avatar" :src="avatar" />
          </div>
        </div>
        <ul
          tabindex="0"
          class="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-300 p-2 shadow"
        >
          <li @click="showProfile">
            <a class="justify-between"> Profile </a>
          </li>
          <li @click="showSettings"><a>Settings</a></li>
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
