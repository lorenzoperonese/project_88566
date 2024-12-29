import { Resource } from '@/server/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<Resource>(event)
    if (!body) {
      setResponseStatus(event, 400)
      return {
        code: 'BODY_REQUIRED',
        err: 'Body is required.'
      }
    }

    if (!body.title || !body.start || !body.end) {
      setResponseStatus(event, 400)
      return {
        code: 'TITLE_START_END_REQUIRED',
        err: 'Body malformed: title, start and end are required.'
      }
    }

    const resource = new Resource({
      title: body.title,
      start: body.start,
      end: body.end,
      note: body.note
    })

    await resource.save()
  } catch (e) {
    console.error(e)
    setResponseStatus(event, 500)
    return []
  }
})
