import { Project, ProjectTask } from '@/server/db'
import type { IUser } from '@/server/db'

export default defineEventHandler(async (event) => {
  try {
    // Get project ID from request path
    const id = getRouterParam(event, 'id')

    // Find project by ID
    let p = await Project.findOneAndDelete({
      _id: id,
      user_id: event.context.auth.id
    })

    await ProjectTask.deleteMany({ project_id: id })

    if (p) {
      for (const g of p.guests.waiting) {
        sendNotification(
          'Project deleted',
          `Project ${p.title} has been deleted`,
          g.toString()
        )
      }

      for (const g of p.guests.accepted) {
        sendNotification(
          'Project deleted',
          `Project ${p.title} has been deleted`,
          g.toString()
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
