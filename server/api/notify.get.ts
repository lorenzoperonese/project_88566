import webpush from 'web-push'

export default defineEventHandler(async (event) => {
  const options = await useStorage().getItem<webpush.PushSubscription>(
    `notify:${event.context.auth.id}`
  )
  console.log(options)
  if (options) {
    const resp = webpush.sendNotification(
      options,
      JSON.stringify({
        title: 'Test notification',
        body: 'This is a test from the backend'
      })
    )

    console.log(await resp)
  } else {
    const err = 'Options for notify are empty'
    console.error(err)
    setResponseStatus(event, 500)
    return { err }
  }
})
