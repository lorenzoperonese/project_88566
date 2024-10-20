import webpush from 'web-push'

export default defineEventHandler(async (event) => {
  const options = await useStorage().getItem<PushSubscription>(
    `notify:${event.context.auth.id}`
  )
  if (options) {
    webpush.sendNotification(options as any, 'Hola')
  } else {
    const err = 'Options for notify are empty'
    console.error(err)
    setResponseStatus(event, 500)
    return { err }
  }
})
