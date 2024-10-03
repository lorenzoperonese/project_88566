export declare global {
  interface Note {
    id: string
    title: string
    body: string
    category_id?: string
  }

  interface User {
    id: string
    username: string
    name: string
  }

  interface NoteCategory {
    id: string
    name: string
  }

  interface Timer {
    study: number
    break: number
    cycles: number
  }

  enum EventPeriod {
    Day = 1,
    Week = 2,
    Month = 3,
    Year = 4
  }

  interface Repetition {
    every: number
    period: EventPeriod
    repeatOn?: number[] | number
    end?: number
  }

  interface EventType {
    id: string
    title: string
    start: number
    end: number
    location?: string
    note?: string
    category?: string
    repetition?: Repetition
  }

  interface Task {
    id: string
    title: string
    end: number
    note?: string
    completed: boolean
    category?: string
  }
}
