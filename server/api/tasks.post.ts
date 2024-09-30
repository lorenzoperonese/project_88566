import { Task } from '@/server/db'

export default defineEventHandler(async (event) => {
  const body = await readBody<Task>(event)

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

  if (!body.end) {
    setResponseStatus(event, 400)
    return {
      code: 'END_REQUIRED',
      err: 'Body malformed: end date is required.'
    }
  }

  try {
    const e = new Task({
      title: body.title,
      end: body.end,
      note: body.note,
      category: body.category,
      completed: false,
      user_id: event.context.auth.id
    })

    await e.save()
    return { message: 'Task created successfuly' }
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 500)
    return { err }
  }
})
