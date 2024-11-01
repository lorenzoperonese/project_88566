import type { Message as ChatMessage } from 'vue-advanced-chat'
import { Message, Room } from '@/server/db'

export default defineEventHandler(
  async (event): Promise<ChatMessage | Object> => {
    const body = await readBody(event)

    if (!body) {
      setResponseStatus(event, 400)
      return {}
    }

    if (!body.content || !body.roomId) {
      setResponseStatus(event, 400)
      return {}
    }

    body.senderId = event.context.auth.id

    try {
      const room = await Room.findOne({
        roomId: body.roomId
      })

      if (!room) {
        setResponseStatus(event, 404)
        return {}
      }

      if (!room.users.includes(event.context.auth.id)) {
        setResponseStatus(event, 403)
        return {}
      }

      const message = new Message({
        senderId: event.context.auth.id,
        content: body.content,
        conversationId: room.conversationId
      })
      message.save()

      room?.users.forEach((user) => {
        if (user !== event.context.auth.id) {
          // Send push notification to user
        }
      })

      return message
    } catch (err) {
      setResponseStatus(event, 500)
      console.error(err)
      return { err }
    }
  }
)
