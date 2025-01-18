<script setup lang="ts">
const $props = defineProps<{
  events: EventType[] | null
  eventsGuest: EventType[] | null
  tasks: Task[] | null
  pomodoro: PomodoroEvent[] | null
  resources: Resource[] | null
  projects: ProjectEvent[] | null
  notAvailable: NotAvailable[] | null
  noteTasks: NoteTask[] | null
  displayDate: Date
  today: Date
  weekDays: Date[]
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
  while (result.length < 42) {
    result.push(i)
    i++
  }

  console.log('days', result)
  return result
})

interface CalendarCell {
  index: number
  day: number
  events: EventType[]
  eventsGuest: EventType[]
  tasks: Task[]
  pomodoros: PomodoroEvent[]
  resources: Resource[]
  projects: ProjectEvent[]
  notAvailable: NotAvailable[]
  noteTasks: NoteTask[]
}

const calendar = computed((): CalendarCell[] => {
  const result: CalendarCell[] = []

  for (let index = 0; index < _days.value.length; index++) {
    const normalizedDate = getNormalizedDate(
      $props.displayDate,
      _days.value[index],
      index
    )

    result.push({
      index,
      day: _days.value[index],
      events: getEventsForDay($props.events, normalizedDate),
      eventsGuest: getEventsForDay($props.eventsGuest, normalizedDate),
      tasks: getTasksForDay($props.tasks, normalizedDate),
      pomodoros: getPomodorosForDay($props.pomodoro, normalizedDate),
      resources: getResourcesForDay($props.resources, normalizedDate),
      projects: getProjectsForDay($props.projects, normalizedDate),
      notAvailable: getNotAvailableForDay($props.notAvailable, normalizedDate),
      noteTasks: getNoteTasksForDay($props.noteTasks, normalizedDate)
    })
  }
  return result
})
</script>

<template>
  <div class="grid grid-cols-7 bg-base-200 md:gap-1 md:p-2">
    <div
      v-for="day in days"
      :key="day"
      class="hidden p-2 text-center font-bold md:block"
    >
      {{ day }}
    </div>
    <div
      v-for="day in days"
      :key="day"
      class="p-2 text-center text-xs font-bold md:hidden"
    >
      {{ day[0] }}
    </div>
  </div>
  <div
    class="grid h-full grid-cols-7 grid-rows-[repeat(6,1fr)] overflow-y-clip bg-base-200 md:gap-1 md:p-2"
  >
    <div
      v-for="c in calendar"
      :key="c.index"
      class="overflow-y-auto border border-neutral md:rounded md:p-2"
    >
      <div
        class="flex justify-center p-2 text-xs font-semibold md:justify-start md:p-0 md:text-base"
        :class="{
          'opacity-20': !isInCurrentMonth($props.displayDate, c.index)
        }"
      >
        <div
          :class="{
            'w-1/2 max-w-10 rounded-full bg-primary text-center text-primary-content':
              isToday(
                $props.today,
                getNormalizedDate($props.displayDate, c.day, c.index)
              )
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
        :display-date="getNormalizedDate($props.displayDate, c.day, c.index)"
      />
      <CalendarEvent
        v-for="event in c.eventsGuest"
        :key="event.id"
        :event="event"
        :today="$props.today"
        :guest="true"
        :display-date="getNormalizedDate($props.displayDate, c.day, c.index)"
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

      <CalendarResource
        v-for="resource in c.resources"
        :key="resource.id"
        :resource="resource"
        :today="$props.today"
        :display-date="getNormalizedDate($props.displayDate, c.day, c.index)"
      />

      <CalendarProject
        v-for="p in c.projects"
        :key="p.id"
        :p-event="p"
        :today="$props.today"
        :display-date="getNormalizedDate($props.displayDate, c.day, c.index)"
      />

      <CalendarNotAvailable
        v-for="na in c.notAvailable"
        :key="na.id"
        :not-available="na"
        :today="$props.today"
        :display-date="getNormalizedDate($props.displayDate, c.day, c.index)"
      />

      <CalendarNoteTask
        v-for="nt in c.noteTasks"
        :key="nt.id"
        :note-task="nt"
        :today="$props.today"
      />
    </div>
  </div>
</template>
