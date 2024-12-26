import { Note } from '@/server/db'

export default defineEventHandler(async (event) => {
  const body = await readBody<Note>(event)

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

  try {
    const note = new Note({
      title: body.title,
      body: body.body,
      category_id: body.category_id,
      user_id: event.context.auth.id,
      state: body.state,
      shared_with: body.shared_with
    })

    await note.save()
    return { message: 'Note created successfuly' }
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 500)
    return { err }
  }
})
