import type { Room as ChatRoom } from 'vue-advanced-chat'
import { Room } from '@/server/db'

export default defineEventHandler(async (event): Promise<ChatRoom[]> => {
  try {
    const rooms = await Room.find({
      $expr: { $in: [event.context.auth.id, '$typingUsers'] }
    }).populate('users')

    console.log(rooms)

    return rooms.map((r) => ({
      roomId: r.roomId,
      roomName: r.roomName,
      avatar: r.avatar,
      users: r.users,
      typingUsers: r.typingUsers
    })) as ChatRoom[]
  } catch (err) {
    console.error(err)
    return []
  }
})
