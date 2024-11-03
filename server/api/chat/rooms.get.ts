import { Room } from '@/server/db'

export default defineEventHandler(async (event): Promise<ChatRoom[]> => {
  try {
    const rooms = await Room.find({ senderId: event.context.auth.id })
      .populate<{
        receiverId: User
      }>({ path: 'receiverId', select: 'username' })
      .exec()

    console.log(rooms)

    return rooms.map((room) => ({
      id: room._id.toString(),
      roomName: room.roomName.toString(),
      senderId: room.senderId.toString(),
      receiver: {
        id: (room.receiverId as any)._id.toString(),
        username: room.receiverId.username
      }
    })) as ChatRoom[]
  } catch (err) {
    console.error(err)
    return []
  }
})
