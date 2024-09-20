import { Note } from '@/server/db'

export default defineEventHandler(async (_) => {
  try {
    const notes = await Note.find()
    console.log(notes)
    return notes.map((n) => ({
      id: n._id,
      title: n.title,
      body: n.body
    }))
  } catch (err) {
    console.error(err)
  }
})
