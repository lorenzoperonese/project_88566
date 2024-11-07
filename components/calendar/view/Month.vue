<script setup lang="ts">
const $props = defineProps<{
  events: EventType[] | null
  eventsGuest: EventType[] | null
  tasks: Task[] | null
  displayDate: Date
  today: Date
}>()

const _daysInMonth = computed(() => {
  return new Date(
    $props.displayDate.getFullYear(),
    $props.displayDate.getMonth() + 1,
    0
  ).getDate()
})

const _firstDayOfMonth = computed(() => {
  return new Date(
    $props.displayDate.getFullYear(),
    $props.displayDate.getMonth(),
    1
  ).getDay()
})

const _days = computed(() => {
  const result = []
  for (let i = 0; i < _firstDayOfMonth.value; i++) {
    result.push(
      new Date(
        $props.displayDate.getFullYear(),
        $props.displayDate.getMonth(),
        0
      ).getDate() -
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

function isInPreviousMonth(index: number): boolean {
  return index < _firstDayOfMonth.value
}

function isInNextMonth(index: number): boolean {
  return index >= _firstDayOfMonth.value + _daysInMonth.value
}

function isInCurrentMonth(index: number): boolean {
  return !isInPreviousMonth(index) && !isInNextMonth(index)
}

function getEventsForDay(
  day: number,
  index: number,
  events: EventType[] | null
): EventType[] {
  let date: Date | null = null
  if (isInPreviousMonth(index)) {
    date = new Date(
      $props.displayDate.getFullYear(),
      $props.displayDate.getMonth() - 1,
      day
    )
  } else if (isInNextMonth(index)) {
    date = new Date(
      $props.displayDate.getFullYear(),
      $props.displayDate.getMonth() + 1,
      day
    )
  } else {
    date = new Date(
      $props.displayDate.getFullYear(),
      $props.displayDate.getMonth(),
      day
    )
  }
  if (!events) {
    return []
  }
  return events
    .filter((e) => {
      const eventDate = new Date(e.start)
      return eventDate.toDateString() === date.toDateString()
    })
    .sort((a, b) => a.start - b.start)
}

function getTasksForDay(day: number, index: number): Task[] {
  let date: Date | null = null
  if (isInPreviousMonth(index)) {
    date = new Date(
      $props.displayDate.getFullYear(),
      $props.displayDate.getMonth() - 1,
      day
    )
    console.log(date)
  } else if (isInNextMonth(index)) {
    date = new Date(
      $props.displayDate.getFullYear(),
      $props.displayDate.getMonth() + 1,
      day
    )
  } else {
    date = new Date(
      $props.displayDate.getFullYear(),
      $props.displayDate.getMonth(),
      day
    )
  }
  if (!$props.tasks) {
    return []
  }
  return $props.tasks
    .filter((e) => {
      const taskDate = new Date(e.end)
      console.log('task:', taskDate.toDateString())
      console.log('date:', date.toDateString())
      return taskDate.toDateString() === date.toDateString()
    })
    .sort((a, b) => a.end - b.end)
}

function isToday(day: number, index: number): boolean {
  let date: Date | null = null
  if (isInPreviousMonth(index)) {
    date = new Date(
      $props.displayDate.getFullYear(),
      $props.displayDate.getMonth() - 1,
      day
    )
  } else if (isInNextMonth(index)) {
    date = new Date(
      $props.displayDate.getFullYear(),
      $props.displayDate.getMonth() + 1,
      day
    )
  } else {
    date = new Date(
      $props.displayDate.getFullYear(),
      $props.displayDate.getMonth(),
      day
    )
  }
  return date.toDateString() === $props.today.toDateString()
}
function isEventInThePast(e: EventType): boolean {
  return e.end < $props.today.getTime()
}
</script>

<template>
  <div class="grid flex-grow grid-cols-7 gap-1 bg-base-200 p-2">
    <div v-for="day in days" :key="day" class="p-2 text-center font-bold">
      {{ day }}
    </div>
    <div
      v-for="(day, index) in _days"
      :key="index"
      class="h-32 overflow-y-auto rounded border border-neutral p-2"
    >
      <div
        class="font-semibold"
        :class="{ 'opacity-20': !isInCurrentMonth(index) }"
      >
        <div
          :class="{
            'h-6 w-6 rounded-full bg-primary text-center text-primary-content':
              isToday(day, index)
          }"
        >
          {{ day }}
        </div>
      </div>
      <NuxtLink
        v-for="event in getEventsForDay(day, index, $props.events)"
        :key="event.id"
        :to="`/calendar/e/${event.id}`"
      >
        <div
          class="mt-1 w-full cursor-pointer rounded bg-primary-content p-1 text-xs text-primary hover:bg-blue-200"
          :class="{ 'opacity-60': isEventInThePast(event) }"
        >
          <div class="font-semibold">{{ event.title }}</div>
          <div>{{ formatTime(event.start) }} - {{ formatTime(event.end) }}</div>
          <div v-if="event.location">📍 {{ event.location }}</div>
          <div v-if="event.category">🏷️ {{ event.category }}</div>
        </div>
      </NuxtLink>

      <NuxtLink
        v-for="event in getEventsForDay(day, index, $props.eventsGuest)"
        :key="event.id"
        :to="`/calendar/e/${event.id}`"
      >
        <div
          class="mt-1 w-full cursor-pointer rounded bg-primary-content p-1 text-xs text-secondary hover:bg-blue-200"
          :class="{ 'opacity-60': isEventInThePast(event) }"
        >
          <div class="font-semibold">{{ event.title }}</div>
          <div>{{ formatTime(event.start) }} - {{ formatTime(event.end) }}</div>
          <div v-if="event.location">📍 {{ event.location }}</div>
          <div v-if="event.category">🏷️ {{ event.category }}</div>
        </div>
      </NuxtLink>

      <NuxtLink
        v-for="task in getTasksForDay(day, index)"
        :key="task.id"
        :to="`/calendar/t/${task.id}`"
      >
        <div
          class="mt-1 cursor-pointer rounded bg-primary-content p-1 text-xs text-accent hover:bg-blue-200"
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
</template>
