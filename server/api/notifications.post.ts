import { Notification, User } from '@/server/db'
import type { JSONResponse } from '~/types'

export default defineEventHandler(async (event): Promise<JSONResponse> => {
  const body = await readBody<{
    title: string
    body: string
    receiver: string
    type: string
    identifier?: string
  }>(event)

  if (!body.title) {
    setResponseStatus(event, 400)
    return {
      status: 'error',
      err: 'Body malformed: title is required.'
    }
  }

  if (!body.body) {
    setResponseStatus(event, 400)
    return {
      status: 'error',
      err: 'Body malformed: body is required.'
    }
  }

  if (!body.receiver) {
    setResponseStatus(event, 400)
    return {
      status: 'error',
      err: 'Body malformed: receiver is required.'
    }
  }

  if (!body.type) {
    body.type = 'basic'
  }

  try {
    const receiver_id = await User.findOne({ username: body.receiver }).select(
      '_id'
    )

    if (!receiver_id) {
      setResponseStatus(event, 400)
      return { status: 'error', err: 'Receiver not found' }
    }

    const notification = new Notification({
      id: '',
      title: body.title,
      body: body.body,
      read: false,
      type: body.type,
      identifier: body.identifier,
      user_id: receiver_id
    })

    await notification.save()
    return { message: 'Notification created successfuly', status: 'success' }
  } catch (error) {
    console.error(error)
    setResponseStatus(event, 500)
    return { err: 'Cannot save notification', status: 'error' }
  }
})
