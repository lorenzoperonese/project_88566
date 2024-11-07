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
    avatar: string
    theme: string
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

  enum RepetitionPeriod {
    Day = 1,
    Week = 2,
    Month = 3,
    Year = 4
  }

  enum NotifyPeriod {
    Minute = 1,
    Hour = 2,
    Day = 3,
    Week = 4
  }

  interface Repetition {
    every: number
    period: RepetitionPeriod
    repeatOn: number[] | number | null
    endAfter: number | null
    endOn: number | null
  }

  interface Notify {
    advance: number
    period: NotifyPeriod
  }

  interface Guest {
    waiting: User[]
    accepted: User[]
  }

  interface EventType {
    id: string
    title: string
    start: number
    end: number
    location: string | null
    note: string | null
    category: string
    repetition: Repetition | null
    notify: Notify[]
    guests: Guest
  }

  interface Task {
    id: string
    title: string
    end: number
    note: string | null
    completed: boolean
    category?: string
  }

  interface ChatRoom {
    id: string
    roomName: string
    senderId: string
    receiver: User
  }

  interface ChatMessage {
    id: string
    senderId: string
    content: string
    conversationId: string
  }

  interface Notification {
    id: string
    title: string
    body: string
    read: boolean
    timestamp: number
  }
}

export interface JSONResponse {
  status: string
  message?: string
  err?: string
}
