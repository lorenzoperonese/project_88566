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

    if (!body.tasks || !Array.isArray(body.tasks) || body.tasks.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'Project tasks are required'
      })
    }

    // Create new project
    const project = new Project({
      title: body.title,
      description: body.description,
      user_id: event.context.auth.id,
      guests: {
        waiting: body.guests.waiting,
        accepted: body.guests.accepted
      }
    })

    // Save project first to get its ID
    const savedProject = await project.save()

    // Create and save all tasks
    const taskPromises = body.tasks.map((task) => {
      const newTask = new ProjectTask({
        ...task,
        user_id: event.context.auth.id,
        project_id: savedProject._id
      })
      return newTask.save()
    })

    // Wait for all tasks to be saved
    await Promise.all(taskPromises)

    return
  } catch (err) {
    console.error(err)
    throw createError({
      statusCode: 500,
      message: 'Failed to create project'
    })
  }
})
