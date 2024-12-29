import { ResourceList } from '@/server/db'

export default defineEventHandler(async (event): Promise<ResourceList[]> => {
  try {
    const r = await ResourceList.find()

    return r.map((v) => ({
      id: v.id.toString(),
      name: v.name
    }))
  } catch (e) {
    console.error(e)
    setResponseStatus(event, 500)
    return []
  }
})
