import { Note } from '@/server/db'
import type { IUser } from '@/server/db'
import type { Types } from 'mongoose'

export default defineEventHandler(async (event): Promise<Note[]> => {
  try {
    const notes = await Note.find({
      $or: [
        { user_id: event.context.auth.id },
        { state: 'public' },
        { shared_with: event.context.auth.id }
      ]
    }).populate<{ shared_with: IUser[] }>('shared_with')

    return notes.map((n) => ({
      id: (n._id as Types.ObjectId).toString() as string,
      title: n.title,
      body: n.body,
      category_id: n.category_id,
      updated_at: n.updatedAt.getTime(),
      shared_with: n.shared_with.map((user) => user.username),
      user_id: n.user_id.toString(),
      state: n.state,
      todos: n.todos
    })) as Note[]
  } catch (err) {
    console.error(err)
    return []
  }
})
