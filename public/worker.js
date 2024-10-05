let events = []

async function fetchEvents() {
  const res = await fetch('/api/events')
  return await res.json()
}

// This functions runs in a loop and check if notifications should be sent
async function notificator() {
  while (true) {
    for (let i = 0; i < events.length; i++) {
      console.log('Checking notification for event: ', events[i])
    }

    await new Promise((r) => setTimeout(r, 30 * 1000))
  }
}

async function main() {
  console.log('Hello from worker :)')

  events = await fetchEvents()
  notificator()

  self.addEventListener('message', (m) => {
    console.log('Received:', m.data)
  })
}

main()
