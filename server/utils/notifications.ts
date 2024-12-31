import { User, Notification } from '@/server/db'
import { getIo } from '@/server/plugins/02.socket.io'

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

    await notification.save()
    console.log('Sending notification to: ', user.id.toString())
    getIo().to(user.id.toString()).emit('notification', notification)
  } catch (e) {
    console.error('Saving notification: ', e)
  }
}
