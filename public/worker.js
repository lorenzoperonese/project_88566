self.addEventListener('push', (event) => {
  const data = event.data.json()

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      data: {
        url: data.url,
        id: data.id
      }
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  const notificationData = event.notification.data

  event.notification.close()

  event.waitUntil(
    // Send a POST request to acknowledge the notification
    fetch('/api/ack-notification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: notificationData.id })
    })
      .then(() => {
        // Open the notification's URL after acknowledging
        if (notificationData.url) {
          //return clients.openWindow(notificationData.url);
        }
      })
      .catch((error) => {
        console.error('Failed to send acknowledgment:', error)
      })
  )
})
