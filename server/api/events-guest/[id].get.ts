import type { Types } from 'mongoose'
import { Event } from '@/server/db'

export default defineEventHandler(async (event): Promise<EventType | null> => {
  const id = getRouterParam(event, 'id')

  try {
    if (!id) {
      throw Error('ID is undefined')
    }

    const n = await Event.findOne({
      _id: id,
      "guests.waiting.id": event.context.auth.id // tmp, change to "guests.accepted.id" when implemented
    })

    if (!n) {
      throw Error('Guest event not found. ID: ' + id)
    }

    return {
      id: (n._id as Types.ObjectId).toString() as string,
      title: n.title,
      start: n.start,
      end: n.end,
      location: n.location,
      note: n.note,
      category: n.category,
      repetition: n.repetition,
      notify: n.notify,
      guests: n.guests
    } as EventType
  } catch (err) {
    console.error(err)
    return null
  }
})
