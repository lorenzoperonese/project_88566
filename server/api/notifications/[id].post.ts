import { Notification } from '@/server/db'
import type { JSONResponse } from '@/types'

export default defineEventHandler(async (event): Promise<JSONResponse> => {
  const user_id = event.context.auth.id
  const note_id = getRouterParam(event, 'id')

  try {
    await Notification.updateOne(
      { _id: note_id, user_id },
      { $set: { read: true } }
    )

    return { status: 'success' }
  } catch (error) {
    console.error(error)
    return { err: 'Erro setting notification as red', status: 'error' }
  }
})
