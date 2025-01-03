import type { Types } from 'mongoose'
import { Note } from '@/server/db'
import type { IUser } from '@/server/db'

export default defineEventHandler(async (event): Promise<Note | null> => {
  const id = getRouterParam(event, 'id')

  try {
    if (!id) {
      throw Error('ID is undefined')
    }

    const n = await Note.findOne({
      _id: id,
      $or: [
        { user_id: event.context.auth.id },
        { state: 'public' },
        { shared_with: event.context.auth.id }
      ]
    }).populate<{ shared_with: IUser[] }>('shared_with')

    if (!n) {
      throw Error('Note not found. ID: ' + id)
    }

    return {
      id: (n._id as Types.ObjectId).toString() as string,
      title: n.title,
      body: n.body,
      category_id: n.category_id,
      updated_at: n.updatedAt.getTime(),
      created_at: n.createdAt.getTime(),
      state: n.state,
      shared_with: n.shared_with.map((user) => user.username),
      todos: n.todos,
      user_id: n.user_id.toString()
    } as Note
  } catch (err) {
    console.error(err)
    return null
  }
})
