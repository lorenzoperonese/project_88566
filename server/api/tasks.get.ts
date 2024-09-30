import { Task } from '@/server/db'
import type { Types } from 'mongoose'

export default defineEventHandler(async (event): Promise<Task[]> => {
  try {
    const events = await Task.find({
      user_id: event.context.auth.id
    })

    return events.map((n) => ({
      id: (n._id as Types.ObjectId).toString() as string,
      title: n.title,
      end: n.end,
      note: n.note,
      category: n.category,
      completed: n.completed
    })) as Task[]
  } catch (err) {
    console.error(err)
    return []
  }
})
