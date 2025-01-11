import { Event, Resource } from '@/server/db'
import { sendNotification } from '@/server/utils/notifications'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  console.log('Updating event ID:', id)

  try {
    if (!id) {
      setResponseStatus(event, 400)
      return {
        code: 'ID_REQUIRED',
        error: 'Event ID is required'
      }
    }

    const body = await readBody<EventType>(event)
    console.log('Update request body:', body)

    const requiredFields = [
      { field: 'title', code: 'TITLE_REQUIRED', message: 'Title is required' },
      {
        field: 'start',
        code: 'START_REQUIRED',
        message: 'Start date is required'
      },
      { field: 'end', code: 'END_REQUIRED', message: 'End date is required' },
      {
        field: 'guests',
        code: 'GUESTS_REQUIRED',
        message: 'Guests object is required'
      }
    ]

    for (const { field, code, message } of requiredFields) {
      if (!body?.[field as keyof EventType]) {
        setResponseStatus(event, 400)
        return {
          code,
          error: `Body malformed: ${message}`
        }
      }
    }

    if (
      !Array.isArray(body.guests.waiting) ||
      !Array.isArray(body.guests.accepted)
    ) {
      setResponseStatus(event, 400)
      return {
        code: 'INVALID_GUESTS_FORMAT',
        error: 'Guests must have valid waiting and accepted arrays'
      }
    }

    const currentEvent = await Event.findOne({
      _id: id,
      user_id: event.context.auth.id
    })
      .select('guests title')
      .lean()
      .exec()

    if (!currentEvent) {
      setResponseStatus(event, 404)
      return {
        code: 'EVENT_NOT_FOUND',
        error: 'Event not found'
      }
    }

    const invalidNewAcceptedGuests = body.guests.accepted.filter(
      (newGuest: User) =>
        !currentEvent.guests.accepted.some(
          (currentGuest: User) => currentGuest.id === newGuest.id
        )
    )

    if (invalidNewAcceptedGuests.length > 0) {
      setResponseStatus(event, 400)
      return {
        code: 'INVALID_GUESTS',
        error: 'Accepted guests must be a subset of the current accepted guests'
      }
    }

    await Event.findOneAndUpdate(
      {
        _id: id,
        user_id: event.context.auth.id
      },
      {
        $set: {
          title: body.title,
          start: body.start,
          end: body.end,
          location: body.location,
          note: body.note,
          category: body.category,
          repetition: body.repetition,
          notify: body.notify,
          guests: body.guests
        }
      }
    ).exec()

    if (body.resource) {
      await Resource.findOneAndUpdate(
        { event_id: id },
        { title: body.resource, start: body.start, end: body.end }
      ).exec()
    } else {
      await Resource.findOneAndDelete({ event_id: id }).exec()
    }

    const guestChanges = {
      waiting: {
        removed: currentEvent.guests.waiting.filter(
          (x: User) => !body.guests.waiting.some((y: User) => y.id === x.id)
        ),
        added: body.guests.waiting.filter(
          (x: User) =>
            !currentEvent.guests.waiting.some((y: User) => y.id === x.id)
        )
      },
      accepted: {
        removed: currentEvent.guests.accepted.filter(
          (x: User) => !body.guests.accepted.some((y: User) => y.id === x.id)
        )
      }
    }

    guestChanges.waiting.removed.forEach((user: User) => {
      sendNotification(
        'You have been removed from a pending event',
        `${body.title}, ${new Date(body.start).toLocaleDateString()}`,
        user.id,
        'event-removed',
        id
      )
    })

    guestChanges.waiting.added.forEach((user: User) => {
      sendNotification(
        'Event invitation',
        `You have been invited to a new event: ${body.title}, ${new Date(body.start).toLocaleDateString()}`,
        user.id,
        'event-invited',
        id
      )
    })

    guestChanges.accepted.removed.forEach((user: User) => {
      sendNotification(
        'You have been removed from an event',
        `${body.title}, ${new Date(body.start).toLocaleDateString()}`,
        user.id,
        'event-removed',
        id
      )
    })

    setResponseStatus(event, 200)
    return {
      message: 'Event updated successfully',
      eventId: id
    }
  } catch (err) {
    console.error('Error updating event:', err)
    setResponseStatus(event, 500)
    return {
      code: 'INTERNAL_SERVER_ERROR',
      error: err instanceof Error ? err.message : 'An unknown error occurred'
    }
  }
})
