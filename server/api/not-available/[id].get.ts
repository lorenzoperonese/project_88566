import { NotAvailable } from '@/server/db'
import type { Types } from 'mongoose'

export default defineEventHandler(
  async (event): Promise<NotAvailable | null> => {
    try {
      const id = getRouterParam(event, 'id')

      const n = await NotAvailable.findById(id)
      if (!n) {
        setResponseStatus(event, 404)
        return null
      }

      return {
        id: (n._id as Types.ObjectId).toString(),
        start: n.start,
        end: n.end,
        user_id: n.user_id.toString()
      } as NotAvailable
    } catch (error) {
      console.error(error)
      setResponseStatus(event, 500)
      return null
    }
  }
)
