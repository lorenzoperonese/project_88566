import type { FlattenMaps, Types } from 'mongoose'
import type { IEvent, IUser } from '@/server/db'
import { Event } from '@/server/db'

type StatusFilter = 'waiting' | 'accepted'
type PopulatedEvent = FlattenMaps<
  Omit<IEvent, 'guests'> & {
    guests: {
      waiting: FlattenMaps<IUser>[]
      accepted: FlattenMaps<IUser>[]
    }
  }
>

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
        query = { _id: id, 'guests.waiting': event.context.auth.id }
        break
      case 'accepted':
        query = { _id: id, 'guests.accepted': event.context.auth.id }
        break
      default:
        query = {
          _id: id,
          $or: [
            { 'guests.waiting': event.context.auth.id },
            { 'guests.accepted': event.context.auth.id }
          ]
        }
        break
    }
    console.log(query)
    const n = await Event.findOne(query)
      .populate<{ 'guests.waiting': IUser[] }>('guests.waiting')
      .populate<{ 'guests.accepted': IUser[] }>('guests.accepted')
      .lean<PopulatedEvent>()

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
      repetition: n.repetition as Repetition,
      notify: n.notify as Notify[],
      guests: n.guests
    } as EventType
  } catch (err) {
    console.error(err)
    return null
  }
})
