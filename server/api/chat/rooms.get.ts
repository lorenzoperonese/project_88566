import type { Room as ChatRoom } from 'vue-advanced-chat'
import { Room } from '@/server/db'

export default defineEventHandler(async (event): Promise<ChatRoom[]> => {
  try {
    const rooms = await Room.find({
      user_id: event.context.auth.id
    }).populate('users')

    return rooms
  } catch (err) {
    console.error(err)
    return []
  }
})
