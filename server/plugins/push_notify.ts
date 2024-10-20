import webpush from 'web-push'

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()

  webpush.setVapidDetails(
    `https:https://mysite.local/contacs`,
    config.PUSH_PUBLIC_KEY as string,
    config.PUSH_KEY as string
  )
})
