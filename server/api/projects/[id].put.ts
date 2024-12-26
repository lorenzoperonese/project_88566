import { Project, User } from '@/server/db'
import type { Types } from 'mongoose'

interface PutProjectEvent {
  id: string
  title: string
  description: string
  guests: string[]
}

export default defineEventHandler(async (event) => {
  try {
    const project_id = getRouterParam(event, 'id')

    if (!project_id) {
      throw Error('Id not found')
    }

    let body = await readBody<PutProjectEvent>(event)

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

    let og = await Project.findById(project_id)

    if (!og) {
      throw createError({
        statusCode: 404,
        message: 'Project not found'
      })
    }

    og.title = body.title
    og.description = body.description

    const users_ids: Types.ObjectId[] = []
    for (const i in body.guests) {
      let u = await User.findOne({ username: body.guests[i] })
      if (!u) {
        throw createError({
          statusCode: 404,
          message: `User ${body.guests[i]} not found`
        })
      }
      users_ids.push(u._id as Types.ObjectId)
    }

    for (let i = 0; i < og.guests.waiting.length; i++) {
      if (!users_ids.includes(og.guests.waiting[i])) {
        // Remove user from waiting list
        sendNotification(
          'Project modified',
          `You have been removed from project ${og.title}`,
          og.guests.waiting[i].toString(),
          'basic',
          undefined
        )
        og.guests.waiting.splice(i, 1)
      }
    }

    for (let i = 0; i < og.guests.accepted.length; i++) {
      if (!users_ids.includes(og.guests.accepted[i])) {
        // Remove user from accepted list
        sendNotification(
          'Project modified',
          `You have been removed from project ${og.title}`,
          og.guests.accepted[i].toString(),
          'basic',
          undefined
        )
        og.guests.accepted.splice(i, 1)
      } else {
        sendNotification(
          'Project modified',
          `Project ${og.title} has been modified`,
          og.guests.accepted[i].toString(),
          'basic',
          undefined
        )
      }
    }

    for (let i = 0; i < users_ids.length; i++) {
      if (
        !og.guests.waiting.includes(users_ids[i]) &&
        !og.guests.accepted.includes(users_ids[i])
      ) {
        // Add user to waiting list
        og.guests.waiting.push(users_ids[i])
        sendNotification(
          'Project invitation',
          `You have been invited to project ${og.title}`,
          users_ids[i].toString(),
          'project-invited',
          project_id
        )
      }
    }

    console.log(og)

    await Project.findOneAndUpdate(
      {
        _id: project_id,
        user_id: event.context.auth.id
      },
      og
    )
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 500)
    return { err }
  }
})
