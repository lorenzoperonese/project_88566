import type { Message as ChatMessage } from 'vue-advanced-chat'
import { Message } from '@/server/db'

export default defineEventHandler(async (event): Promise<ChatMessage[]> => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    setResponseStatus(event, 400)
    return []
  }

  try {
    const messages = await Message.find({
      roomId: id
    })

    return messages
  } catch (err) {
    setResponseStatus(event, 500)
    console.error(err)
    return []
  }
})
