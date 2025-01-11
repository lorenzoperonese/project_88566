import { User } from '@/server/db'

interface pw {
  password: string
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<pw>(event)

    if (!body) {
      setResponseStatus(event, 400)
      return
    }

    if (body.password.length < 4) {
      setResponseStatus(event, 400)
      return
    }

    await User.updateOne(
      {
        _id: event.context.auth.id
      },
      {
        password: body.password
      }
    )
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 500)
    return { err }
  }
})
