import type { User } from '@/server/db'
import { Event } from '@/server/db'
import { sendNotification } from '@/server/utils/notifications'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  try {
    if (!id) {
      throw new Error('ID is not defined')
    }

    const n = await Event.findOne({
      _id: id,
      user_id: event.context.auth.id
    })
      .select('guests title start')
      .exec()

    if (!n) {
      setResponseStatus(event, 404)
      return {
        code: 'EVENT_NOT_FOUND',
        error: 'Event not found.'
      }
    }

    await Event.findOneAndDelete({
      _id: id,
      user_id: event.context.auth.id
    })

    if (n.guests?.waiting) {
      n.guests.waiting.forEach((u: User) => {
        sendNotification(
          `A pending event you were invited to has been deleted by the host`,
          `${n.title}, ${new Date(n.start).toLocaleDateString()}`,
          u.id,
          'event-deleted',
          id
        )
      })
    }

    if (n.guests?.accepted) {
      n.guests.accepted.forEach((u: User) => {
        sendNotification(
          `An event you were invited to has been deleted by the host`,
          `${n.title}, ${new Date(n.start).toLocaleDateString()}`,
          u.id,
          'event-deleted',
          id
        )
      })
    }

    return { message: 'Event deleted successfully' }
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 500)
    return {
      code: 'INTERNAL_SERVER_ERROR',
      error: err instanceof Error ? err.message : 'An unknown error occurred'
    }
  }
})
