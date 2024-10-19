let events = []

async function fetchEvents() {
  const res = await fetch('/api/events')
  return await res.json()
}

// This functions runs in a loop and check if notifications should be sent
async function notificator() {
  while (true) {
    for (let i = 0; i < events.length; i++) {
      //notify("Event", 'Checking notification for event: ' + i)
      //console.log('Checking notification for event: ', events[i])

      if (await needToNotify(events[i])) {
        notify('Event', `Id: ${events[i].id}, title: ${events[i].title}`)
      }
    }

    await new Promise((r) => setTimeout(r, 15 * 1000))
  }
}

const DELTA = 90 * 1000

async function needToNotify(event) {
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
      return true
    }
  }

  return false
}

function notify(title, body) {
  self.registration.showNotification(title, { body: body })
}

async function main() {
  //console.log('Hello from worker :)')

  events = await fetchEvents()
  notificator()

  self.addEventListener('message', (m) => {
    notify('Test notification', m.data)
  })
}

main()
