// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    languageOptions: {
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false // Disables the warning
      }
    }
  }
)
