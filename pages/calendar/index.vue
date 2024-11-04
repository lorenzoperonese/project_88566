<script setup lang="ts">
import {
  CalendarViewDay,
  CalendarViewMonth,
  CalendarViewWeek
} from '#components'

const { data: _events } = await useFetch<EventType[]>('/api/events')
const { data: _tasks } = await useFetch<Task[]>('/api/tasks')

const _today = ref(await getToday())

const _displayDate = ref(new Date(_today.value))
const _currentView = ref('month')

const showComponent = computed(() => {
  return _currentView.value === 'month'
    ? CalendarViewMonth
    : _currentView.value === 'week'
      ? CalendarViewWeek
      : CalendarViewDay
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
    <h1 class="bg-base-300 p-4 text-center text-3xl font-bold text-white">
      CALENDAR
    </h1>
    <div class="relative flex items-center justify-between bg-base-100 p-4">
      <button class="btn btn-info" @click="previousPeriod">Previous</button>
      <h2 class="text-2xl font-semibold">
        {{ header() }}
      </h2>
      <button class="btn btn-info" @click="nextPeriod">Next</button>
    </div>

    <div class="flex justify-center space-x-2 bg-base-100 p-2">
      <button
        v-for="view in ['month', 'week', 'day']"
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

    <component
      :is="showComponent"
      :display-date="_displayDate"
      :today="_today"
      :events="_events"
      :tasks="_tasks"
      :week-days="_weekDays"
    />

    <NuxtLink to="/calendar/add" class="btn btn-primary fixed bottom-4 right-4">
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
    </NuxtLink>

    <TmButton class="fixed bottom-4 left-4" @update="updateToday()" />
  </div>
</template>
