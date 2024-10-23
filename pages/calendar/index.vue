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
    <h1 class="bg-blue-500 p-4 text-center text-3xl font-bold text-white">
      CALENDAR
    </h1>
    <div class="absolute right-4 top-4">
      <CalendarSettingsPanel :events="_events" />
    </div>
    <div class="relative flex items-center justify-between bg-blue-100 p-4">
      <button
        class="rounded bg-blue-500 px-4 py-2 text-white"
        @click="previousPeriod"
      >
        Previous
      </button>
      <h2 class="text-2xl font-semibold">
        {{ header() }}
      </h2>
      <button
        class="rounded bg-blue-500 px-4 py-2 text-white"
        @click="nextPeriod"
      >
        Next
      </button>
    </div>

    <div class="flex justify-center space-x-2 bg-blue-100 p-2">
      <button
        v-for="view in ['month', 'week', 'day']"
        :key="view"
        class="rounded px-3 py-1"
        :class="{
          'bg-blue-500 text-white': _currentView === view,
          'bg-white': _currentView !== view
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

    <NuxtLink
      to="/calendar/add"
      class="fixed bottom-4 right-4 rounded-lg bg-blue-500 p-4 text-white hover:bg-blue-600"
    >
      +
    </NuxtLink>

    <TmButton class="fixed bottom-4 left-4" @update="updateToday()" />
  </div>
</template>
