import { ProjectTask } from '@/server/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<{ id: string }>(event)

  try {
    if (!id) {
      throw new Error('ID is not defined')
    }

    await ProjectTask.findOneAndDelete({
      _id: body.id,
      project_id: id,
      user_id: event.context.auth.id
    })
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 400)
    return
  }
})
