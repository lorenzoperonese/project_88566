import { Event, Resource, User } from '@/server/db'
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

    const body = await readBody<InputEvent>(event)
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
      (newId) =>
        !currentEvent.guests.accepted.some(
          (currentId) => currentId.toString() === newId.toString()
        )
    )

    if (invalidNewAcceptedGuests.length > 0) {
      setResponseStatus(event, 400)
      return {
        code: 'INVALID_GUESTS',
        error: 'Accepted guests must be a subset of the current accepted guests'
      }
    }

    const guests_ids_wait: Types.ObjectId[] = []
    const guests_ids_acc: Types.ObjectId[] = []

    for (const g in body.guests.waiting) {
      const u = await User.findOne({ username: body.guests.waiting[g] })
      if (!u) {
        throw createError({
          statusCode: 404,
          message: `User ${body.guests.waiting[g]} not found`
        })
      }

      guests_ids_wait.push(u.id)
    }

    for (const g in body.guests.accepted) {
      const u = await User.findOne({ username: body.guests.accepted[g] })
      if (!u) {
        throw createError({
          statusCode: 404,
          message: `User ${body.guests.accepted[g]} not found`
        })
      }

      guests_ids_acc.push(u.id)
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
          guests: {
            waiting: guests_ids_wait,
            accepted: guests_ids_acc
          }
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
          (x) => !body.guests.waiting.some((y) => y.toString() === x.toString())
        ),
        added: guests_ids_wait.filter(
          (x) =>
            !currentEvent.guests.waiting.some(
              (y) => y.toString() === x.toString()
            )
        )
      },
      accepted: {
        removed: currentEvent.guests.accepted.filter(
          (x) =>
            !body.guests.accepted.some((y) => y.toString() === x.toString())
        )
      }
    }

    guestChanges.waiting.removed.forEach((guestId) => {
      sendNotification(
        'You have been removed from a pending event',
        `${body.title}, ${new Date(body.start).toLocaleDateString()}`,
        guestId.toString(),
        'event-removed',
        id
      )
    })

    guestChanges.waiting.added.forEach((guestId) => {
      sendNotification(
        'Event invitation',
        `You have been invited to a new event: ${body.title}, ${new Date(body.start).toLocaleDateString()}`,
        guestId.toString(),
        'event-invited',
        id
      )
    })

    guestChanges.accepted.removed.forEach((guestId) => {
      sendNotification(
        'You have been removed from an event',
        `${body.title}, ${new Date(body.start).toLocaleDateString()}`,
        guestId.toString(),
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
