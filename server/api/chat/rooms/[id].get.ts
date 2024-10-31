import type { Message as ChatMessage } from 'vue-advanced-chat'

export default defineEventHandler((): ChatMessage[] => {
  let m: ChatMessage = {
    _id: '28312',
    content: 'Message 1',
    senderId: '2222',
    saved: true,
    distributed: true,
    seen: true
  }

  return [m]
})
