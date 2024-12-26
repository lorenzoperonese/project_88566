import type { Types } from 'mongoose'
import type { IUser } from '@/server/db'
import { Task } from '@/server/db'

export default defineEventHandler(async (event): Promise<Task | null> => {
  const id = getRouterParam(event, 'id')

  try {
    if (!id) {
      throw Error('ID is undefined')
    }

    const n = await Task.findOne({
      _id: id,
      $or: [
        { user_id: event.context.auth.id },
        { users: { $in: [event.context.auth.id] } }
      ]
    }).populate<{ users: IUser[] }>('users')

    if (!n) {
      throw Error('Event not found. ID: ' + id)
    }

    return {
      id: (n._id as Types.ObjectId).toString() as string,
      title: n.title,
      end: n.end,
      note: n.note,
      category: n.category,
      completed: n.completed,
      user_id: n.user_id.toString(),
      users: n.users.map((u) => u.username)
    } as Task
  } catch (err) {
    console.error(err)
    return null
  }
})
