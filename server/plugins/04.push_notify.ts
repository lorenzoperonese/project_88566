import webpush from 'web-push'
import { User, PushNotification } from '@/server/db'
//import { Event } from '@/server/db'
//import type { IEvent } from '../db/event'

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()

  console.log('Keys: ', config.PUSH_PUBLIC_KEY, config.PUSH_KEY)

  webpush.setVapidDetails(
    `https:http://localhost:3000/contacts`,
    config.PUSH_PUBLIC_KEY as string,
    config.PUSH_KEY as string
  )

  //console.log('Starting interval')
  //setInterval(sendNotifications, 30 * 1000)
  //setInterval(tmpSend, 10 * 1000)
})

async function tmpSend() {
  let users = await User.find()

  for (let u of users) {
    const options = await PushNotification.findOne({ user_id: u._id })
    if (!options) {
      continue
    }

    webpush.sendNotification(
      options.subscription,
      JSON.stringify({
        title: 'Titolone',
        body: 'body incredibile'
      })
    )
  }
}

//async function getAllEvents(today: number): Promise<IEvent[]> {
//  return Event.find({
//    start: { $gte: today }
//  })
//}
//
//async function sendNotifications() {
//  let delta = await useStorage().getItem<number>(`tm:delta`)
//  if (delta === null) {
//    delta = 0
//  }
//
//  const now = Date.now() + delta
//
//  const events = await getAllEvents(now)
//
//  for (let i = 0; i < events.length; i++) {
//    if (await needToNotify(events[i] as EventType, now)) {
//      console.log('Should notify: ', events[i].title)
//
//      const options = await useStorage().getItem<webpush.PushSubscription>(
//        `notify:${events[i].user_id.toString()}`
//      )
//      if (options === null) {
//        console.error("Can't get push options for user_id: ", events[i].user_id)
//        continue
//      }
//      webpush.sendNotification(
//        options,
//        JSON.stringify({
//          title: events[i].title,
//          body: events[i].note
//        })
//      )
//    }
//  }
//}
//
//async function needToNotify(event: EventType, now: number): Promise<boolean> {
//  if (event.notify === null) return false
//
//  if (event.notify.length === 0) return false
//
//  const today = new Date(now)
//
//  for (let i = 0; i < event.notify.length; i++) {
//    const nd = new Date(event.notify[i].hour)
//    const hour = nd.getHours()
//    const minutes = nd.getMinutes()
//
//    let tmp = new Date(event.start)
//    tmp.setHours(hour)
//    tmp.setMinutes(minutes)
//
//    switch (event.notify[i].period) {
//      case 1: {
//        tmp.setDate(tmp.getDate() - event.notify[i].advance)
//        break
//      }
//      case 2: {
//        tmp.setDate(tmp.getDate() - 7 * event.notify[i].advance)
//        break
//      }
//      case 3: {
//        tmp.setMonth(tmp.getMonth() - event.notify[i].advance)
//        break
//      }
//      case 4: {
//        tmp.setFullYear(tmp.getFullYear() - event.notify[i].advance)
//        break
//      }
//    }
//
//    const DELTA = 15 * 1000
//    if (Math.abs(tmp.getTime() - today.getTime()) < DELTA) {
//      // Only one notification should match, so there is no need to keep going
//      // with the array
//
//      //events[eventIndex].notify.splice(i, 1)
//      return true
//    }
//  }
//
//  return false
//}
