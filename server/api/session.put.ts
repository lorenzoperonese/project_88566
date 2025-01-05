import { User } from '@/server/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<User>(event)
    if (!body) {
      setResponseStatus(event, 400)
      return null
    }

    if (!body.theme) {
      setResponseStatus(event, 400)
      return null
    }

    // TODO: Update all other fields
    await User.updateOne({ _id: event.context.auth.id }, { theme: body.theme })
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return null
  }
})
