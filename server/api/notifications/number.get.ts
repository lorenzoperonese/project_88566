import { Notification } from '@/server/db'
import type { JSONResponse } from '@/types'

export default defineEventHandler(
  async (event): Promise<number | JSONResponse> => {
    const user_id = event.context.auth.id

    try {
      const count = await Notification.find({
        user_id,
        read: false
      }).countDocuments()

      return count
    } catch (error) {
      console.error(error)
      return { err: 'Erro setting notification as red', status: 'error' }
    }
  }
)
