export default defineEventHandler(() => {
  useStorage().setItem<number>(`tm:delta`, 0)
})
