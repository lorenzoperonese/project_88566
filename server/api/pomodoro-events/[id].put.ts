import { PomodoroEvent } from '@/server/db'

export default defineEventHandler(async (event): Promise<object> => {
  try {
    const id = getRouterParam(event, 'id')

    const data = await readBody<PomodoroEvent>(event)

    await PomodoroEvent.findOneAndUpdate(
      {
        _id: id,
        user_id: event.context.auth.id
      },
      {
        title: data.title,
        date: data.date,
        study: data.study,
        break: data.break,
        cycles: data.cycles
      }
    )

    return {}
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 500)
    return []
  }
})
