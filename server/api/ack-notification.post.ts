import { getNotificator } from '@/server/plugins/04.push_notify'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{ id: string }>(event)

    if (!body || !body.id) {
      throw new Error('Body is empty')
    }

    getNotificator().markAsResponded(body.id)

    console.log('Received ack-notification event', body)
  } catch (error) {
    console.error('Error in ack-notification event', error)
    setResponseStatus(event, 500)
  }
})
