<script setup lang="ts">
const { data: _events } = await useFetch<EventType[]>('/api/events')
const { data: _tasks } = await useFetch<Task[]>('/api/tasks')

const _currentDate = ref(new Date())
const _currentMonth = computed(() => _currentDate.value.getMonth())
const _currentYear = computed(() => _currentDate.value.getFullYear())

const _daysInMonth = computed(() => {
  return new Date(_currentYear.value, _currentMonth.value + 1, 0).getDate()
})

const _firstDayOfMonth = computed(() => {
  return new Date(_currentYear.value, _currentMonth.value, 1).getDay()
})

const _days = computed(() => {
  const result = []
  for (let i = 0; i < _firstDayOfMonth.value; i++) {
    result.push(null)
  }
  for (let i = 1; i <= _daysInMonth.value; i++) {
    result.push(i)
  }
  return result
})

function previousMonth() {
  _currentDate.value = new Date(_currentYear.value, _currentMonth.value - 1, 1)
}

function nextMonth() {
  _currentDate.value = new Date(_currentYear.value, _currentMonth.value + 1, 1)
}

function getEventsForDay(day: number | null): EventType[] {
  if (!day || !_events.value) return []
  return _events.value.filter((e) => {
    const eventDate = new Date(e.start)
    return (
      eventDate.getDate() === day &&
      eventDate.getMonth() === _currentMonth.value &&
      eventDate.getFullYear() === _currentYear.value
    )
  })
}

function getTasksForDay(day: number | null): Task[] {
  if (!day || !_tasks.value) return []
  return _tasks.value.filter((e) => {
    const taskDate = new Date(e.end)
    return (
      taskDate.getDate() === day &&
      taskDate.getMonth() === _currentMonth.value &&
      taskDate.getFullYear() === _currentYear.value
    )
  })
}
</script>

<template>
  <div class="flex h-full flex-col">
    <h1 class="bg-blue-500 p-4 text-center text-3xl font-bold text-white">
      CALENDAR
    </h1>
    <div class="relative flex items-center bg-blue-100 p-4">
      <button
        class="absolute left-4 rounded bg-blue-500 px-4 py-2 text-white"
        @click="previousMonth"
      >
        Previous
      </button>
      <h2 class="w-full text-center text-2xl font-semibold">
        {{ months[_currentMonth] }} {{ _currentYear }}
      </h2>
      <button
        class="absolute right-4 rounded bg-blue-500 px-4 py-2 text-white"
        @click="nextMonth"
      >
        Next
      </button>
    </div>

    <div class="grid flex-grow grid-cols-7 gap-1 bg-gray-100 p-2">
      <div v-for="day in days" :key="day" class="p-2 text-center font-bold">
        {{ day }}
      </div>
      <div
        v-for="(day, index) in _days"
        :key="index"
        class="h-32 overflow-y-auto bg-white p-2"
      >
        <div v-if="day" class="font-semibold">{{ day }}</div>
        <NuxtLink
          v-for="event in getEventsForDay(day)"
          :key="event.id"
          :to="`/calendar/e/${event.id}`"
        >
          <div
            class="mt-1 w-full cursor-pointer rounded bg-blue-100 p-1 text-xs hover:bg-blue-200"
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
          v-for="task in getTasksForDay(day)"
          :key="task.id"
          :to="`/calendar/t/${task.id}`"
        >
          <div
            class="mt-1 cursor-pointer rounded bg-blue-100 p-1 text-xs hover:bg-blue-200"
          >
            <div class="font-semibold">{{ task.title }}</div>
            <div>{{ formatTime(task.end) }}</div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <NuxtLink
      to="/calendar/add"
      class="fixed bottom-4 right-4 rounded-lg bg-blue-500 p-4 text-white hover:bg-blue-600"
    >
      +
    </NuxtLink>
  </div>
</template>
