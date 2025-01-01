import { getAuthSession } from '@/server/utils/session'

export default defineEventHandler(async (event) => {
  if (event.node.req.url && needAuth(event.node.req.url)) {
    const token = getCookie(event, 'auth:token')

    if (!token) {
      console.log('No token')
      setResponseStatus(event, 401)
      return {
        err: 'Unauthenticated'
      }
    }

    const s = await getAuthSession(token)
    if (!s) {
      console.log('No session')
      setResponseStatus(event, 401)
      return {
        err: 'Cookie for auth is not valid or expired'
      }
    }

    event.context.auth = {
      id: s.user_id,
      username: s.username,
      admin: s.admin
    }
  }
})

function needAuth(path: string): boolean {
  if (!path.startsWith('/api')) {
    return false
  }

  if (path.startsWith('/api/auth')) {
    return false
  }

  return true
}
