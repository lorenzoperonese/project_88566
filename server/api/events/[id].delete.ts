import { Event } from '@/server/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  console.log('Deleting note ID:', id)

  try {
    if (!id) {
      throw new Error('ID is not defined')
    }

    await Event.findOneAndDelete({
      _id: id,
      user_id: event.context.auth.id
    })

    return { mgs: 'Deleted event' }
  } catch (err) {
    console.error(err)
    return { err: err }
  }
})
