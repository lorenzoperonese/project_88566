import { Event, User, Resource, ResourceList } from '@/server/db'
import { sendNotification } from '@/server/utils/notifications'
import type { Types } from 'mongoose'

interface InputEvent {
  id: string
  title: string
  start: number
  end: number
  location: string | null
  note: string | null
  category: string
  resource?: string | null
  repetition: Repetition | null
  notify: Notify[]
  guests: {
    waiting: string[]
    accepted: string[]
  }
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<InputEvent>(event)

    const validationChecks = [
      {
        condition: !body,
        code: 'REQ_BODY_REQUIRED',
        message: 'Request body is required'
      },
      {
        condition: !body?.title?.trim(),
        code: 'TITLE_REQUIRED',
        message: 'Title is required'
      },
      {
        condition: !body?.start,
        code: 'START_REQUIRED',
        message: 'Start date is required'
      },
      {
        condition: !body?.end,
        code: 'END_REQUIRED',
        message: 'End date is required'
      },
      {
        condition: new Date(body?.start) > new Date(body?.end),
        code: 'INVALID_DATES',
        message: 'Start date must be before end date'
      },
      {
        condition: !body?.guests || !Array.isArray(body?.guests?.waiting),
        code: 'INVALID_GUESTS',
        message: 'Valid guests object with waiting array is required'
      }
    ]

    for (const check of validationChecks) {
      if (check.condition) {
        setResponseStatus(event, 400)
        return {
          code: check.code,
          error: check.message
        }
      }
    }

    console.log('body.resource:', body.resource)
    if (body.resource) {
      const resourceList = await ResourceList.findOne({ name: body.resource })
      if (!resourceList) {
        setResponseStatus(event, 404)
        return {
          code: 'RESOURCE_LIST_NOT_FOUND',
          error: 'Resource list not found'
        }
      }
    }

    const sender = await User.findById(event.context.auth.id)
      .select('username')
      .lean()
      .exec()

    if (!sender) {
      setResponseStatus(event, 404)
      return {
        code: 'USER_NOT_FOUND',
        error: 'User not found'
      }
    }

    const guests_ids: Types.ObjectId[] = []

    for (const g in body.guests.waiting) {
      const u = await User.findOne({ username: body.guests.waiting[g] })
      if (!u) {
        throw createError({
          statusCode: 404,
          message: `User ${body.guests.waiting[g]} not found`
        })
      }

      guests_ids.push(u.id)
    }

    const newEvent = new Event({
      title: body.title.trim(),
      start: new Date(body.start),
      end: new Date(body.end),
      location: body.location?.trim(),
      note: body.note?.trim(),
      category: body.category?.trim(),
      repetition: body.repetition,
      notify: body.notify || [],
      guests: {
        waiting: guests_ids,
        accepted: []
      },
      user_id: event.context.auth.id
    })

    console.log('newEvent:', newEvent)

    if (body.resource) {
      // Add resouce event to resources
      const resource = new Resource({
        title: body.resource,
        start: body.start,
        end: body.end,
        note: body.note,
        event_id: newEvent._id
      })
      await resource.save()
    }

    // Send notifications to all guests

    const notificationPromises = guests_ids.map((id) =>
      sendNotification(
        `Event invitation`,
        `You have been invited to an event by ${sender.username}: ${newEvent.title}, ${new Date(newEvent.start).toLocaleDateString()}`,
        id.toString(),
        'event-invited',
        newEvent.id
      )
    )

    console.log('newEvent.id:', newEvent.id)

    await Promise.all([newEvent.save(), ...notificationPromises])

    setResponseStatus(event, 201)
    return {
      message: 'Event created successfully',
      eventId: newEvent.id
    }
  } catch (err) {
    console.error('Error creating event:', err)
    setResponseStatus(event, 500)
    return {
      code: 'INTERNAL_SERVER_ERROR',
      error: err instanceof Error ? err.message : 'An unknown error occurred'
    }
  }
})
