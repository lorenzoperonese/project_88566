export async function getME(): Promise<User> {
  const tmp = (await $fetch('/api/session')) as any
  return tmp
}

export function isAdmin(u: User): boolean {
  return u.admin || false
}

export async function setThemeFromBackend(): Promise<string> {
  return await fetch('/api/session')
    .then((response) => {
      if (!response.ok) {
        throw new Error('During profile fetch: ' + response.statusText)
      }
      return response.json()
    })
    .then((data) => {
      if (data) {
        document.documentElement.setAttribute('data-theme', data.theme)
      }
      return data.theme as string
    })
    .catch((e) => {
      console.error(e)
      return 'dark'
    })
}
