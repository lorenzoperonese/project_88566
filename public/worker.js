async function fetchEvents() {
  const res = await fetch('/api/events')
  return await res.json()
}

async function main() {
  console.log('Hello from worker :)')

  const events = await fetchEvents()
  console.log(events)
}

main()
