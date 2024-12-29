import { ResourceList } from '@/server/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<ResourceList>(event)
    if (!body) {
      setResponseStatus(event, 400)
      return {
        code: 'BODY_REQUIRED',
        err: 'Body is required.'
      }
    }

    if (!body.name) {
      setResponseStatus(event, 400)
      return {
        code: 'NAME_REQUIRED',
        err: 'Body malformed: name is required.'
      }
    }

    const resource = new ResourceList({
      name: body.name
    })

    await resource.save()
  } catch (e) {
    console.error(e)
    setResponseStatus(event, 500)
    return []
  }
})
