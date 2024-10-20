import webpush from 'web-push'

export default defineEventHandler(async (event) => {
  const body = await readBody<webpush.PushSubscription>(event)
  //console.log('Notify body: ', body)
  //console.log(event.context.auth.id)

  // This should be saved on the persistend db (mongo). TODO CHANGE
  try {
    await useStorage().setItem<webpush.PushSubscription>(
      `notify:${event.context.auth.id}`,
      body
    )
    return { msg: 'Notification subscription added' }
  } catch (err) {
    console.error(err)
    setResponseStatus(event, 500)
    return { err }
  }
})
