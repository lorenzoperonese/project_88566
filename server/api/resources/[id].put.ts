import { Resource } from '@/server/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<Resource>(event)

    const id = getRouterParam(event, 'id')
    if (!id) {
      throw Error('ID is undefined')
    }

    if (!event.context.auth.admin) {
      setResponseStatus(event, 403)
      return null
    }

    await Resource.findOneAndUpdate(
      { _id: id },
      {
        title: body.title,
        start: body.start,
        end: body.end,
        note: body.note
      }
    )
  } catch (e) {
    console.error(e)
    setResponseStatus(event, 500)
    return null
  }
})
