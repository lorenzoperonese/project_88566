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

async function notify(title, body) {
  //const response = await fetch('api/session')
  //console.log(response)
  //if (!response.ok) {
  //  return
  //}
  //
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
    console.log('Push received')
    console.log(event)
    console.log(event.data.json())
    if (event.data) {
      const data = event.data.json()

      notify(data.title, data.body)
    } else {
      console.log('Push event but no data')
    }
  })
}

main()
