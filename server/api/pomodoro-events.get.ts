import { PomodoroEvent } from '@/server/db'
import type { Types } from 'mongoose'

export default defineEventHandler(async (event): Promise<PomodoroEvent[]> => {
  try {
    const events = await PomodoroEvent.find({
      user_id: event.context.auth.id
    })

    return events.map((n) => ({
      id: (n._id as Types.ObjectId).toString(),
      title: n.title,
      date: n.date,
      study: n.study,
      break: n.break,
      cycles: n.cycles,
      user_id: n.user_id.toString()
    })) as PomodoroEvent[]
  } catch (err) {
    console.error(err)
    return []
  }
})
