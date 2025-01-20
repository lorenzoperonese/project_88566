import type webpush from 'web-push'
import { PushNotification } from '@/server/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<webpush.PushSubscription>(event)

    await PushNotification.deleteMany({ subscription: body })
    await PushNotification.create({
      subscription: body,
      user_id: event.context.auth.id
    })

    return { msg: 'Notification subscription added' }
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 500)
    return { err }
  }
})
