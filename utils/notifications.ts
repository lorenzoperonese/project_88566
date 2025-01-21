import type { JSONResponse } from '~/types'

// Send a notification to a user. Receiver is the username of the user.
export async function sendNotificationFront(
  title: string,
  body: string,
  receiver: string,
  type: string,
  indentifier: string | undefined
): Promise<JSONResponse> {
  try {
    const res = await $fetch('/api/notifications', {
      method: 'POST',
      body: JSON.stringify({
        title: title,
        body: body,
        receiver: receiver,
        type: type,
        identifier: indentifier
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

// Utils for push notifications

export async function registerPush() {
  const { $registerPushNotifications } = useNuxtApp()
  try {
    await $registerPushNotifications()
  } catch (err) {
    console.error('Failed:', err)
  }
}

export async function requestNotificationPermission() {
  const permission = await window.Notification.requestPermission()
  // value of permission can be 'granted', 'default', 'denied'
  // granted: user has accepted the request
  // default: user has dismissed the notification permission popup by clicking on x
  // denied: user has denied the request.
  if (permission !== 'granted') {
    throw new Error('Permission not granted for Notification')
  }
  return permission
}
