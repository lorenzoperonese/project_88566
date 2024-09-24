import { NoteCategory } from '@/server/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  console.log('Deleting note category ID:', id)

  try {
    if (!id) {
      throw new Error('ID is not defined')
    }

    await NoteCategory.findOneAndDelete({
      _id: id,
      user_id: event.context.auth.id
    })

    return { mgs: 'Deleted note category' }
  } catch (err) {
    console.error(err)
    return { err: err }
  }
})
