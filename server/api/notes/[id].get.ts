import type { Types } from 'mongoose'
import Note from '~/components/notes/Note.vue'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  try {
    if (!id) {
      throw Error('ID is undefined')
    }

    const n = await Note.findOne({
      _id: id
    })

    if (!n) {
      throw Error('Note not found. ID: ' + id)
    }

    return new Note({
      id: (n._id as Types.ObjectId).toString() as string,
      title: n.title,
      body: n.body
    })
  } catch (err) {
    console.error(err)
  }
})
