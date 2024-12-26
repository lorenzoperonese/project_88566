export async function getNowTime(): Promise<number> {
  let delta = (await useStorage().getItem(`tm:delta`)) as number | null

  if (delta === null) {
    console.error('tm:delta is NULL')
    delta = 0
  }

  return Date.now() + delta
}
