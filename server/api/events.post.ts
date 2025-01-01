import { Event, User, Resource, ResourceList } from '@/server/db'
import { sendNotification } from '@/server/utils/notifications'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<EventType>(event)

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
        waiting: body.guests.waiting,
        accepted: []
      },
      user_id: event.context.auth.id
    })

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

    const notificationPromises = body.guests.waiting.map((user: User) =>
      sendNotification(
        `You have been invited to an event by ${sender.username}`,
        `${newEvent.title}, ${new Date(newEvent.start).toLocaleDateString()}`,
        user.id,
        'event-invited',
        newEvent.id
      )
    )

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
