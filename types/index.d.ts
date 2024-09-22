
export { Note }

declare global {
  interface Note {
    id: string
    title: string
    body: string
  }
}
