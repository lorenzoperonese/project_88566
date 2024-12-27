import { PomodoroEvent } from '@/server/db'
import type { Types } from 'mongoose'

export default defineEventHandler(
  async (event): Promise<PomodoroEvent | null> => {
    try {
      const id = getRouterParam(event, 'id')

      const events = await PomodoroEvent.findOne({
        _id: id,
        user_id: event.context.auth.id
      })

      if (!events) {
        setResponseStatus(event, 404)
        return null
      }

      return {
        id: (events._id as Types.ObjectId).toString(),
        title: events.title,
        date: events.date,
        study: events.study,
        break: events.break,
        cycles: events.cycles,
        user_id: events.user_id.toString()
      } as PomodoroEvent
    } catch (err) {
      console.error(err)
      return null
    }
  }
)
