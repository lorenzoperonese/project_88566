import { Note } from '@/server/db'
import type { Types } from 'mongoose'

export default defineEventHandler(async (event): Promise<Note[]> => {
  try {
    const notes = await Note.find({
      user_id: event.context.auth.id
    })

    return notes.map((n) => ({
      id: (n._id as Types.ObjectId).toString() as string,
      title: n.title,
      body: n.body,
      category_id: n.category_id,
      updated_at: n.updatedAt.getTime()
    })) as Note[]
  } catch (err) {
    console.error(err)
    return []
  }
})
