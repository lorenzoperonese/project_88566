import { User } from '@/server/db'

export default defineEventHandler(async (event): Promise<User | object> => {
  try {
    const u = await User.findById(event.context.auth.id)
    if (!u) {
      setResponseStatus(event, 404)
      return { err: 'User not found' }
    }

    return {
      id: u.id.toString(),
      username: u.username,
      name: u.name,
      avatar: u.avatar,
      theme: u.theme
    } as User
  } catch (e) {
    setResponseStatus(event, 500)
    return { err: 'Internal server error' }
  }
})
