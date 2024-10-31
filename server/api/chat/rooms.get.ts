import type { Room as ChatRoom } from 'vue-advanced-chat'

export default defineEventHandler((): ChatRoom[] => {
  return [
    {
      roomId: '1',
      roomName: 'Lollo',
      avatar: '',
      users: [
        {
          _id: '1234',
          username: 'lollo',
          avatar: '',
          status: {
            state: 'offline',
            lastChanged: 'never'
          }
        },
        {
          _id: '2222',
          username: 'samu',
          avatar: '',
          status: {
            state: 'offline',
            lastChanged: 'never'
          }
        }
      ],
      typingUsers: ['2222']
    },
    {
      roomId: '2',
      roomName: 'Alice',
      avatar: '',
      users: [
        {
          _id: '4444',
          username: 'alice',
          avatar: '',
          status: {
            state: 'offline',
            lastChanged: 'never'
          }
        },
        {
          _id: '2222',
          username: 'samu',
          avatar: '',
          status: {
            state: 'offline',
            lastChanged: 'never'
          }
        }
      ],
      typingUsers: ['2222']
    }
  ]
})
