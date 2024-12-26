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
    let body = await readBody<ProjectTask>(event)

    if (!body) {
      throw createError({
        statusCode: 400,
        message: 'Invalid request body'
      })
    }

    if (!body.id) {
      throw createError({
        statusCode: 400,
        message: 'Task ID is required'
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

    if (!body.state) {
      body.state = 'pending'
    }

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

    if (body.dependency === undefined) {
      throw createError({
        statusCode: 400,
        message: 'Task dependency is required'
      })
    } else if (body.dependency === '') {
      body.dependency = null
    }

    if (body.translation === undefined) {
      throw createError({
        statusCode: 400,
        message: 'Task translation is required'
      })
    }

    if (body.milestone === undefined) {
      throw createError({
        statusCode: 400,
        message: 'Task milestone is required'
      })
    }

    body.project_id = project_id

    console.log('Updating task:', body)

    await ProjectTask.findOneAndUpdate(
      {
        _id: body.id,
        user_id: event.context.auth.id
      },
      {
        title: body.title,
        description: body.description,
        phase: body.phase,
        state: body.state,
        start: body.start,
        end: body.end,
        input: body.input,
        output: body.output,
        dependency: body.dependency,
        translation: body.translation,
        milestone: body.milestone,
        user_id: body.user_id
      }
    )

    if (body.user_id !== event.context.auth.id) {
      sendNotification(
        'Task modified',
        `Task ${body.title} has been modified in project ${p.title}`,
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
