import { Event } from '@/server/db'
import type { Types } from 'mongoose'

export default defineEventHandler(async (event): Promise<Event[]> => {
  try {
    const events = await Event.find({
      user_id: event.context.auth.id
    })

    return events.map((n) => ({
      id: (n._id as Types.ObjectId).toString() as string,
      title: n.title,
      start: n.start,
      end: n.end,
      location: n.location,
      note: n.note,
      category: n.category,
      repetition: n.repetition as Repetition
    })) as Event[]
  } catch (err) {
    console.error(err)
    return []
  }
})
