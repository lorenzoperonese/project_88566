import { Project } from '@/server/db'

export default defineEventHandler(async (event) => {
  try {
    // Get project ID from request path
    const id = getRouterParam(event, 'id')

    // Find project by ID
    await Project.findOneAndDelete({
      _id: id,
      user_id: event.context.auth.id
    })

    return { message: 'Project deleted' }
  } catch (err) {
    console.error(err)
    throw createError({
      statusCode: 500,
      message: 'Failed to delete project'
    })
  }
})
