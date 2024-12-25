import { User, Notification } from '@/server/db'

export async function sendNotification(
  title: string,
  body: string,
  receiver: string
) {
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
      user_id: user._id
    })

    await notification.save()
  } catch (e) {
    console.error('Saving notification: ', e)
  }
}
