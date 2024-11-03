import * as vt from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const options: vt.PluginOptions = {
  timeout: 5000,
  position: vt.POSITION.TOP_RIGHT,
  maxToasts: 5,
  showCloseButtonOnHover: true
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vt.default, options)

  return {
    provide: {
      toast: vt.useToast()
    }
  }
})
