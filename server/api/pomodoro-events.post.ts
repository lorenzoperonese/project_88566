import { PomodoroEvent } from '@/server/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<PomodoroEvent>(event)

    if (!body) {
      setResponseStatus(event, 400)
      return {
        code: 'REQ_BODY_REQUIRED',
        err: 'Body is required.'
      }
    }

    if (!body.title) {
      setResponseStatus(event, 400)
      return {
        code: 'TITLE_REQUIRED',
        err: 'Body malformed: title is required.'
      }
    }

    if (!body.date) {
      setResponseStatus(event, 400)
      return {
        code: 'DATE_REQUIRED',
        err: 'Body malformed: date is required.'
      }
    }

    if (!body.study) {
      setResponseStatus(event, 400)
      return {
        code: 'STUDY_REQUIRED',
        err: 'Body malformed: study time is required.'
      }
    }

    if (!body.break) {
      setResponseStatus(event, 400)
      return {
        code: 'BREAK_REQUIRED',
        err: 'Body malformed: break time is required.'
      }
    }

    if (!body.cycles) {
      setResponseStatus(event, 400)
      return {
        code: 'CYCLES_REQUIRED',
        err: 'Body malformed: cycles is required.'
      }
    }

    const e = new PomodoroEvent({
      title: body.title,
      date: body.date,
      study: body.study,
      break: body.break,
      cycles: body.cycles,
      user_id: event.context.auth.id
    })

    e.save()
  } catch (err) {
    console.error(err)
    return []
  }
})
