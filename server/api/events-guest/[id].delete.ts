import { Event } from '@/server/db'
import { sendNotification } from '~/server/utils/notifications'

// reject the group event invitation
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  try {
    if (!id) {
      throw Error('Guest event not found. ID: ' + id)
    }
    const n = await Event.findOne({
      _id: id,
      'guests.waiting.id': event.context.auth.id
    }).select('user_id title guests')

    if (!n) {
      throw Error('Guest event not found.')
    }
    await Event.findOneAndUpdate(
      {
        _id: id,
        'guests.waiting.id': event.context.auth.id
      },
      {
        $pull: {
          'guests.waiting': { id: event.context.auth.id }
        }
      }
    )
    await sendNotification(
      `${n.guests.waiting.filter((e) => e.id === event.context.auth.id)[0].name} has rejected your invitation to ${n.title}`,
      'prova',
      n.user_id.toString(),
      'event-reject',
      undefined
    )
    return { msg: 'Rejected event' }
  } catch (err) {
    console.error(err)
    return { err: err }
  }
})
