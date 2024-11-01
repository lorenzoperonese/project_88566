import type { Message as ChatMessage } from 'vue-advanced-chat'
import { Message } from '@/server/db'

export default defineEventHandler(
  async (event): Promise<ChatMessage | null> => {
    const body = await readBody(event)

    if (!body) {
      setResponseStatus(event, 400)
      return null
    }

    if (!body.content || !body.roomId) {
      setResponseStatus(event, 400)
      return null
    }

    body.senderId = event.context.auth.id

    try {
      const message = new Message(body)
      message.save()
      return message
    } catch (err) {
      setResponseStatus(event, 500)
      console.error(err)
      return null
    }
  }
)
