// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    languageOptions: {
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false, // Disables the warning
        ecmaVersion: 'latest',
        selfClosing: false
      }
    },
    rules: {
      // This line is to avoid errors when using @ts-nocheck. TODO Remove it in
      // the end
      //"@typescript-eslint/ban-ts-comment": "off"

      'vue/html-self-closing': 'off'
    }
  }
)
