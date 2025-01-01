import type { Types } from 'mongoose'
import { Event } from '@/server/db'

type StatusFilter = 'waiting' | 'accepted'

export default defineEventHandler(async (event): Promise<EventType | null> => {
  const id = getRouterParam(event, 'id')

  try {
    if (!id) {
      throw Error('ID is undefined')
    }
    const status = getQuery(event).status as StatusFilter
    let query = {}

    switch (status) {
      case 'waiting':
        query = { _id: id, 'guests.waiting.id': event.context.auth.id }
        break
      case 'accepted':
        query = { _id: id, 'guests.accepted.id': event.context.auth.id }
        break
      default:
        query = {
          _id: id,
          $or: [
            { 'guests.waiting.id': event.context.auth.id },
            { 'guests.accepted.id': event.context.auth.id }
          ]
        }
        break
    }

    const n = await Event.findOne(query)

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
      notify: n.notify as Notify[],
      guests: n.guests
    } as EventType
  } catch (err) {
    console.error(err)
    return null
  }
})
