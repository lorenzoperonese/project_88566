export const _firstDayOfMonth = (displayDate: Date) => {
  return new Date(displayDate.getFullYear(), displayDate.getMonth(), 1).getDay()
}

export const _daysInMonth = (displayDate: Date) => {
  return new Date(
    displayDate.getFullYear(),
    displayDate.getMonth() + 1,
    0
  ).getDate()
}

export function isInPreviousMonth(displayDate: Date, index: number): boolean {
  return index < _firstDayOfMonth(displayDate)
}

export function isInNextMonth(displayDate: Date, index: number): boolean {
  return index >= _firstDayOfMonth(displayDate) + _daysInMonth(displayDate)
}

export function isInCurrentMonth(displayDate: Date, index: number): boolean {
  return (
    !isInPreviousMonth(displayDate, index) && !isInNextMonth(displayDate, index)
  )
}

// Type definitions
type DateField = 'start' | 'end' | 'date'
type BaseItem = {
  [key in DateField]?: number
}

// Helper function to get the normalized date for comparison
function getNormalizedDate(
  displayDate: Date,
  day: number,
  index: number
): Date {
  let date: Date
  if (isInPreviousMonth(displayDate, index)) {
    date = new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, day)
  } else if (isInNextMonth(displayDate, index)) {
    date = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, day)
  } else {
    date = new Date(displayDate.getFullYear(), displayDate.getMonth(), day)
  }
  return new Date(date.toDateString())
}

// Generic function to check if an item falls within a date range
function isItemInRange<T extends BaseItem>(
  item: T,
  date: Date,
  startField: DateField = 'start',
  endField: DateField = 'end'
): boolean {
  if (item[startField] === undefined || item[endField] === undefined) {
    const singleDateField = startField === 'start' ? endField : startField
    const itemDate = new Date(item[singleDateField] as number)
    return new Date(itemDate.toDateString()).getTime() === date.getTime()
  }

  const startDate = new Date(item[startField] as number)
  const endDate = new Date(item[endField] as number)
  const compareStart = new Date(startDate.toDateString())
  const compareEnd = new Date(endDate.toDateString())

  return date >= compareStart && date <= compareEnd
}

// Generic function to get items for a specific day
function getItemsForDay<T extends BaseItem>(
  items: T[] | null,
  displayDate: Date,
  day: number,
  index: number,
  options: {
    startField?: DateField
    endField?: DateField
    sortField?: DateField
  } = {}
): T[] {
  if (!items) return []

  const {
    startField = 'start',
    endField = 'end',
    sortField = startField
  } = options

  const normalizedDate = getNormalizedDate(displayDate, day, index)

  return items
    .filter((item) => isItemInRange(item, normalizedDate, startField, endField))
    .sort((a, b) => (a[sortField] as number) - (b[sortField] as number))
}

// Specific implementations using the generic function
export function getEventsForDay(
  events: EventType[] | null,
  displayDate: Date,
  day: number,
  index: number
): EventType[] {
  return getItemsForDay(events, displayDate, day, index, {
    startField: 'start',
    endField: 'end',
    sortField: 'start'
  })
}

export function getTasksForDay(
  tasks: Task[] | null,
  displayDate: Date,
  day: number,
  index: number
): Task[] {
  return getItemsForDay(tasks, displayDate, day, index, {
    startField: 'end',
    endField: 'end',
    sortField: 'end'
  })
}

export function getPomodorosForDay(
  pomodoros: PomodoroEvent[] | null,
  displayDate: Date,
  day: number,
  index: number
): PomodoroEvent[] {
  return getItemsForDay(pomodoros, displayDate, day, index, {
    startField: 'date',
    endField: 'date',
    sortField: 'date'
  })
}

export function getEventsForDay2(
  events: EventType[] | null,
  day: Date
): EventType[] {
  if (!events) {
    return []
  }
  return events
    .filter((e) => {
      const eventDate = new Date(e.start)
      return eventDate.toDateString() === day.toDateString()
    })
    .sort((a, b) => a.start - b.start)
}

export function getTasksForDay2(tasks: Task[] | null, day: Date): Task[] {
  if (!tasks) {
    return []
  }

  return tasks
    .filter((e) => {
      const taskDate = new Date(e.end)
      return taskDate.toDateString() === day.toDateString()
    })
    .sort((a, b) => a.end - b.end)
}

export function isToday(
  today: Date,
  displayDate: Date,
  day: number,
  index: number
): boolean {
  let date: Date | null = null
  if (isInPreviousMonth(displayDate, index)) {
    date = new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, day)
  } else if (isInNextMonth(displayDate, index)) {
    date = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, day)
  } else {
    date = new Date(displayDate.getFullYear(), displayDate.getMonth(), day)
  }
  return date.toDateString() === today.toDateString()
}

export function isToday2(today: Date, day: Date): boolean {
  return today.toDateString() == day.toDateString()
}

export function isInThePast(today: Date, e: EventType | Task): boolean {
  return e.end < today.getTime()
}

export function isInThePastPomodoro(today: Date, e: PomodoroEvent): boolean {
  let ne = new Date(e.date)
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )
  const eventDate = new Date(ne.getFullYear(), ne.getMonth(), ne.getDate())

  return eventDate < todayDate
}
