// Wrapper on localStorage to store to avoid confusion between users

export async function storageSetItem(key: string, value: any) {
  const me = await getME()
  localStorage.setItem(`${me.id}-${key}`, JSON.stringify(value))
}

export async function storageGetItem(key: string) {
  const me = await getME()
  return localStorage.getItem(`${me.id}-${key}`)
}

export async function storageRemoveItem(key: string) {
  const me = await getME()
  localStorage.removeItem(`${me.id}-${key}`)
}
