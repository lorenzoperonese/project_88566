const WORKER_URL = '/worker.js'

const check = () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('No Service Worker support!')
  }

  if (!('PushManager' in window)) {
    throw new Error('No Push API Support!')
  }
}

async function registerServiceWorker() {
  // Check for an existing service worker
  const existingRegistration =
    await navigator.serviceWorker.getRegistration(WORKER_URL)
  if (existingRegistration) {
    await existingRegistration.unregister()
  }

  const swRegistration = await navigator.serviceWorker.register(WORKER_URL)
  return swRegistration
}

export async function startServiceWorker() {
  let SW: ServiceWorkerRegistration

  check()

  SW = await registerServiceWorker()
  await SW.update()
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
