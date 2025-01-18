import { ProjectTask, Project } from '@/server/db'

export default defineEventHandler(async (event) => {
  try {
    const project_id = getRouterParam(event, 'id')

    if (!project_id) {
      throw Error('Id not found')
    }

    const p = await Project.findById(project_id)
    if (!p) {
      throw createError({
        statusCode: 404,
        message: 'Project not found'
      })
    }

    if (p.user_id.toString() !== event.context.auth.id) {
      throw createError({
        statusCode: 403,
        message: 'Unauthorized'
      })
    }

    // Get request body
    const body = await readBody<ProjectTask>(event)

    if (!body) {
      throw createError({
        statusCode: 400,
        message: 'Invalid request body'
      })
    }

    if (!body.title) {
      throw createError({
        statusCode: 400,
        message: 'Task title is required'
      })
    }

    if (!body.description) {
      throw createError({
        statusCode: 400,
        message: 'Task description is required'
      })
    }

    if (!body.phase) {
      body.phase = 'pending'
    }

    body.user_id = event.context.auth.id

    if (!body.start) {
      throw createError({
        statusCode: 400,
        message: 'Task start date is required'
      })
    }

    if (!body.end) {
      throw createError({
        statusCode: 400,
        message: 'Task end date is required'
      })
    }

    if (!body.input) {
      throw createError({
        statusCode: 400,
        message: 'Task input is required'
      })
    }

    if (!body.output) {
      throw createError({
        statusCode: 400,
        message: 'Task output is required'
      })
    }

    if (!body.translation) {
      body.translation = false
    }

    if (!body.milestone) {
      body.milestone = false
    }

    if (!body.dependency) {
      body.dependency = null
    }

    body.project_id = project_id

    const task = new ProjectTask(body)

    await task.save()

    if (body.user_id !== event.context.auth.id) {
      sendNotification(
        'Task created',
        `Task ${body.title} has been created in project ${p.title}`,
        body.user_id,
        'basic',
        undefined
      )
    }
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 500)
    return { err }
  }
})
