import type { FlattenMaps, Types } from 'mongoose'
import type { IEvent, IUser } from '@/server/db'
import { Event, Resource } from '@/server/db'

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

    const n = await Event.findOne({
      _id: id,
      user_id: event.context.auth.id
    })
      .populate<{ 'guests.waiting': IUser[] }>('guests.waiting')
      .populate<{ 'guests.accepted': IUser[] }>('guests.accepted')
      .lean<PopulatedEvent>()

    if (!n) {
      throw Error('Event not found. ID: ' + id)
    }

    const res = await Resource.findOne({
      event_id: id
    })

    return {
      id: (n._id as Types.ObjectId).toString() as string,
      title: n.title,
      start: n.start,
      end: n.end,
      location: n.location,
      note: n.note,
      category: n.category,
      resource: res ? res.title : null,
      repetition: n.repetition as Repetition,
      notify: n.notify as Notify[],
      guests: n.guests
    } as EventType
  } catch (err) {
    console.error(err)
    return null
  }
})
