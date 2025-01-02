import { NotAvailable } from '@/server/db'

export default defineEventHandler(async (event) => {
  try {
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

    const notAvailable = new NotAvailable({
      start: body.start,
      end: body.end,
      user_id: event.context.auth.id
    })

    await notAvailable.save()
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
  }
})
