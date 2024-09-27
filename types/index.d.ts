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
    Week,
    Month,
    Year
  }

  interface Repetition {
    every: number
    period: EventPeriod
    repeteOn?: number[] | number
    end?: Date | number
  }

  interface Event {
    id: string
    title: string
    start: Date
    end: Date
    location?: string
    note?: string
    category?: string
    repetition?: Repetition
  }
}
