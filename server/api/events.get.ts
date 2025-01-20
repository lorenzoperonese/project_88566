import type { IEvent, IUser } from '@/server/db'
import { Event } from '@/server/db'
import type { FlattenMaps, Types } from 'mongoose'

type PopulatedEvent = FlattenMaps<
  Omit<IEvent, 'guests'> & {
    guests: {
      waiting: FlattenMaps<IUser>[]
      accepted: FlattenMaps<IUser>[]
    }
  }
>

export default defineEventHandler(async (event): Promise<EventType[]> => {
  try {
    const events = await Event.find({
      user_id: event.context.auth.id
    })
      .populate<{ 'guests.waiting': IUser[] }>('guests.waiting')
      .populate<{ 'guests.accepted': IUser[] }>('guests.accepted')
      .lean<PopulatedEvent[]>()

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
