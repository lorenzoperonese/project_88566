export declare global {
  interface Note {
    id: string
    title: string
    body: string
    category_id?: string
    updated_at?: number
    created_at?: number
    user_id: string // private, public, shared
    state: string
    shared_with: string[]
  }

  interface User {
    id: string
    username: string
    name: string
    avatar: string
    theme: string
    admin?: boolean
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

  interface PomodoroEvent {
    id: string
    title: string
    date: number
    study: number
    break: number
    cycles: number
    user_id: string
  }

  interface ProjectEvent {
    id: string
    task_name: string
    project_id: string
    project_name: string
    start: number
    end: number
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

  interface NotifyRepeatConfig {
    count: number // numero di ripetizioni (0 per infinito)
    interval: number // intervallo tra le ripetizioni
    intervalUnit: NotifyPeriod
    untilResponse: boolean
  }

  interface Notify {
    advance: number
    period: number
    repeat?: NotifyRepeatConfig
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
    resource?: string | null
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
    category: string | null
    user_id: string
    users: string[]
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
    type: string
    identifier?: string
    read: boolean
    timestamp: number
  }

  interface ProjectTask {
    id: string
    title: string
    description: string
    phase: string
    user_id: string
    state: string
    start: number
    end: number
    input: string
    output: string
    translation: boolean
    milestone: boolean
    dependency: string | null
    project_id: string
  }

  interface Project {
    id: string
    title: string
    description: string
    tasks: ProjectTask[]
    guests: Guest
    user_id: string
  }

  interface Settings {
    home: HomeSettings
  }

  interface HomeSettings {
    showCalendar: boolean
    showNotes: boolean
    showPomodoro: boolean
    showChat: boolean
    showProjects: boolean
    calendarFilter: string // all, events, tasks
    notesFilter: string // all, private, shared, public
    pomodoroShowTimeIfPaused: boolean
    chatShowHub: boolean
    chatLimit: number
    projectsLimit: number
  }

  interface Resource {
    id: string
    title: string
    start: number
    end: number
    note?: string
    event_id?: string
  }

  interface ResourceList {
    id: string
    name: string
  }
}

export interface JSONResponse {
  status: string
  message?: string
  err?: string
}
