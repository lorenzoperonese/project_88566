export { Note }

declare global {
  interface Note {
    id: string
    title: string
    body: string
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
}
