import type { NitroApp } from 'nitropack/types'
import { Server as Engine } from 'engine.io'
import { Server } from 'socket.io'
import { defineEventHandler } from 'h3'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine()
  const io = new Server()

  io.bind(engine)

  io.on('connection', (socket) => {
    socket.use(([event, ...args], next) => {
      if (isUnauthorized(event, args)) {
        return next(new Error('Unauthorized'))
      }
      next()
    })

    socket.on('error', (err) => {
      if (err && err.message === 'unauthorized event') {
        socket.disconnect()
      }
    })

    socket.on('message', (message) => {
      console.log('Message:', message)
    })
  })

  nitroApp.router.use(
    '/socket.io/',
    defineEventHandler({
      handler(event) {
        // @ts-expect-error private method and property
        engine.handleRequest(event.node.req, event.node.res)
        event._handled = true
      },
      websocket: {
        open(peer) {
          // @ts-expect-error private method and property
          engine.prepare(peer._internal.nodeReq)
          // @ts-expect-error private method and property
          engine.onWebSocket(
            peer._internal.nodeReq,
            peer._internal.nodeReq.socket,
            peer.websocket
          )
        }
      }
    })
  )
})

// Non funziona...
function isUnauthorized(event: any, args: any[]) {
  console.log('event:', event, 'args:', args)
  return true
}
