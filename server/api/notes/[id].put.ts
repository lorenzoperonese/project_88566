import { Note } from '@/server/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  console.log('Updating note ID:', id)

  try {
    if (!id) {
      throw new Error('ID is not defined')
    }

    const body = await readBody<Note>(event)
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

    if (!body.body) {
      setResponseStatus(event, 400)
      return {
        code: 'BODY_REQUIRED',
        err: 'Body malformed: body is required.'
      }
    }

    if (!body.state) {
      body.state = 'private'
    }

    if (body.state === 'private') {
      body.shared_with = []
    }

    if (!body.shared_with) {
      body.shared_with = []
    }

    await Note.findOneAndUpdate(
      {
        _id: id,
        user_id: event.context.auth.id
      },
      {
        title: body.title,
        body: body.body,
        category_id: body.category_id,
        state: body.state,
        shared_with: body.shared_with
      }
    )

    return { mgs: 'Updated note' }
  } catch (err) {
    console.error(err)
    return { err: err }
  }
})
