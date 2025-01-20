import type webpush from 'web-push'
import { PushNotification } from '@/server/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<webpush.PushSubscription>(event)

    await PushNotification.deleteMany({ subscription: body })

    return { msg: 'Notification subscription deleted' }
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 500)
    return { err }
  }
})
