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
