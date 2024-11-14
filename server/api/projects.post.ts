import { Project, ProjectTask } from '@/server/db'

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const body = await readBody<Project>(event)

    if (!body) {
      throw createError({
        statusCode: 400,
        message: 'Invalid request body'
      })
    }

    if (!body.title) {
      throw createError({
        statusCode: 400,
        message: 'Project title is required'
      })
    }

    if (!body.description) {
      throw createError({
        statusCode: 400,
        message: 'Project description is required'
      })
    }

    // Create new project
    const project = new Project({
      title: body.title,
      description: body.description,
      user_id: event.context.auth.id,
      tasks: [],
      guests: {
        waiting: body.guests.waiting,
        accepted: body.guests.accepted
      }
    })

    // Save project first to get its ID
    await project.save()

    return
  } catch (err) {
    console.error(err)
    throw createError({
      statusCode: 500,
      message: 'Failed to create project'
    })
  }
})
