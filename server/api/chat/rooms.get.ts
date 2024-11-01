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

  //return [
  //  {
  //    roomId: '1',
  //    roomName: 'Lollo',
  //    avatar: '',
  //    users: [
  //      {
  //        _id: '1234',
  //        username: 'lollo',
  //        avatar: '',
  //        status: {
  //          state: 'offline',
  //          lastChanged: 'never'
  //        }
  //      },
  //      {
  //        _id: '2222',
  //        username: 'samu',
  //        avatar: '',
  //        status: {
  //          state: 'offline',
  //          lastChanged: 'never'
  //        }
  //      }
  //    ],
  //    typingUsers: ['2222']
  //  },
  //  {
  //    roomId: '2',
  //    roomName: 'Alice',
  //    avatar: '',
  //    users: [
  //      {
  //        _id: '4444',
  //        username: 'alice',
  //        avatar: '',
  //        status: {
  //          state: 'offline',
  //          lastChanged: 'never'
  //        }
  //      },
  //      {
  //        _id: '2222',
  //        username: 'samu',
  //        avatar: '',
  //        status: {
  //          state: 'offline',
  //          lastChanged: 'never'
  //        }
  //      }
  //    ],
  //    typingUsers: ['2222']
  //  }
  //]
})
