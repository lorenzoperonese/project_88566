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

  const swRegistration = await navigator.serviceWorker.register(WORKER_URL)
  return swRegistration
}

export default defineNuxtPlugin(async (/* nuxtApp */ _) => {
  console.log('Hi from the plugin')

  let SW: ServiceWorkerRegistration

  try {
    check()

    SW = await registerServiceWorker()
    SW.update()

    if (SW.installing) {
      console.log('SW installing')
    } else if (SW.waiting) {
      console.log('SW waiting')
    } else if (SW.active) {
      console.log('SW active')
    }
  } catch (e) {
    console.error(e)
  }
})
