import type { Types } from 'mongoose'
import { Event, Resource } from '@/server/db'

export default defineEventHandler(async (event): Promise<EventType | null> => {
  const id = getRouterParam(event, 'id')

  try {
    if (!id) {
      throw Error('ID is undefined')
    }

    const n = await Event.findOne({
      _id: id,
      user_id: event.context.auth.id
    })

    if (!n) {
      throw Error('Event not found. ID: ' + id)
    }

    const res = await Resource.findOne({
      event_id: id
    })

    if (!res) {
      throw Error('Resource not found. Event ID: ' + id)
    }

    return {
      id: (n._id as Types.ObjectId).toString() as string,
      title: n.title,
      start: n.start,
      end: n.end,
      location: n.location,
      note: n.note,
      category: n.category,
      resource: res.title,
      repetition: n.repetition,
      notify: n.notify,
      guests: n.guests
    } as EventType
  } catch (err) {
    console.error(err)
    return null
  }
})
