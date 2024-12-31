export default defineEventHandler(async (event) => {
  try {
    sendPushNotification(event.context.auth.id)
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 500)
    return { err }
  }
})
