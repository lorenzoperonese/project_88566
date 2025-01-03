import { Note } from '@/server/db'
import { Types } from 'mongoose'

export default defineEventHandler(async (event): Promise<NoteTask[]> => {
  try {
    const notes = await Note.find({
      $or: [
        { user_id: event.context.auth.id },
        { shared_with: event.context.auth.id }
      ]
    })

    return notes.flatMap((note) => {
      if (note.todos === undefined) return []

      return note.todos.map((todo) => ({
        id: new Types.ObjectId().toString(), // Random id
        title: todo.title,
        end: todo.end,
        done: todo.done,
        note_id: note._id
      }))
    }) as NoteTask[]
  } catch (err) {
    console.log(err)
    setResponseStatus(event, 500)
    return []
  }
})
