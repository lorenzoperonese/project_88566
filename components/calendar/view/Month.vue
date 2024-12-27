<script setup lang="ts">
const $props = defineProps<{
  events: EventType[] | null
  eventsGuest: EventType[] | null
  tasks: Task[] | null
  pomodoro: PomodoroEvent[] | null
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
  eventsGuest: EventType[]
  tasks: Task[]
  pomodoros: PomodoroEvent[]
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
      eventsGuest: getEventsForDay(
        $props.eventsGuest,
        $props.displayDate,
        _days.value[index],
        index
      ),
      tasks: getTasksForDay(
        $props.tasks,
        $props.displayDate,
        _days.value[index],
        index
      ),
      pomodoros: getPomodorosForDay(
        $props.pomodoro,
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

      <CalendarEvent
        v-for="event in c.events"
        :key="event.id"
        :event="event"
        :today="$props.today"
      />
      <CalendarEvent
        v-for="event in c.eventsGuest"
        :key="event.id"
        :event="event"
        :today="$props.today"
        :guest="true"
      />

      <CalendarTask
        v-for="task in c.tasks"
        :key="task.id"
        :task="task"
        :today="$props.today"
      />

      <CalendarPomodoro
        v-for="pomodoro in c.pomodoros"
        :key="pomodoro.id"
        :pomodoro="pomodoro"
        :today="$props.today"
      />
    </div>
  </div>
</template>
