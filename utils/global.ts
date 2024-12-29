export async function getME(): Promise<User> {
  const tmp = (await $fetch('/api/session')) as any
  return tmp
}

export function isAdmin(u: User): boolean {
  return u.admin || false
}
