import { Event } from '@/server/db'
import { sendNotification } from '~/server/utils/notifications'

// accept the group event invitation
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  try {
    if (!id) {
      throw Error('ID is undefined')
    }

    const n = await Event.findOne({
      _id: id,
      'guests.waiting.id': event.context.auth.id
    }).select('user_id title guests')
    if (!n) {
      throw Error('Guest event not found. ID: ' + id)
    }
    const data = n.guests.waiting.filter(
      (n) => n.id === event.context.auth.id
    )[0]
    n.guests.waiting = n.guests.waiting.filter(
      (n) => n.id !== event.context.auth.id
    )
    n.guests.accepted.push(data)

    await Event.findOneAndUpdate(
      {
        _id: id
      },
      {
        guests: n.guests
      }
    )

    await sendNotification(
      `${data.name} has accepted your invitation to ${n.title}`,
      'prova',
      n.user_id.toString(),
      'event-accept',
      undefined
    )
    return { msg: 'Event accepted' }
  } catch (err) {
    console.error(err)
    return { err: err }
  }
})
