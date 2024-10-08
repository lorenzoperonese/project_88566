<script setup lang="ts">
const { data: _events } = await useFetch<EventType[]>('/api/events')
const { data: _tasks } = await useFetch<Task[]>('/api/tasks')

const _today = ref(await getToday())

const _displayDate = ref(_today.value)
const _currentMonth = ref(_displayDate.value.getMonth())
const _currentYear = ref(_displayDate.value.getFullYear())
const _currentView = ref('month')

const _daysInMonth = computed(() => {
  return new Date(_currentYear.value, _currentMonth.value + 1, 0).getDate()
})

const _firstDayOfMonth = computed(() => {
  return new Date(_currentYear.value, _currentMonth.value, 1).getDay()
})

const _days = computed(() => {
  const result = []
  for (let i = 0; i < _firstDayOfMonth.value; i++) {
    result.push(
      new Date(_currentYear.value, _currentMonth.value, 0).getDate() -
        _firstDayOfMonth.value +
        i +
        1
    )
  }
  for (let i = 1; i <= _daysInMonth.value; i++) {
    result.push(i)
  }
  let i = 1
  while (result.length % 7 !== 0) {
    result.push(i)
    i++
  }
  return result
})

// trovato online, veramente brutto ma nient'altro sembra funzionare :(
const _weekDays = computed(() => {
  const startOfWeek = _displayDate.value
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
    const month = _currentMonth.value
    if (month == 0) {
      _currentYear.value = _currentYear.value - 1
      _currentMonth.value = 11
    } else {
      _currentMonth.value = month - 1
    }
  } else if (_currentView.value === 'week') {
    _displayDate.value = new Date(
      _displayDate.value.setDate(_displayDate.value.getDate() - 7)
    )
    const dayofweek = new Date(_displayDate.value).getDay()
    const wednesday = new Date(_displayDate.value).setDate(
      _displayDate.value.getDate() - dayofweek + 3
    )
    // per cambiare il mese, controllo in che mese è il giorno centrale della settimana
    // quindi, il mese mostrato sopra è quello che ha più giorni della settimana che appartengono a quel mese
    if (new Date(wednesday).getMonth() !== _currentMonth.value) {
      _currentMonth.value = _displayDate.value.getMonth()
      _currentYear.value = _displayDate.value.getFullYear()
    }
  } else if (_currentView.value === 'day') {
    _displayDate.value = new Date(
      _displayDate.value.setDate(_displayDate.value.getDate() - 1)
    )
    if (_displayDate.value.getMonth() !== _currentMonth.value) {
      _currentMonth.value = _displayDate.value.getMonth()
      _currentYear.value = _displayDate.value.getFullYear()
    }
  }
}

function nextPeriod() {
  if (_currentView.value === 'month') {
    const month = _currentMonth.value
    if (month == 11) {
      _currentYear.value = _currentYear.value + 1
      _currentMonth.value = 0
    } else {
      _currentMonth.value = month + 1
    }
  } else if (_currentView.value === 'week') {
    _displayDate.value = new Date(
      _displayDate.value.setDate(_displayDate.value.getDate() + 7)
    )
    const dayofweek = new Date(_displayDate.value).getDay()
    const wednesday = new Date(_displayDate.value).setDate(
      _displayDate.value.getDate() - dayofweek + 3
    )
    if (new Date(wednesday).getMonth() !== _currentMonth.value) {
      _currentMonth.value = _displayDate.value.getMonth()
      _currentYear.value = _displayDate.value.getFullYear()
    }
  } else if (_currentView.value === 'day') {
    _displayDate.value = new Date(
      _displayDate.value.setDate(_displayDate.value.getDate() + 1)
    )
    if (_displayDate.value.getMonth() !== _currentMonth.value) {
      _currentMonth.value = _displayDate.value.getMonth()
      _currentYear.value = _displayDate.value.getFullYear()
    }
  }
}

function isInPreviousMonth(index: number): boolean {
  return index < _firstDayOfMonth.value
}

function isInNextMonth(index: number): boolean {
  return index >= _firstDayOfMonth.value + _daysInMonth.value
}

function isInCurrentMonth(index: number): boolean {
  return !isInPreviousMonth(index) && !isInNextMonth(index)
}

function getEventsForDay(day: number, index: number): EventType[] {
  let date: Date | null = null
  if (isInCurrentMonth(index) || index == -1) {
    date = new Date(_currentYear.value, _currentMonth.value, day)
  } else if (isInPreviousMonth(index)) {
    date = new Date(_currentYear.value, _currentMonth.value - 1, day)
  } else if (isInNextMonth(index)) {
    date = new Date(_currentYear.value, _currentMonth.value + 1, day)
  }
  if (date === null || !_events.value) {
    return []
  }
  return _events.value
    .filter((e) => {
      const eventDate = new Date(e.start)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
    .sort((a, b) => a.start - b.start)
}

function getTasksForDay(day: number, index: number): Task[] {
  let date: Date | null = null
  if (isInCurrentMonth(index) || index == -1) {
    date = new Date(_currentYear.value, _currentMonth.value, day)
  } else if (isInPreviousMonth(index)) {
    date = new Date(_currentYear.value, _currentMonth.value - 1, day)
  } else if (isInNextMonth(index)) {
    date = new Date(_currentYear.value, _currentMonth.value + 1, day)
  }
  if (date === null || !_tasks.value) {
    return []
  }
  return _tasks.value
    .filter((e) => {
      const taskDate = new Date(e.end)
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      )
    })
    .sort((a, b) => a.end - b.end)
}

function isToday(day: number, index: number): boolean {
  let date: Date | null = null
  if (isInCurrentMonth(index) || index == -1) {
    date = new Date(_currentYear.value, _currentMonth.value, day)
  } else if (isInPreviousMonth(index)) {
    date = new Date(_currentYear.value, _currentMonth.value - 1, day)
  } else if (isInNextMonth(index)) {
    date = new Date(_currentYear.value, _currentMonth.value + 1, day)
  }
  if (date === null) {
    return false
  }
  return (
    date.getDate() === _today.value.getDate() &&
    date.getMonth() === _today.value.getMonth() &&
    date.getFullYear() === _today.value.getFullYear()
  )
}

async function updateToday() {
  const today = new Date(await getToday())
  _today.value = today
}

function isEventInThePast(e: EventType): boolean {
  return e.end < _today.value.getTime()
}

function changeView(view: string) {
  _currentView.value = view
}
</script>

<template>
  <div class="flex h-full flex-col">
    <h1 class="bg-blue-500 p-4 text-center text-3xl font-bold text-white">
      CALENDAR
    </h1>
    <div class="relative flex items-center justify-between bg-blue-100 p-4">
      <button
        class="rounded bg-blue-500 px-4 py-2 text-white"
        @click="previousPeriod"
      >
        Previous
      </button>
      <h2 class="text-2xl font-semibold">
        {{ months[_currentMonth] }} {{ _currentYear }}
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

    <!-- Month View -->
    <div
      v-if="_currentView === 'month'"
      class="grid flex-grow grid-cols-7 gap-1 bg-gray-100 p-2"
    >
      <div v-for="day in days" :key="day" class="p-2 text-center font-bold">
        {{ day }}
      </div>
      <div
        v-for="(day, index) in _days"
        :key="index"
        class="h-32 overflow-y-auto p-2"
        :class="{
          'bg-gray-200': isToday(day, index),
          'bg-white': !isToday(day, index)
        }"
      >
        <div
          class="font-semibold"
          :class="{ 'opacity-20': !isInCurrentMonth(index) }"
        >
          {{ day }}
        </div>
        <NuxtLink
          v-for="event in getEventsForDay(day, index)"
          :key="event.id"
          :to="`/calendar/e/${event.id}`"
        >
          <div
            class="mt-1 w-full cursor-pointer rounded bg-blue-100 p-1 text-xs hover:bg-blue-200"
            :class="{ 'opacity-60': isEventInThePast(event) }"
          >
            <div class="font-semibold">{{ event.title }}</div>
            <div>
              {{ formatTime(event.start) }} - {{ formatTime(event.end) }}
            </div>
            <div v-if="event.location">📍 {{ event.location }}</div>
            <div v-if="event.category">🏷️ {{ event.category }}</div>
          </div>
        </NuxtLink>

        <NuxtLink
          v-for="task in getTasksForDay(day, -1)"
          :key="task.id"
          :to="`/calendar/t/${task.id}`"
        >
          <div
            class="mt-1 cursor-pointer rounded bg-blue-100 p-1 text-xs hover:bg-blue-200"
          >
            <div :class="['font-semibold', { 'line-through': task.completed }]">
              {{ task.title }}
            </div>
            <div>{{ formatTime(task.end) }}</div>
            <div v-if="task.category">🏷️ {{ task.category }}</div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- Week View -->
    <div
      v-else-if="_currentView === 'week'"
      class="grid flex-grow grid-cols-7 gap-1 bg-gray-100 p-2"
    >
      <div v-for="(day, index) in _weekDays" :key="index" class="flex flex-col">
        <div class="p-2 text-center font-bold">
          {{ day.toLocaleDateString('en-US', { weekday: 'short' }) }}
          <br />
          {{ day.getDate() }}
        </div>
        <div
          class="flex-grow overflow-y-auto p-2"
          :class="{
            'bg-white': !isToday(day.getDate(), -1),
            'bg-gray-200': isToday(day.getDate(), -1)
          }"
        >
          <NuxtLink
            v-for="event in getEventsForDay(day.getDate(), -1)"
            :key="event.id"
            :to="`/calendar/e/${event.id}`"
          >
            <div
              class="mt-1 w-full cursor-pointer rounded bg-blue-100 p-1 text-xs hover:bg-blue-200"
              :class="{ 'opacity-60': isEventInThePast(event) }"
            >
              <div class="font-semibold">{{ event.title }}</div>
              <div>
                {{ formatTime(event.start) }} - {{ formatTime(event.end) }}
              </div>
            </div>
          </NuxtLink>

          <NuxtLink
            v-for="task in getTasksForDay(day.getDate(), -1)"
            :key="task.id"
            :to="`/calendar/t/${task.id}`"
          >
            <div
              class="mt-1 cursor-pointer rounded bg-blue-100 p-1 text-xs hover:bg-blue-200"
            >
              <div
                :class="['font-semibold', { 'line-through': task.completed }]"
              >
                {{ task.title }}
              </div>
              <div>{{ formatTime(task.end) }}</div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Day View -->
    <div v-else class="flex-grow bg-gray-100 p-2">
      <div class="flex h-full flex-col">
        <div class="p-2 text-center font-bold">
          {{
            _displayDate.toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })
          }}
        </div>
        <div
          class="flex-grow overflow-y-auto p-2"
          :class="{
            'bg-white': !isToday(_displayDate.getDate(), -1),
            'bg-gray-200': isToday(_displayDate.getDate(), -1)
          }"
        >
          <NuxtLink
            v-for="event in getEventsForDay(_displayDate.getDate(), -1)"
            :key="event.id"
            :to="`/calendar/e/${event.id}`"
          >
            <div
              class="mt-1 w-full cursor-pointer rounded bg-blue-100 p-2 text-sm hover:bg-blue-200"
              :class="{ 'opacity-60': isEventInThePast(event) }"
            >
              <div class="font-semibold">{{ event.title }}</div>
              <div>
                {{ formatTime(event.start) }} - {{ formatTime(event.end) }}
              </div>
              <div v-if="event.location">📍 {{ event.location }}</div>
              <div v-if="event.category">🏷️ {{ event.category }}</div>
            </div>
          </NuxtLink>

          <NuxtLink
            v-for="task in getTasksForDay(_displayDate.getDate(), -1)"
            :key="task.id"
            :to="`/calendar/t/${task.id}`"
          >
            <div
              class="mt-1 cursor-pointer rounded bg-blue-100 p-2 text-sm hover:bg-blue-200"
            >
              <div
                :class="['font-semibold', { 'line-through': task.completed }]"
              >
                {{ task.title }}
              </div>
              <div>{{ formatTime(task.end) }}</div>
              <div v-if="task.category">🏷️ {{ task.category }}</div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <NuxtLink
      to="/calendar/add"
      class="fixed bottom-4 right-4 rounded-lg bg-blue-500 p-4 text-white hover:bg-blue-600"
    >
      +
    </NuxtLink>

    <TmButton class="fixed bottom-4 left-4" @update="updateToday()" />
  </div>
</template>
