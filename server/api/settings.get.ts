import { Settings } from '@/server/db'

export default defineEventHandler(async (event): Promise<Settings | null> => {
  try {
    const s = await Settings.findOne({ user_id: event.context.auth.id })

    if (!s) {
      setResponseStatus(event, 404)
      return null
    }

    return {
      home: s.home
    }
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return null
  }
})
