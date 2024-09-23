import { getAuthSession } from '@/server/utils/session'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth:token')

  if (!token) {
    setResponseStatus(event, 401)
    return {
      err: 'Unauthenticated'
    }
  }

  const s = await getAuthSession(token)
  if (!s) {
    setResponseStatus(event, 401)
    return {
      err: 'Cookie for auth is not valid or expired'
    }
  }

  return { s }
})
