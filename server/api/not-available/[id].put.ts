import { NotAvailable } from '@/server/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    const body = await readBody<NotAvailable>(event)
    if (!body) {
      setResponseStatus(event, 400)
      return {
        message: 'Request body is required'
      }
    }

    if (!body.start) {
      setResponseStatus(event, 400)
      return {
        message: 'Start date is required'
      }
    }

    if (!body.end) {
      setResponseStatus(event, 400)
      return {
        message: 'End date is required'
      }
    }

    await NotAvailable.findOneAndUpdate(
      {
        _id: id,
        user_id: event.context.auth.id
      },
      {
        start: body.start,
        end: body.end
      }
    )
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
  }
})
