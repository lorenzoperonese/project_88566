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

enum RepetitionPeriod {
  Day = 1,
  Week = 2,
  Month = 3,
  Year = 4
}

interface BaseItem {
  [key: string]: any
  start?: number
  end?: number
  date?: number
  repetition?: Repetition | null
}

const dayOffset = 24 * 60 * 60 * 1000

// Helper to get all occurrences of a repeating event until a specific date
function getRepetitionOccurrences(
  startDate: Date,
  endDate: Date,
  repetition: Repetition,
  amaxDate: Date
): Date[] {
  const occurrences: Date[] = [startDate]
  let currentDate = new Date(startDate)
  let occurrenceCount = 1

  let maxDate = new Date(amaxDate.getTime() + dayOffset) // Look ahead by one day

  while (currentDate <= maxDate) {
    let nextDate: Date | null = null

    switch (repetition.period) {
      case RepetitionPeriod.Day:
        nextDate = new Date(currentDate)
        nextDate.setDate(nextDate.getDate() + repetition.every)
        break

      case RepetitionPeriod.Week:
        if (Array.isArray(repetition.repeatOn)) {
          // Handle weekly repetition with specific days
          const currentDay = currentDate.getDay()
          const days = repetition.repeatOn.sort((a, b) => a - b)

          // Find next day in the current week
          const nextDay = days.find((day) => day > currentDay)
          if (nextDay !== undefined) {
            nextDate = new Date(currentDate)
            nextDate.setDate(nextDate.getDate() + (nextDay - currentDay))
          } else {
            // Move to next week cycle and use first day
            nextDate = new Date(currentDate)
            nextDate.setDate(
              nextDate.getDate() + 7 * repetition.every - currentDay + days[0]
            )
          }
        } else {
          nextDate = new Date(currentDate)
          nextDate.setDate(nextDate.getDate() + 7 * repetition.every)
        }
        break

      case RepetitionPeriod.Month:
        if (typeof repetition.repeatOn === 'number') {
          nextDate = new Date(currentDate)
          nextDate.setMonth(nextDate.getMonth() + repetition.every)

          if (repetition.repeatOn === 1) {
            // Same day of month
            // No additional adjustment needed
          } else if (repetition.repeatOn === 2) {
            // Same week number and day of week
            const originalWeekNum = Math.ceil(startDate.getDate() / 7)
            const originalDayOfWeek = startDate.getDay()

            // Find the same weekday in the same week number
            const firstDayOfMonth = new Date(
              nextDate.getFullYear(),
              nextDate.getMonth(),
              1
            )
            const firstDayOfWeek = firstDayOfMonth.getDay()
            const targetDay =
              (originalWeekNum - 1) * 7 +
              ((originalDayOfWeek - firstDayOfWeek + 7) % 7) +
              1

            nextDate.setDate(targetDay)
          }
        }
        break

      case RepetitionPeriod.Year:
        nextDate = new Date(currentDate)
        nextDate.setFullYear(nextDate.getFullYear() + repetition.every)
        break
    }

    if (!nextDate || nextDate > maxDate) break

    // Check if we've hit the end conditions
    if (repetition.endAfter && occurrenceCount >= repetition.endAfter) break
    if (repetition.endOn && nextDate.getTime() - dayOffset > repetition.endOn)
      break

    currentDate = nextDate
    occurrences.push(currentDate)
    occurrenceCount++
  }

  return occurrences
}

// Helper function to get the normalized date for comparison
export function getNormalizedDate(
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

// Generic function to check if an item occurs on a specific date
function doesItemOccurOnDate<T extends BaseItem>(
  item: T,
  date: Date,
  startField: DateField = 'start',
  endField: DateField = 'end'
): boolean {
  const itemStartDate = new Date(item[startField] as number)
  const itemEndDate = new Date(item[endField] as number)
  const normalizedDate = new Date(date.toDateString())
  const duration = itemEndDate.getTime() - itemStartDate.getTime()

  // If the item has no repetition, just check if the date falls within the range
  if (!item.repetition) {
    return (
      normalizedDate >= new Date(itemStartDate.toDateString()) &&
      normalizedDate <= new Date(itemEndDate.toDateString())
    )
  }

  // Get all occurrences up to the target date
  const occurrences = getRepetitionOccurrences(
    itemStartDate,
    itemEndDate,
    item.repetition,
    new Date(date.getTime() + duration) // Look ahead by the duration of the event
  )

  // Check if any occurrence's range includes our target date
  let tmp = occurrences.some((occurrenceStart) => {
    const occurrenceEnd = new Date(occurrenceStart.getTime() + duration)
    return (
      normalizedDate >= new Date(occurrenceStart.toDateString()) &&
      normalizedDate <= new Date(occurrenceEnd.toDateString())
    )
  })

  return tmp
}

// Generic function to get items for a specific day
function getItemsForDay<T extends BaseItem>(
  items: T[] | null,
  day: Date,
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

  let tmp = items
    .filter((item) => doesItemOccurOnDate(item, day, startField, endField))
    .sort((a, b) => (a[sortField] as number) - (b[sortField] as number))

  return tmp
}

// Specific implementations using the generic function
export function getEventsForDay(
  events: EventType[] | null,
  day: Date
): EventType[] {
  return getItemsForDay(events, day, {
    startField: 'start',
    endField: 'end',
    sortField: 'start'
  })
}

export function getTasksForDay(tasks: Task[] | null, day: Date): Task[] {
  return getItemsForDay(tasks, day, {
    startField: 'end',
    endField: 'end',
    sortField: 'end'
  })
}

export function getPomodorosForDay(
  pomodoros: PomodoroEvent[] | null,
  day: Date
): PomodoroEvent[] {
  return getItemsForDay(pomodoros, day, {
    startField: 'date',
    endField: 'date',
    sortField: 'date'
  })
}

export function getResourcesForDay(
  resources: Resource[] | null,
  day: Date
): Resource[] {
  return getItemsForDay(resources, day, {
    startField: 'start',
    endField: 'end',
    sortField: 'start'
  })
}

export function getProjectsForDay(
  events: ProjectEvent[] | null,
  day: Date
): ProjectEvent[] {
  return getItemsForDay(events, day, {
    startField: 'start',
    endField: 'end',
    sortField: 'start'
  })
}

export function getNotAvailableForDay(
  notAvailable: NotAvailable[] | null,
  day: Date
): NotAvailable[] {
  return getItemsForDay(notAvailable, day, {
    startField: 'start',
    endField: 'end',
    sortField: 'start'
  })
}

export function getNoteTasksForDay(
  noteTasks: NoteTask[] | null,
  day: Date
): NoteTask[] {
  return getItemsForDay(noteTasks, day, {
    startField: 'end',
    endField: 'end',
    sortField: 'end'
  })
}

export function isToday(today: Date, day: Date): boolean {
  return today.toDateString() == day.toDateString()
}

export function isInThePast(today: Date, e: Date): boolean {
  return e < today
}

export function isResourceAvailable(
  resources: Resource[],
  resourceName: string,
  start: Date,
  end: Date
): boolean {
  return !resources.some((r) => {
    const rStart = new Date(r.start)
    const rEnd = new Date(r.end)
    console.log(r.title, resourceName)
    console.log(rStart, rEnd)
    console.log(start, end)
    return (
      r.title === resourceName &&
      ((rStart <= start && start < rEnd) ||
        (rStart >= start && rStart < end) ||
        (rStart <= start && rEnd >= end))
    )
  })
}

export function isUserAvailable(
  notAvailable: NotAvailable[],
  userId: string,
  start: Date,
  end: Date
): boolean {
  return !notAvailable.some((n) => {
    const rStart = new Date(n.start)
    const rEnd = new Date(n.end)
    return (
      n.user_id === userId &&
      ((rStart <= start && start < rEnd) ||
        (rStart >= start && rStart < end) ||
        (rStart <= start && rEnd >= end))
    )
  })
}
