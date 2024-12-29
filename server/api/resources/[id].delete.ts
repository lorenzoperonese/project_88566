import { Resource } from '@/server/db'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw Error('ID is undefined')
    }

    if (!event.context.auth.admin) {
      setResponseStatus(event, 403)
      return null
    }

    await Resource.findOneAndDelete({ _id: id })
  } catch (e) {
    console.error(e)
    setResponseStatus(event, 500)
    return null
  }
})
