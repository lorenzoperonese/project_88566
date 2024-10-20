import webpush from 'web-push'

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()

  webpush.setVapidDetails(
    'https:https://updates.push.services.mozilla.com/wpush/v1/gAAAAABnFNykMowxUrw0xVK3EnI4_NPXEt9TWaT7K4HZPyXgxhyK1dVaP8HOc79V3Z_AX_rYAEW11CPpHMj5YN1NS5v5ELYBsiqA0YM8P_VSEoFqlAQgJe7_RjzHtEeUppz8wt-ra5_S',
    config.PUSH_PUBLIC_KEY as string,
    config.PUSH_KEY as string
  )
})
