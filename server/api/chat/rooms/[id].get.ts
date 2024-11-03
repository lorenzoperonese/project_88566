import { Message, Room } from '@/server/db'

export default defineEventHandler(async (event): Promise<ChatMessage[]> => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    setResponseStatus(event, 400)
    return []
  }

  try {
    const room = await Room.findById(id)
    if (!room) {
      setResponseStatus(event, 404)
      return []
    }

    const messages = await Message.find({
      conversationId: room.conversationId
    })

    return messages.map((m) => ({
      id: m._id.toString(),
      senderId: m.senderId.toString(),
      content: m.content,
      conversationId: m.conversationId.toString()
    }))
  } catch (err) {
    setResponseStatus(event, 500)
    console.error(err)
    return []
  }
})
