<script setup lang="ts">
import {
  CalendarViewDay,
  CalendarViewMonth,
  CalendarViewWeek,
  CalendarViewTasks
} from '#components'

definePageMeta({
  layout: 'navbar'
})

const { data: _events } = await useFetch<EventType[]>('/api/events')
const { data: _eventsGuest } = await useFetch<EventType[]>(
  '/api/events-guest',
  { query: { status: 'accepted' } }
)
const { data: _tasks } = await useFetch<Task[]>('/api/tasks')
const { data: _pomodoro } = await useFetch<PomodoroEvent[]>(
  '/api/pomodoro-events'
)

const { data: _resources } = await useFetch<Resource[]>('/api/resources')
const { data: _projects } = await useFetch<ProjectEvent[]>(
  '/api/projects-events'
)

const { data: _notAvailable } =
  await useFetch<NotAvailable[]>('/api/not-available')

const me = await getME()

const _fNotAvailable = computed(() => {
  if (!_notAvailable.value) return []
  return _notAvailable.value.filter((na) => na.user_id === me.id)
})

const showResources = ref(false)

const fResources = computed(() => {
  if (showResources.value) {
    return _resources.value
  } else {
    return []
  }
})

// true => add event, false => add task
const _add_element = ref(-1) // -1 => nothing, 0 => event, 1 => task, 2 => pomodoro, 3 => resource
const input = useTemplateRef('modal')

const fetchEvents = async () => {
  const tmp = await $fetch('/api/events')
  _events.value = tmp
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

const fetchNotAvailable = async () => {
  const tmp = await $fetch('/api/not-available')
  _notAvailable.value = tmp
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

const _today = ref(await getToday())

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
    case 'tasks-list':
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
  fetchTasks()
  fetchPomodoro()
}

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
</script>

<template>
  <div class="flex h-full flex-col">
    <div class="relative flex items-center justify-between bg-base-100 p-4">
      <button class="btn btn-info" @click="previousPeriod">Previous</button>
      <h2 class="text-2xl font-semibold">
        {{ header() }}
      </h2>
      <button class="btn btn-info" @click="nextPeriod">Next</button>
    </div>

    <div class="grid grid-cols-3">
      <div class="col-start-2 flex justify-center space-x-2 bg-base-100 p-2">
        <button
          v-for="view in ['month', 'week', 'day', 'tasks-list']"
          :key="view"
          class="btn"
          :class="{
            'btn-info': _currentView === view
          }"
          @click="changeView(view)"
        >
          {{ view.charAt(0).toUpperCase() + view.slice(1) }}
          <!-- Capitalize first letter -->
        </button>
      </div>
      <div class="mr-4 flex items-center justify-end">
        <div class="form-control w-32">
          <label class="label cursor-pointer">
            <span class="label-text">Resources</span>
            <input
              type="checkbox"
              v-model="showResources"
              class="checkbox-warning checkbox"
            />
          </label>
        </div>
      </div>
    </div>

    <component
      :is="showComponent"
      :display-date="_displayDate"
      :today="_today"
      :events="_events"
      :events-guest="_eventsGuest"
      :tasks="_tasks"
      :pomodoro="_pomodoro"
      :resources="fResources"
      :projects="_projects"
      :not-available="_fNotAvailable"
      :week-days="_weekDays"
    />

    <dialog id="modal" ref="modal" class="modal">
      <div class="modal-box">
        <CalendarEventAdder
          v-if="_add_element == 0"
          :modal="true"
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
        <div tabindex="0" role="button" class="btn btn-info m-1">
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
          class="menu dropdown-content z-[1] w-52 rounded-box bg-base-300 p-2 shadow"
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
