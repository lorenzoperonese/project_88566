<script setup lang="ts">
import {
  CalendarViewDay,
  CalendarViewMonth,
  CalendarViewWeek,
  CalendarViewTasks
} from '#components'

import type { SwipeDirection } from '@vueuse/core'

definePageMeta({
  layout: 'navbar'
})

const tmp = await getToday()
const _today = ref(tmp)
const me = await getME()

const { data: _events } = useFetch<EventType[]>('/api/events')
const { data: _eventsGuest } = useFetch<EventType[]>('/api/events-guest', {
  query: { status: 'accepted' }
})
const { data: _tasks } = useFetch<Task[]>('/api/tasks')
const { data: _pomodoro } = useFetch<PomodoroEvent[]>('/api/pomodoro-events')

const { data: _resources } = useFetch<Resource[]>('/api/resources')
const { data: _projects } = useFetch<ProjectEvent[]>('/api/projects-events')

const { data: _notAvailable } = useFetch<NotAvailable[]>('/api/not-available')

const { data: _noteTasks } = useFetch<NoteTask[]>('/api/notes-todos')

const _filterEvents = ref(true)
const _filterTasks = ref(true)
const _filterPomodoro = ref(true)
const _filterResources = ref(false)
const _filterProjects = ref(true)
const _filterNotAvailable = ref(true)
const _filterNoteTasks = ref(true)

const showDropdown = ref(false)

const _fNotAvailable = computed(() => {
  if (!_notAvailable.value) return []
  return _notAvailable.value.filter((na) => na.user_id === me.id)
})

// true => add event, false => add task
const _add_element = ref(-1) // -1 => nothing, 0 => event, 1 => task, 2 => pomodoro, 3 => resource
const input = useTemplateRef('modal')

const fetchEvents = async () => {
  const tmp = await $fetch('/api/events')
  _events.value = tmp
}

const fetchEventsGuest = async () => {
  const tmp = await $fetch('/api/events-guest', {
    query: { status: 'accepted' }
  })
  _eventsGuest.value = tmp
}

const fetchTasks = async () => {
  const tmp = await $fetch('/api/tasks')
  _tasks.value = tmp
}

const fetchPomodoro = async () => {
  const tmp = await $fetch('/api/pomodoro-events')
  _pomodoro.value = tmp
}

const fetchResources = async () => {
  const tmp = await $fetch('/api/resources')
  _resources.value = tmp
}

const fetchProjects = async () => {
  const tmp = await $fetch('/api/projects-events')
  _projects.value = tmp
}

const fetchNotAvailable = async () => {
  const tmp = await $fetch('/api/not-available')
  _notAvailable.value = tmp
}

const fetchNoteTasks = async () => {
  const tmp = await $fetch('/api/notes-todos')
  _noteTasks.value = tmp
}

function closeModal() {
  console.log('CLOSED')
  if (_add_element.value === 0) {
    fetchEvents()
    fetchResources()
  } else if (_add_element.value === 1) {
    fetchTasks()
  } else if (_add_element.value === 2) {
    fetchPomodoro()
  } else if (_add_element.value === 3) {
    fetchResources()
  } else if (_add_element.value === 4) {
    fetchNotAvailable()
  }

  if (input.value) {
    input.value.close()
  }
}

function showModal() {
  if (input.value) {
    input.value.showModal()
  }
}

function addTask() {
  _add_element.value = 1
  showModal()
}

function addEvent() {
  _add_element.value = 0
  showModal()
}

function addPomodoro() {
  _add_element.value = 2
  showModal()
}

function addResource() {
  _add_element.value = 3
  showModal()
}

function addNotAvailable() {
  _add_element.value = 4
  showModal()
}

const _displayDate = ref(new Date(_today.value))
const _currentView = ref('month')

const showComponent = computed(() => {
  switch (_currentView.value) {
    case 'month':
      return CalendarViewMonth
    case 'week':
      return CalendarViewWeek
    case 'day':
      return CalendarViewDay
    case 'tasks':
      return CalendarViewTasks
  }
})

const _weekDays = computed(() => {
  const startOfWeek = new Date(_displayDate.value)
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  return Array(7)
    .fill(null)
    .map((_, i) => {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      return day
    })
})

function previousPeriod() {
  if (_currentView.value === 'month') {
    _displayDate.value = new Date(
      _displayDate.value.setMonth(_displayDate.value.getMonth() - 1)
    )
  } else if (_currentView.value === 'week') {
    _displayDate.value = new Date(
      _displayDate.value.setDate(_displayDate.value.getDate() - 7)
    )
  } else if (_currentView.value === 'day') {
    _displayDate.value = new Date(
      _displayDate.value.setDate(_displayDate.value.getDate() - 1)
    )
  }
}

function nextPeriod() {
  if (_currentView.value === 'month') {
    _displayDate.value = new Date(
      _displayDate.value.setMonth(_displayDate.value.getMonth() + 1)
    )
  } else if (_currentView.value === 'week') {
    _displayDate.value = new Date(
      _displayDate.value.setDate(_displayDate.value.getDate() + 7)
    )
  } else if (_currentView.value === 'day') {
    _displayDate.value = new Date(
      _displayDate.value.setDate(_displayDate.value.getDate() + 1)
    )
  }
}

async function updateToday() {
  const today = new Date(await getToday())
  _today.value = today
  _displayDate.value = new Date(today)

  fetchEvents()
  fetchEventsGuest()
  fetchTasks()
  fetchPomodoro()
  fetchResources()
  fetchProjects()
  fetchNotAvailable()
  fetchNoteTasks()
}

const phoneView = ref('month')

watch(phoneView, (value) => {
  console.log(value)
  _currentView.value = value
})

function changeView(view: string) {
  _currentView.value = view
}

function header(): string {
  if (
    _currentView.value === 'week' &&
    _weekDays.value[0].getMonth() !== _weekDays.value[6].getMonth()
  ) {
    if (_weekDays.value[0].getFullYear() !== _weekDays.value[6].getFullYear()) {
      // December 1492 - January 1493
      return `${months[_weekDays.value[0].getMonth()]} ${_weekDays.value[0].getFullYear()} - ${months[_weekDays.value[6].getMonth()]} ${_weekDays.value[6].getFullYear()}`
    } else {
      // June - July 1666
      return `${months[_weekDays.value[0].getMonth()]} - ${months[_weekDays.value[6].getMonth()]} ${_displayDate.value.getFullYear()}`
    }
  } else {
    // August 1999
    return `${months[_displayDate.value.getMonth()]} ${_displayDate.value.getFullYear()}`
  }
}
const swipeEl = ref(null)
useSwipe(swipeEl, {
  onSwipeEnd: (e: TouchEvent, direction: SwipeDirection) => {
    if (direction === 'LEFT') {
      nextPeriod()
    } else if (direction === 'RIGHT') {
      previousPeriod()
    }
  }
})
</script>

<template>
  <div
    ref="swipeEl"
    class="flex h-full flex-col overflow-y-auto"
    style="height: calc(100vh - var(--navbar-height))"
  >
    <div
      class="relative hidden items-center justify-between bg-base-100 p-4 md:flex"
    >
      <button class="btn btn-info" @click="previousPeriod">Previous</button>

      <h2 class="text-base font-semibold md:text-2xl">
        {{ header() }}
      </h2>

      <button class="btn btn-info" @click="nextPeriod">Next</button>
    </div>

    <div class="mx-2 grid grid-cols-3 md:mx-4">
      <h2 class="flex items-center text-base font-semibold md:hidden">
        {{ header() }}
      </h2>

      <div class="col-start-2 flex justify-center space-x-2 bg-base-100 p-2">
        <button
          v-for="view in ['month', 'week', 'day', 'tasks']"
          :key="view"
          class="btn btn-md hidden md:block"
          :class="{
            'btn-info': _currentView === view
          }"
          @click="changeView(view)"
        >
          {{ view.charAt(0).toUpperCase() + view.slice(1) }}
          <!-- Capitalize first letter -->
        </button>

        <select
          v-model="phoneView"
          class="select select-info select-sm block bg-info font-bold text-black md:hidden"
        >
          <template v-for="view in ['month', 'week', 'day', 'tasks']">
            <option :value="view">
              {{ view.charAt(0).toUpperCase() + view.slice(1) }}
            </option>
          </template>
        </select>
      </div>
      <div class="flex items-center justify-end">
        <div class="dropdown dropdown-end dropdown-bottom">
          <div
            tabindex="0"
            role="button"
            class="btn btn-sm m-1 md:btn-md"
            @click="showDropdown = !showDropdown"
          >
            Filter
          </div>
          <ul
            v-if="showDropdown"
            tabindex="0"
            class="menu dropdown-content z-[1] w-52 rounded-box bg-base-300 p-2 shadow *:text-xs md:*:text-base"
          >
            <li @click="_filterEvents = !_filterEvents">
              <a>
                <input
                  v-model="_filterEvents"
                  type="checkbox"
                  class="checkbox checkbox-sm md:checkbox-md"
                />
                Events
              </a>
            </li>

            <li @click="_filterTasks = !_filterTasks">
              <a>
                <input
                  v-model="_filterTasks"
                  type="checkbox"
                  class="checkbox checkbox-sm md:checkbox-md"
                />
                Tasks
              </a>
            </li>

            <li @click="_filterPomodoro = !_filterPomodoro">
              <a>
                <input
                  v-model="_filterPomodoro"
                  type="checkbox"
                  class="checkbox checkbox-sm md:checkbox-md"
                />
                Pomodoro
              </a>
            </li>

            <li @click="_filterResources = !_filterResources">
              <a>
                <input
                  v-model="_filterResources"
                  type="checkbox"
                  class="checkbox checkbox-sm md:checkbox-md"
                />
                Resources
              </a>
            </li>

            <li @click="_filterProjects = !_filterProjects">
              <a>
                <input
                  v-model="_filterProjects"
                  type="checkbox"
                  class="checkbox checkbox-sm md:checkbox-md"
                />
                Projects
              </a>
            </li>

            <li @click="_filterNotAvailable = !_filterNotAvailable">
              <a>
                <input
                  v-model="_filterNotAvailable"
                  type="checkbox"
                  class="checkbox checkbox-sm md:checkbox-md"
                />
                Not available
              </a>
            </li>

            <li @click="_filterNoteTasks = !_filterNoteTasks">
              <a>
                <input
                  v-model="_filterNoteTasks"
                  type="checkbox"
                  class="checkbox checkbox-sm md:checkbox-md"
                />
                Note tasks
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <component
      :is="showComponent"
      :display-date="_displayDate"
      :today="_today"
      :events="_filterEvents ? _events : []"
      :events-guest="_filterEvents ? _eventsGuest : []"
      :tasks="_filterTasks ? _tasks : []"
      :pomodoro="_filterPomodoro ? _pomodoro : []"
      :resources="_filterResources ? _resources : []"
      :projects="_filterProjects ? _projects : []"
      :not-available="_filterNotAvailable ? _fNotAvailable : []"
      :note-tasks="_filterNoteTasks ? _noteTasks : []"
      :week-days="_weekDays"
    />

    <dialog
      id="modal"
      ref="modal"
      class="modal modal-bottom sm:modal-middle"
      @click="closeModal"
    >
      <div class="modal-box w-full" @click.stop>
        <form method="dialog" class="md:hidden">
          <button
            @click="closeModal"
            class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
          >
            ✕
          </button>
        </form>
        <CalendarEventAdder
          v-if="_add_element == 0"
          :modal="true"
          :is-event-new="true"
          @close="closeModal"
        />
        <CalendarTaskAdder v-if="_add_element == 1" @close="closeModal" />
        <CalendarPomodoroAdder v-if="_add_element == 2" @close="closeModal" />
        <CalendarResourceAdder v-if="_add_element == 3" @close="closeModal" />
        <CalendarNotAvailableAdder
          v-if="_add_element == 4"
          @close="closeModal"
        />
      </div>
    </dialog>

    <div class="fixed bottom-4 right-4">
      <div class="dropdown dropdown-end dropdown-top">
        <div
          tabindex="0"
          role="button"
          class="btn btn-info btn-sm m-1 md:btn-md"
        >
          <svg
            class="text-content h-5 w-5"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <ul
          tabindex="0"
          class="menu dropdown-content z-[1] rounded-box bg-base-300 p-2 shadow *:text-xs md:w-52 md:*:text-base"
        >
          <li><a @click="addEvent"> Event </a></li>
          <li><a @click="addTask"> Task </a></li>
          <li><a @click="addPomodoro"> Pomodoro </a></li>
          <li><a @click="addNotAvailable"> Not available </a></li>
          <li v-if="isAdmin(me)"><a @click="addResource"> Resource </a></li>
        </ul>
      </div>
    </div>

    <TmButton class="fixed bottom-4 left-4" @update="updateToday()" />
  </div>
</template>
