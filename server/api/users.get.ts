import { User } from '@/server/db'

export default defineEventHandler(async (_): Promise<User[]> => {
  try {
    const users_data = await User.find()
    return users_data.map((u) => ({
      id: u._id,
      username: u.username,
      name: u.name
    })) as User[]
  } catch (err) {
    console.error(err)
    return []
  }
})
