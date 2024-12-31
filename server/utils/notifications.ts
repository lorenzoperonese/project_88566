import { User, Notification } from '@/server/db'
import { getIo } from '@/server/plugins/02.socket.io'
import webpush from 'web-push'
import { PushNotification } from '@/server/db'

// Type can be 'basic', 'project-invited', 'event-invited'.
// indetifier is the id of the project or event for the invitation.
export async function sendNotification(
  title: string,
  body: string,
  receiver: string,
  type: string,
  identifier: string | undefined
) {
  type = type || 'basic'
  identifier = identifier || undefined

  console.log('Sending notification to: ', receiver)
  const user = await User.findOne({ _id: receiver })
  if (!user) {
    throw new Error('User not found')
  }

  try {
    const notification = new Notification({
      title: title,
      body: body,
      read: false,
      type: type,
      identifier: identifier,
      user_id: user.id
    })

    console.log('Sending notification to: ', user.id.toString())

    // Internal site notification
    await notification.save()

    // Websocket notification
    getIo().to(user.id.toString()).emit('notification', notification)

    // Push notification
    await sendPushNotification(user.id.toString())
  } catch (e) {
    console.error('Saving notification: ', e)
  }
}

export async function sendPushNotification(id: string) {
  const options = await PushNotification.find({
    user_id: id
  })

  if (!options) {
    throw new Error('Options for notify are empty for user: ' + id)
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
}
