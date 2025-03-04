import { Project, User } from '@/server/db'
import type { Types } from 'mongoose'

interface InputProject {
  title: string
  description: string
  guests: string[]
}

export default defineEventHandler(async (event) => {
  try {
    // Get request body
    const body = await readBody<InputProject>(event)

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

    const guests_ids: Types.ObjectId[] = []

    for (const g in body.guests) {
      const u = await User.findOne({ username: body.guests[g] })
      if (!u) {
        throw createError({
          statusCode: 404,
          message: `User ${body.guests[g]} not found`
        })
      }

      guests_ids.push(u.id)
    }

    // Create new project
    const project = new Project({
      title: body.title,
      description: body.description,
      user_id: event.context.auth.id,
      tasks: [],
      guests: {
        waiting: guests_ids,
        accepted: []
      }
    })

    // Save project first to get its ID
    await project.save()

    for (const g in guests_ids) {
      try {
        await sendNotification(
          'Project invitation',
          `You have been invited to project ${project.title}`,
          guests_ids[g].toString(),
          'project-invited',
          project.id
        )
      } catch (e) {
        console.error('Error sending notification: ', e)
      }
    }

    return {
      message: 'Project created successfully',
      eventId: project.id
    }
  } catch (err) {
    console.error(err)
    throw createError({
      statusCode: 500,
      message: 'Failed to create project'
    })
  }
})
