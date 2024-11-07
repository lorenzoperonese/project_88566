import { Event } from '@/server/db'
import type { Types } from 'mongoose'

export default defineEventHandler(async (event): Promise<EventType[]> => {
  try {
    const events = await Event.find({
      'guests.waiting.id': event.context.auth.id // tmp, change to "guests.accepted.id" when implemented
    })

    return events.map((n) => ({
      id: (n._id as Types.ObjectId).toString() as string,
      title: n.title,
      start: n.start,
      end: n.end,
      location: n.location,
      note: n.note,
      category: n.category,
      repetition: n.repetition as Repetition,
      notify: n.notify as Notify[],
      guests: n.guests as Guest
    })) as EventType[]
  } catch (err) {
    console.error(err)
    return []
  }
})
