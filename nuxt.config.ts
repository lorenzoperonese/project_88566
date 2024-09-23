// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@sidebase/nuxt-auth', '@nuxtjs/mdc'],
  runtimeConfig: {
    DB_URL: process.env.MONGO_URL
  },
  typescript: {
    typeCheck: true
  },
  auth: {
    baseURL: '/api/auth',
    globalAppMiddleware: true,
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/login', method: 'post' },
        signOut: { path: '/logout', method: 'post' },
        signUp: false,
        getSession: { path: '/session', method: 'get' }
      },
      session: {
        dataType: {
          id: 'number',
          username: 'string',
          expiration: 'date'
        }
      },
      pages: {
        login: '/login'
      },
      token: {
        sameSite: 'strict',
        secureCookieAttribute: false,
        httpOnlyCookieAttribute: true,
        maxAgeInSeconds: 3600
      }
    }
  },
  // Need to disable SSR to avoid cookies elimination from auth :(
  // https://github.com/sidebase/nuxt-auth/issues/732
  ssr: false,
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  }
})
