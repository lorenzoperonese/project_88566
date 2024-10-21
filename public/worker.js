const urlB64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const applicationServerKey = urlB64ToUint8Array(
  'BJ50dYyaHqkf3WY_z3ivPl94JzHT32bF4gkpTNUhisQVhjrTEx0-Dpa78fMje7PMwyKnLeZ5nHulhMRkPUTopmQ'
)

let events = []

async function fetchEvents() {
  const res = await fetch('/api/events')
  return await res.json()
}

// This functions runs in a loop and check if notifications should be sent
async function notificator() {
  for (let i = 0; i < events.length; i++) {
    //notify("Event", 'Checking notification for event: ' + i)
    //console.log('Checking notification for event: ', events[i])

    if (await needToNotify(i)) {
      notify(
        `${events[i].title}`,
        `Start: ${new Date(events[i].start)}\nNote: ${events[i].note}`
      )
    }
  }
}

const DELTA = 90 * 1000

async function needToNotify(eventIndex) {
  let event = events[eventIndex]
  if (event.notify === null && event.notify.length === 0) return false

  const tm = await fetch('/api/tm')
  if (!tm.ok) return false

  const today = new Date(await tm.json())

  for (let i = 0; i < event.notify.length; i++) {
    const nd = new Date(event.notify[i].hour)
    const hour = nd.getHours()
    const minutes = nd.getMinutes()

    let tmp = new Date(event.start)
    tmp.setHours(hour)
    tmp.setMinutes(minutes)

    switch (event.notify[i].period) {
      // Day
      case 1: {
        tmp.setDate(tmp.getDate() - event.notify[i].advance)
        break
      }
      // Week
      case 2: {
        tmp.setDate(tmp.getDate() - 7 * event.notify[i].advance)
        break
      }
      // Month
      case 3: {
        tmp.setMonth(tmp.getMonth() - event.notify[i].advance)
        break
      }
      // Year
      case 4: {
        tmp.setFullYear(tmp.getFullYear() - event.notify[i].advance)
        break
      }
    }

    //notify("DBG", `tmp: ${tmp}, today: ${today}`)

    if (Math.abs(tmp.getTime() - today.getTime()) < DELTA) {
      // Only one notification should match, so there is no need to keep going
      // with the array
      //notify("DBG", `HERE`)
      events[eventIndex].notify.splice(i, 1)
      return true
    }
  }

  return false
}

function notify(title, body) {
  self.registration.showNotification(title, { body: body })
}

async function saveSubscription(subscription) {
  // TODO: Modify when deploy
  const SERVER_URL = 'http://localhost:3000/api/notify'
  const response = await fetch(SERVER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(subscription)
  })

  return response.json()
}

let ACTIVE = false

async function activate() {
  try {
    const options = {
      applicationServerKey,
      userVisibleOnly: true
    }
    const subscription = await self.registration.pushManager.subscribe(options)
    const response = await saveSubscription(subscription)
    if (!response.ok) {
      throw response
    }
    console.log(response)
    ACTIVE = true
  } catch (err) {
    console.error('Service worker: ', err)
    ACTIVE = false
  }
}

async function main() {
  self.addEventListener('message', (event) => {
    console.log(event)
    if (!event.data) {
      console.error('No data provided to event')
      return
    }
    console.log(event.data)

    if (event.data.type === 'authenticated') {
      console.log('User authenticated')
      if (!ACTIVE) {
        activate()
      }
    }
  })

  self.addEventListener('activate', async () => {
    activate()
  })

  self.addEventListener('push', (event) => {
    if (event.data) {
      notify('Push', event.data.text())
    } else {
      console.log('Push event but no data')
    }
  })
}

main()
