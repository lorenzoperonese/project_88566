import { NotAvailable } from '@/server/db'
import type { Types } from 'mongoose'

export default defineEventHandler(async (event): Promise<NotAvailable[]> => {
  try {
    const notAvailable = await NotAvailable.find()

    return notAvailable.map((n) => ({
      id: (n._id as Types.ObjectId).toString(),
      start: n.start,
      end: n.end,
      user_id: n.user_id.toString()
    }))
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return []
  }
})
