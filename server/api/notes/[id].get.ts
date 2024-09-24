import type { Types } from 'mongoose'
import { Note } from '@/server/db'

export default defineEventHandler(async (event): Promise<Note | null> => {
  const id = getRouterParam(event, 'id')

  try {
    if (!id) {
      throw Error('ID is undefined')
    }

    const n = await Note.findOne({
      _id: id,
      user_id: event.context.auth.id
    })

    if (!n) {
      throw Error('Note not found. ID: ' + id)
    }

    return {
      id: (n._id as Types.ObjectId).toString() as string,
      title: n.title,
      body: n.body
    } as Note
  } catch (err) {
    console.error(err)
    return null
  }
})
