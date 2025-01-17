const WORKER_URL = '/worker.js'

const check = () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('No Service Worker support!')
  }
  console.log('Service worker supported')

  if (!('PushManager' in window)) {
    throw new Error('No Push API Support!')
  }
  console.log('Push notifications supported')
}

async function registerServiceWorker() {
  console.log('Registering service worker')

  // Check for an existing service worker
  const existingRegistration =
    await navigator.serviceWorker.getRegistration(WORKER_URL)
  if (existingRegistration) {
    console.log('Unregistering existing service worker:', existingRegistration)
    await existingRegistration.unregister()
  }

  const swRegistration = await navigator.serviceWorker.register(WORKER_URL)
  return swRegistration
}

export async function startServiceWorker() {
  console.log('Hi from the plugin')

  let SW: ServiceWorkerRegistration

  check()

  SW = await registerServiceWorker()
  await SW.update()

  if (SW.installing) {
    console.log('SW installing')
  } else if (SW.waiting) {
    console.log('SW waiting')
  } else if (SW.active) {
    console.log('SW active')
  }
}

export async function postMessageToWoker(msg: object) {
  const SW = await navigator.serviceWorker.getRegistration()

  if (SW === undefined) {
    throw Error('Service worker is undefined')
  }

  if (SW.active === null) {
    throw Error('Service worker is NOT active')
  }

  SW.active.postMessage(msg)
}
