import { NoteCategory } from '@/server/db'
import type { Types } from 'mongoose'

export default defineEventHandler(async (event): Promise<NoteCategory[]> => {
  try {
    const notes = await NoteCategory.find({
      user_id: event.context.auth.id
    })

    return notes.map((n) => ({
      id: (n._id as Types.ObjectId).toString() as string,
      name: n.name
    })) as NoteCategory[]
  } catch (err) {
    console.error(err)
    return []
  }
})
