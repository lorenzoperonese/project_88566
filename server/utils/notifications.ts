import { User, Notification } from '@/server/db'

export async function sendNotification(
  title: string,
  body: string,
  receiver: string
) {
  const user = await User.findOne({ _id: receiver })
  if (!user) {
    throw new Error('User not found')
  }

  const notification = new Notification({
    title: title,
    body: body,
    read: false,
    user_id: user._id
  })

  await notification.save()
}
