import { User, RoomUser, Room } from '@/server/db'
import { Types } from 'mongoose'
import type { Room as ChatRoom } from 'vue-advanced-chat'

interface CreateRoom {
  person: string
}

export default defineEventHandler(async (event): Promise<ChatRoom | Object> => {
  const body = await readBody<CreateRoom>(event)

  if (!body) {
    setResponseStatus(event, 400)
    return {
      code: 'REQ_BODY_REQUIRED',
      err: 'Body is required.'
    }
  }

  if (!body.person) {
    setResponseStatus(event, 400)
    return {
      code: 'PERSON_REQUIRED',
      err: 'Body malformed: person is required.'
    }
  }

  try {
    const user = await User.findOne({
      username: body.person
    })

    if (!user) {
      setResponseStatus(event, 404)
      return {
        code: 'USER_NOT_FOUND',
        err: "User not found. Can't create room with him"
      }
    }

    const r = new Room({
      roomId: new Types.ObjectId(),
      roomName: user.username,
      avatar: 'none',
      users: [user._id, event.context.auth.id],
      typingUsers: [event.context.auth.id],
      user_id: event.context.auth.id
    })

    const r2 = await r.save()
    console.log(r2)

    let r3 = await r2.populate('users')
    if (!r3) {
      console.error('Room not found but inserted?')
      throw new Error('Room not found but inserted?')
    }
    console.log(r3)

    return r3
  } catch (err) {
    setResponseStatus(event, 500)
    console.error(err)
    return { err }
  }
})
