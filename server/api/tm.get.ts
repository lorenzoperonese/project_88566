export default defineEventHandler(async (_): Promise<number> => {
  let delta = await useStorage().getItem<number>(`tm:delta`)

  console.log('delta:', delta)

  if (!delta) {
    console.error('tm:delta is NULL')
    delta = 0
  }

  return Date.now() + delta
})
