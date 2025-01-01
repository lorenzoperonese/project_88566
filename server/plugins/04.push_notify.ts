import webpush from 'web-push'
import { Notificator } from '@/server/utils/background'
import { Event, type IEvent } from '@/server/db'

let globalNotificator: Notificator | null = null

export function getNotificator(): Notificator {
  if (!globalNotificator) {
    throw new Error('Global notificator not initialized')
  }

  return globalNotificator
}

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()

  console.log('Keys: ', config.PUSH_PUBLIC_KEY, config.PUSH_KEY)

  webpush.setVapidDetails(
    `https:http://localhost:3000/contacts`,
    config.PUSH_PUBLIC_KEY as string,
    config.PUSH_KEY as string
  )

  globalNotificator = new Notificator()
  notificatorManager()
})

async function notificatorManager() {
  console.log('Notificator manager started')

  // This is a global istance of the Notificator class.
  let notificator = getNotificator()

  const loop = async () => {
    await notificatorWorker(notificator)
    setTimeout(loop, 10 * 1000)
  }

  await loop()
}

async function notificatorWorker(notificator: Notificator) {
  console.log('Notificator worker')
  const today = await getNowTime()
  const events = await getAllEvents(today)
  console.log('Events:', events)
  const ns = notificator.processEvents(events, today)
  console.log('NS: ', ns)

  for (const n of ns) {
    await sendPushNotification(n)
  }
}

async function getAllEvents(today: number): Promise<IEvent[]> {
  return await Event.find({
    $or: [
      { start: { $gt: today } },
      { repetition: { $exists: true, $ne: null } }
    ]
  })
}
