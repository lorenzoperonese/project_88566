import { Settings } from '@/server/db'

export default defineEventHandler(async (event): Promise<Settings | null> => {
  try {
    let body = await readBody<Settings>(event)

    if (!body) {
      setResponseStatus(event, 400)
      return null
    }

    if (!body.home) {
      setResponseStatus(event, 400)
      return null
    }

    console.log('Updating settings: ', body)

    let s = await Settings.findOneAndUpdate(
      { user_id: event.context.auth.id },
      {
        home: {
          showCalendar: body.home.showCalendar,
          showNotes: body.home.showNotes,
          showPomodoro: body.home.showPomodoro,
          showChat: body.home.showChat,
          showProjects: body.home.showProjects,
          calendarFilter: body.home.calendarFilter,
          notesFilter: body.home.notesFilter,
          pomodoroShowTimeIfPaused: body.home.pomodoroShowTimeIfPaused,
          chatShowHub: body.home.chatShowHub,
          chatLimit: body.home.chatLimit,
          projectsLimit: body.home.projectsLimit
        }
      }
    )

    if (!s) {
      setResponseStatus(event, 404)
      return null
    }

    return {
      home: s.home
    }
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return null
  }
})
