export async function getToday(): Promise<Date> {
  const res = await $fetch('/api/tm')
  return new Date(res)
}
