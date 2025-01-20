import { Project, ProjectTask } from '@/server/db'
import type { IUser } from '@/server/db'

export default defineEventHandler(async (event) => {
  try {
    // Get project ID from request path
    const id = getRouterParam(event, 'id')

    if (!id) {
      setResponseStatus(event, 400)
      return
    }

    const fp = await Project.findById(id)

    if (!fp) {
      setResponseStatus(event, 404)
      return
    }

    if (
      fp.user_id.toString() !== event.context.auth.id &&
      fp.guests.accepted.length > 0 &&
      !fp.guests.accepted.includes(event.context.auth.id)
    ) {
      setResponseStatus(event, 403)
      return
    }

    if (fp.user_id.toString() !== event.context.auth.id) {
      await Project.updateOne(
        { _id: id },
        { $pull: { 'guests.accepted': event.context.auth.id } }
      )
      return { message: 'Guest removed' }
    }

    // Find project by ID
    const p = await Project.findOneAndDelete({
      _id: id,
      user_id: event.context.auth.id
    })

    await ProjectTask.deleteMany({ project_id: id })

    if (p) {
      for (const g of p.guests.waiting) {
        sendNotification(
          'Project deleted',
          `Project ${p.title} has been deleted`,
          g.toString(),
          'basic',
          undefined
        )
      }

      for (const g of p.guests.accepted) {
        sendNotification(
          'Project deleted',
          `Project ${p.title} has been deleted`,
          g.toString(),
          'basic',
          undefined
        )
      }
    }

    return { message: 'Project deleted' }
  } catch (err) {
    console.error(err)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete project'
    })
  }
})
