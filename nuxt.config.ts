// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint'
  ],
  runtimeConfig: {
    DB_URL: process.env.MONGO_URL
  },
  typescript: {
    typeCheck: true
  }
})
