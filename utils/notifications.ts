import type { JSONResponse } from '~/types'

// Send a notification to a user. Receiver is the username of the user.
export async function sendNotification(
  title: string,
  body: string,
  receiver: string
): Promise<JSONResponse> {
  try {
    const res = await $fetch('/api/notifications', {
      method: 'POST',
      body: JSON.stringify({
        title: title,
        body: body,
        receiver: receiver
      })
    })

    if (res.status === 'error') {
      throw new Error(res.err)
    }
    return { status: 'success' }
  } catch (error) {
    console.error(error)
    return { err: 'Error sending notification', status: 'error' }
  }
}

export async function setNotificationAsRead(id: string): Promise<JSONResponse> {
  try {
    const res = (await $fetch(`/api/notifications/${id}`, {
      method: 'POST'
    })) as any // JSONResponse generate a Excessive stack depth error

    if (res.status === 'error') {
      throw new Error(res.err)
    }
    return { status: 'success' }
  } catch (error) {
    console.error(error)
    return { err: 'Error reading notifications', status: 'error' }
  }
}
