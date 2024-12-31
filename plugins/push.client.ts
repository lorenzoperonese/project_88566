function urlB64ToUint8Array(base64String: string): Uint8Array {
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

export default defineNuxtPlugin(async () => {
  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      const registration = await navigator.serviceWorker.register('/worker.js')
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
      })

      // Invia la subscription al backend
      await fetch('/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
      })

      return subscription
    }
  }

  return {
    provide: {
      registerPushNotifications: registerServiceWorker
    }
  }
})
