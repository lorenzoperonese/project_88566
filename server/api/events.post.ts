import { Event } from '@/server/db'

export default defineEventHandler(async (event) => {
  const body = await readBody<Event>(event)

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

  if (!body.start) {
    setResponseStatus(event, 400)
    return {
      code: 'START_REQUIRED',
      err: 'Body malformed: start date is required.'
    }
  }

  if (!body.end) {
    setResponseStatus(event, 400)
    return {
      code: 'END_REQUIRED',
      err: 'Body malformed: end date is required.'
    }
  }

  try {
    console.log('here')
    const e = new Event({
      title: body.title,
      start: body.start,
      end: body.end,
      location: body.location,
      note: body.note,
      category: body.category,
      repetition: body.repetition,
      user_id: event.context.auth.id
    })

    await e.save()
    return { message: 'Event created successfuly' }
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 500)
    return { err }
  }
})
