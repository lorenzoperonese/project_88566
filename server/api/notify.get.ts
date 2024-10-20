import webpush from 'web-push'

export default defineEventHandler(async (event) => {
  const options = await useStorage().getItem<webpush.PushSubscription>(
    `notify:${event.context.auth.id}`
  )
  console.log(options)
  if (options) {
    webpush.sendNotification(options, 'Hola')
  } else {
    const err = 'Options for notify are empty'
    console.error(err)
    setResponseStatus(event, 500)
    return { err }
  }
})
