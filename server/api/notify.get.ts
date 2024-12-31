import webpush from 'web-push'
import { PushNotification } from '@/server/db'

export default defineEventHandler(async (event) => {
  try {
    const options = await PushNotification.find({
      user_id: event.context.auth.id
    })

    if (!options) {
      throw new Error(
        'Options for notify are empty for user: ',
        event.context.auth.id
      )
    }

    for (const opt of options) {
      try {
        await webpush.sendNotification(
          opt.subscription,
          JSON.stringify({
            title: 'Test notification',
            body: 'This is a test from the backend'
          })
        )
      } catch (err) {
        // Avoid errors when notifictions options are old and webpush
        // returns "Received unexpected response code"
      }
    }
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 500)
    return { err }
  }
})
