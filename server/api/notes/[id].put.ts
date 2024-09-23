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

    await Note.findOneAndUpdate(
      {
        _id: id,
        user_id: event.context.auth.id
      },
      {
        title: body.title,
        body: body.body
      }
    )

    return { mgs: 'Updated note' }
  } catch (err) {
    console.error(err)
    return { err: err }
  }
})
