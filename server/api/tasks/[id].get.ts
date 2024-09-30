import type { Types } from 'mongoose'
import { Task } from '@/server/db'

export default defineEventHandler(async (event): Promise<Task | null> => {
  const id = getRouterParam(event, 'id')

  try {
    if (!id) {
      throw Error('ID is undefined')
    }

    const n = await Task.findOne({
      _id: id,
      user_id: event.context.auth.id
    })

    if (!n) {
      throw Error('Event not found. ID: ' + id)
    }

    return {
      id: (n._id as Types.ObjectId).toString() as string,
      title: n.title,
      end: n.end,
      note: n.note,
      category: n.category,
      completed: n.completed
    } as Task
  } catch (err) {
    console.error(err)
    return null
  }
})
