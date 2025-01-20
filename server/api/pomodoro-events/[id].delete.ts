import { PomodoroEvent } from '@/server/db'

export default defineEventHandler(async (event): Promise<object> => {
  try {
    const id = getRouterParam(event, 'id')

    await PomodoroEvent.findOneAndDelete({
      _id: id,
      user_id: event.context.auth.id
    })

    return {}
  } catch (err) {
    console.error(err)
    return []
  }
})
