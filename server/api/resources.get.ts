import { Resource } from '@/server/db'

export default defineEventHandler(async (event): Promise<Resource[]> => {
  try {
    const r = await Resource.find()

    return r.map((v) => ({
      id: v.id.toString(),
      title: v.title,
      start: v.start,
      end: v.end,
      note: v.note
    }))
  } catch (e) {
    console.error(e)
    setResponseStatus(event, 500)
    return []
  }
})
