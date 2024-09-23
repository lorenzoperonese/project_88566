import { NoteCategory } from '@/server/db'

export default defineEventHandler(async (event) => {
  const body = await readBody<NoteCategory>(event)

  if (!body.name) {
    setResponseStatus(event, 400)
    return {
      code: 'NAME_REQUIRED',
      err: 'Body malformed: title is required.'
    }
  }

  try {
    const noteCategory = new NoteCategory({
      name: body.name,
      user_id: event.context.auth.id
    })

    await noteCategory.save()
    return { message: 'Note Category created successfuly' }
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 500)
    return { err }
  }
})
