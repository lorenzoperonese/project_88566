export default defineEventHandler(async (event) => {
  try {
    const p = {
      title: 'Remote notification test',
      body: 'This is a test notification',
      users: [event.context.auth.id],
      event_id: ''
    } as PushNotification

    sendPushNotification(p)
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 500)
    return { err }
  }
})
