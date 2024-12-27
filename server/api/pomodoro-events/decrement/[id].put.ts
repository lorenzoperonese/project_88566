import { PomodoroEvent } from '@/server/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    const updatedPomodoro = await PomodoroEvent.findOneAndUpdate(
      {
        _id: id,
        user_id: event.context.auth.id
      },
      {
        $inc: { cycles: -1 }
      },
      { new: true }
    )

    if (!updatedPomodoro) {
      setResponseStatus(event, 404)
      return { error: 'Pomodoro not found' }
    }

    return updatedPomodoro
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 500)
    return { error: 'Internal server error' }
  }
})
