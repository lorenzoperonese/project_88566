// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxt/eslint',
    '@sidebase/nuxt-auth',
    '@nuxtjs/mdc',
    '@vite-pwa/nuxt',
    '@vueuse/nuxt'
  ],
  runtimeConfig: {
    DB_URL: process.env.MONGO_URL,
    PUSH_KEY: process.env.PUSH_KEY,
    PUSH_PUBLIC_KEY: process.env.PUSH_PUBLIC_KEY,

    public: {
      pushPublicKey: process.env.PUSH_PUBLIC_KEY
    }
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
          admin: 'boolean',
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
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tagName) => {
        return tagName === 'vue-advanced-chat' || tagName === 'emoji-picker'
      }
    }
  },
  nitro: {
    experimental: {
      websocket: true
    },
    alias: {
      '#imports': './server/utils'
    }
  },
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]
    }
  },
  pwa: {
    manifest: {
      name: 'Selfie',
      short_name: 'Selfie',
      description:
        'Calendar, Notes, Chat and more just in one app for students',
      theme_color: '#4DBA87',
      icons: [
        {
          src: './favicon.png',
          sizes: '100x100',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/'
    },
    devOptions: {
      enabled: true,
      type: 'module'
    }
  }
})
