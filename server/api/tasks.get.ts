import { Task } from '@/server/db'
import type { IUser } from '@/server/db'
import type { Types } from 'mongoose'

export default defineEventHandler(async (event): Promise<Task[]> => {
  try {
    const events = await Task.find({
      $or: [
        { user_id: event.context.auth.id },
        { users: { $in: [event.context.auth.id] } }
      ]
    }).populate<{ users: IUser[] }>('users')

    return events.map((n) => ({
      id: (n._id as Types.ObjectId).toString() as string,
      title: n.title,
      end: n.end,
      note: n.note,
      category: n.category,
      completed: n.completed,
      user_id: n.user_id.toString(),
      users: n.users.map((u) => u.username)
    })) as Task[]
  } catch (err) {
    console.error(err)
    return []
  }
})
