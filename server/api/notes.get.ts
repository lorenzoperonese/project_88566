import { Note } from '@/server/db'
import type { Types } from 'mongoose'

export default defineEventHandler(async (_): Promise<Note[]> => {
  try {
    const notes = await Note.find()
    console.log(notes)
    return notes.map((n) => ({
      id: (n._id as Types.ObjectId).toString() as string,
      title: n.title,
      body: n.body
    })) as Note[]
  } catch (err) {
    console.error(err)
    return []
  }
})
