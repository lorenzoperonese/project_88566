import { Task } from '@/server/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  console.log('Updating event ID:', id)

  try {
    if (!id) {
      throw new Error('ID is not defined')
    }

    const body = await readBody<Task>(event)
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

    if (!body.end) {
      setResponseStatus(event, 400)
      return {
        code: 'END_REQUIRED',
        err: 'Body malformed: end date is required.'
      }
    }

    if (!body.users) {
      body.users = []
    }

    const t = await Task.findById(id)
    if (!t) {
      setResponseStatus(event, 404)
      return { err: 'Task not found' }
    }

    if (t.user_id.toString() !== event.context.auth.id) {
      let oldT = await Task.findOneAndUpdate(
        {
          _id: id,
          users: { $in: [event.context.auth.id] }
        },
        {
          completed: body.completed
        }
      )

      if (!oldT) {
        setResponseStatus(event, 404)
        return { err: 'Task not found' }
      }
      console.log(oldT)
      console.log(body)

      if (body.completed !== oldT.completed) {
        for (const user of body.users) {
          if (user === event.context.auth.id) {
            continue
          }
          sendNotification(
            'Task updated',
            `Task "${body.title}" has been updated`,
            user,
            'basic',
            undefined
          )
        }

        sendNotification(
          'Task updated',
          `Task "${body.title}" has been updated`,
          oldT.user_id.toString(),
          'basic',
          undefined
        )
      }

      return { mgs: 'Updated task' }
    }

    await Task.findOneAndUpdate(
      {
        _id: id,
        user_id: event.context.auth.id
      },
      {
        title: body.title,
        end: body.end,
        note: body.note,
        category: body.category,
        completed: body.completed,
        users: body.users
      }
    )

    for (const user of body.users) {
      sendNotification(
        'Task updated',
        `Task "${body.title}" has been updated`,
        user,
        'basic',
        undefined
      )
    }

    return { mgs: 'Updated task' }
  } catch (err) {
    console.error(err)
    return { err: err }
  }
})
