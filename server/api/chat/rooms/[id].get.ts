import type { Message as ChatMessage } from 'vue-advanced-chat'
import { Message, Room } from '@/server/db'

export default defineEventHandler(async (event): Promise<ChatMessage[]> => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    setResponseStatus(event, 400)
    return []
  }

  try {
    const room = await Room.findOne({
      roomId: id
    })

    if (!room) {
      setResponseStatus(event, 404)
      return []
    }

    const messages = await Message.find({
      conversationId: room.conversationId
    })

    return messages
  } catch (err) {
    setResponseStatus(event, 500)
    console.error(err)
    return []
  }
})
