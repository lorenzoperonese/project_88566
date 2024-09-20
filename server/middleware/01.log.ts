export default defineEventHandler((event) => {
  const method = event.node.req.method
  const path = event.node.req.url
  const d = new Date().toLocaleTimeString()
  console.log(`[${d}] ${method} ${path}`)
})
