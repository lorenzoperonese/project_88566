<script setup lang="ts">
const $props = defineProps<{
  events: EventType[] | null
  eventsGuest: EventType[] | null
  tasks: Task[] | null
  displayDate: Date
  today: Date
}>()

const _days = computed(() => {
  const result = []
  for (let i = 0; i < _firstDayOfMonth($props.displayDate); i++) {
    result.push(
      new Date(
        $props.displayDate.getFullYear(),
        $props.displayDate.getMonth(),
        0
      ).getDate() -
        _firstDayOfMonth($props.displayDate) +
        i +
        1
    )
  }

  for (let i = 1; i <= _daysInMonth($props.displayDate); i++) {
    result.push(i)
  }

  let i = 1
  while (result.length % 7 !== 0) {
    result.push(i)
    i++
  }
  return result
})

interface CalendarCell {
  index: number
  day: number
  events: EventType[]
  tasks: Task[]
}

const calendar = computed((): CalendarCell[] => {
  const result: CalendarCell[] = []

  for (let index = 0; index < _days.value.length; index++) {
    result.push({
      index,
      day: _days.value[index],
      events: getEventsForDay(
        $props.events,
        $props.displayDate,
        _days.value[index],
        index
      ),
      tasks: getTasksForDay(
        $props.tasks,
        $props.displayDate,
        _days.value[index],
        index
      )
    })
  }
  return result
})
</script>

<template>
  <div class="grid flex-grow grid-cols-7 gap-1 bg-base-200 p-2">
    <div v-for="day in days" :key="day" class="p-2 text-center font-bold">
      {{ day }}
    </div>
    <div
      v-for="c in calendar"
      :key="c.index"
      class="h-32 overflow-y-auto rounded border border-neutral p-2"
    >
      <div
        class="font-semibold"
        :class="{
          'opacity-20': !isInCurrentMonth($props.displayDate, c.index)
        }"
      >
        <div
          :class="{
            'h-6 w-6 rounded-full bg-primary text-center text-primary-content':
              isToday($props.today, $props.displayDate, c.day, c.index)
          }"
        >
          {{ c.day }}
        </div>
      </div>
      <NuxtLink
        v-for="event in c.events"
        :key="event.id"
        :to="`/calendar/e/${event.id}`"
      >
        <div
          class="mt-1 w-full cursor-pointer rounded bg-primary-content p-1 text-xs text-primary hover:bg-blue-200"
          :class="{ 'opacity-60': isEventInThePast($props.today, event) }"
        >
          <div class="font-semibold">{{ event.title }}</div>
          <div>{{ formatTime(event.start) }} - {{ formatTime(event.end) }}</div>
          <div v-if="event.location">📍 {{ event.location }}</div>
          <div v-if="event.category">🏷️ {{ event.category }}</div>
        </div>
      </NuxtLink>

      <NuxtLink
        v-for="task in c.tasks"
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
