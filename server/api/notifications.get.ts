import { Notification } from '@/server/db'
import type { JSONResponse } from '@/types'

export default defineEventHandler(
  async (event): Promise<Notification[] | JSONResponse> => {
    const user_id = event.context.auth.id

    try {
      const n = await Notification.find({ user_id })

      return n.map((notification) => {
        return {
          id: notification._id,
          title: notification.title,
          body: notification.body,
          read: notification.read,
          type: notification.type,
          identifier: notification.identifier,
          timestamp: notification.createdAt.getTime()
        }
      }) as Notification[]
    } catch (error) {
      console.error(error)
      setResponseStatus(event, 500)
      return { err: 'Cannot get notifications', status: 'success' }
    }
  }
)
