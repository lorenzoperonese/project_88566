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

export function getEventsForDay(
  events: EventType[] | null,
  displayDate: Date,
  day: number,
  index: number
): EventType[] {
  let date: Date | null = null
  if (isInPreviousMonth(displayDate, index)) {
    date = new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, day)
  } else if (isInNextMonth(displayDate, index)) {
    date = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, day)
  } else {
    date = new Date(displayDate.getFullYear(), displayDate.getMonth(), day)
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

export function getTasksForDay(
  tasks: Task[] | null,
  displayDate: Date,
  day: number,
  index: number
): Task[] {
  let date: Date | null = null
  if (isInPreviousMonth(displayDate, index)) {
    date = new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, day)
  } else if (isInNextMonth(displayDate, index)) {
    date = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, day)
  } else {
    date = new Date(displayDate.getFullYear(), displayDate.getMonth(), day)
  }
  if (!tasks) {
    return []
  }
  return tasks
    .filter((e) => {
      const taskDate = new Date(e.end)
      return taskDate.toDateString() === date.toDateString()
    })
    .sort((a, b) => a.end - b.end)
}

export function getPomodorosForDay(
  pomodoro: PomodoroEvent[] | null,
  displayDate: Date,
  day: number,
  index: number
): PomodoroEvent[] {
  let date: Date | null = null
  if (isInPreviousMonth(displayDate, index)) {
    date = new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, day)
  } else if (isInNextMonth(displayDate, index)) {
    date = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, day)
  } else {
    date = new Date(displayDate.getFullYear(), displayDate.getMonth(), day)
  }
  if (!pomodoro) {
    return []
  }
  return pomodoro
    .filter((e) => {
      const taskDate = new Date(e.date)
      return taskDate.toDateString() === date.toDateString()
    })
    .sort((a, b) => a.date - b.date)
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
