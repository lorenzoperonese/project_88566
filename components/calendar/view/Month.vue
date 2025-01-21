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

  return result
})

interface CalendarCell {
  index: number
  day: number
  items: CalendarItem[]
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
      items: getAllItemsForDay(normalizedDate, {
        events: $props.events,
        eventsGuest: $props.eventsGuest,
        tasks: $props.tasks,
        pomodoro: $props.pomodoro,
        resources: $props.resources,
        projects: $props.projects,
        notAvailable: $props.notAvailable,
        noteTasks: $props.noteTasks
      })
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

      <template v-for="item in c.items" :key="item.id">
        <CalendarEvent
          v-if="item.type === 'event'"
          :event="item.originalItem as EventType"
          :today="$props.today"
          :display-date="getNormalizedDate($props.displayDate, c.day, c.index)"
        />
        <CalendarEvent
          v-else-if="item.type === 'guest-event'"
          :event="item.originalItem as EventType"
          :today="$props.today"
          :guest="true"
          :display-date="getNormalizedDate($props.displayDate, c.day, c.index)"
        />
        <CalendarTask
          v-else-if="item.type === 'task'"
          :task="item.originalItem as Task"
          :today="$props.today"
        />
        <CalendarPomodoro
          v-else-if="item.type === 'pomodoro'"
          :pomodoro="item.originalItem as PomodoroEvent"
          :today="$props.today"
        />
        <CalendarResource
          v-else-if="item.type === 'resource'"
          :resource="item.originalItem as Resource"
          :today="$props.today"
          :display-date="getNormalizedDate($props.displayDate, c.day, c.index)"
        />
        <CalendarProject
          v-else-if="item.type === 'project'"
          :p-event="item.originalItem as ProjectEvent"
          :today="$props.today"
          :display-date="getNormalizedDate($props.displayDate, c.day, c.index)"
        />
        <CalendarNotAvailable
          v-else-if="item.type === 'not-available'"
          :not-available="item.originalItem as NotAvailable"
          :today="$props.today"
          :display-date="getNormalizedDate($props.displayDate, c.day, c.index)"
        />
        <CalendarNoteTask
          v-else-if="item.type === 'note-task'"
          :note-task="item.originalItem as NoteTask"
          :today="$props.today"
        />
      </template>
    </div>
  </div>
</template>
