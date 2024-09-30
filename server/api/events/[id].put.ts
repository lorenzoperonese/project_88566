import { Event } from '@/server/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  console.log('Updating event ID:', id)

  try {
    if (!id) {
      throw new Error('ID is not defined')
    }

    const body = await readBody<EventType>(event)
    console.log(body)

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

    await Event.findOneAndUpdate(
      {
        _id: id,
        user_id: event.context.auth.id
      },
      {
        title: body.title,
        start: body.start,
        end: body.end,
        location: body.location,
        note: body.note,
        category: body.category,
        repetition: body.repetition
      }
    )

    return { mgs: 'Updated event' }
  } catch (err) {
    console.error(err)
    return { err: err }
  }
})
