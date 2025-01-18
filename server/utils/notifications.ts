import { User, Notification, PushNotification  } from '@/server/db'
import { getIo } from '@/server/plugins/02.socket.io'
import webpush from 'web-push'

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

    const n = {
      id: notification.id,
      title: notification.title,
      body: notification.body,
      type: notification.type,
      users: [user.id],
      event_id: ''
    } as PushNotification

    // Websocket notification
    getIo().to(user.id.toString()).emit('notification', n)

    // Push notification
    await sendPushNotification(n)
  } catch (e) {
    console.error('Saving notification: ', e)
  }
}

export async function sendPushNotification(notification: PushNotification) {
  for (const user of notification.users) {
    // The db only stores the options for the notifications endpoint, not the
    // notifications themselves.
    const options = await PushNotification.find({
      user_id: user
    })

    if (!options) {
      throw new Error('Options for notify are empty for user: ' + user)
    }

    for (const opt of options) {
      try {
        await webpush.sendNotification(
          opt.subscription,
          JSON.stringify({
            id: notification.id,
            title: notification.title,
            body: notification.body,
            event_id: notification.event_id
          })
        )
      } catch (err) {
        console.error('Error sending push notification: ', err)
      }
    }
  }
}
