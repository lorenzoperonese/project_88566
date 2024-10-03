export default defineEventHandler(async (_): Promise<number> => {
  let delta = await useStorage().getItem<number>(`tm:delta`)

  if (delta === null) {
    console.error('tm:delta is NULL')
    delta = 0
  }

  return Date.now() + delta
})
