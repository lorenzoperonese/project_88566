import { Resource } from '@/server/db'

export default defineEventHandler(async (event): Promise<Resource | null> => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw Error('ID is undefined')
    }

    if (!event.context.auth.admin) {
      setResponseStatus(event, 403)
      return null
    }

    const r = await Resource.findById(id)
    if (!r) {
      setResponseStatus(event, 404)
      return null
    }

    return {
      id: r.id.toString(),
      title: r.title,
      start: r.start,
      end: r.end,
      note: r.note
    } as Resource
  } catch (e) {
    console.error(e)
    setResponseStatus(event, 500)
    return null
  }
})
