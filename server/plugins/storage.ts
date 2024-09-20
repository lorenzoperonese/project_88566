import mongoose from 'mongoose'

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()

  try {
    console.log('Connecting to mongo. DB_URL:', config.DB_URL)
    await mongoose.connect(config.DB_URL)
    console.log('DB connection established')
  } catch (err) {
    console.error("Can't connect to DB", err)
    process.exit(1)
  }
})
