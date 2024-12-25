import { ProjectTask, Project } from '@/server/db'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<{ id: string }>(event)

  try {
    if (!id) {
      throw new Error('ID is not defined')
    }

    const p = await Project.findById(id)
    if (!p) {
      setResponseStatus(event, 404)
      return
    }

    if (p.user_id.toString() !== event.context.auth.id) {
      setResponseStatus(event, 403)
      return
    }

    const t = await ProjectTask.findOneAndDelete({
      _id: body.id,
      project_id: id
    })

    if (t && t.user_id !== event.context.auth.id) {
      sendNotification(
        'Task deleted',
        `Task ${t.title} has been deleted in project ${p.title}`,
        t.user_id.toString()
      )
    }
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 400)
    return
  }
})
