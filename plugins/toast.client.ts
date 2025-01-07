import * as vt from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const options: vt.PluginOptions = {
  timeout: 3000,
  position: vt.POSITION.TOP_RIGHT,
  maxToasts: 5,
  showCloseButtonOnHover: true,
  closeOnClick: true,
  pauseOnHover: false,
  hideProgressBar: true,
  transition: 'Vue-Toastification__fade',
  filterBeforeCreate: (toast, toasts) => {
    if (toasts.filter((t) => t.type === toast.type).length !== 0) {
      // Returning false discards the toast
      return false
    }
    // You can modify the toast if you want
    return toast
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vt.default, options)

  return {
    provide: {
      toast: vt.useToast()
    }
  }
})
