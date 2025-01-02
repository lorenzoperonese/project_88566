import { NotAvailable } from '@/server/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      setResponseStatus(event, 400)
      return {
        message: 'ID is required'
      }
    }

    await NotAvailable.findOneAndDelete({
      _id: id,
      user_id: event.context.auth.id
    })

    return { mgs: 'Deleted not-available' }
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
  }
})
