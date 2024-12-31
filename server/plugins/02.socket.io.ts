import type { NitroApp } from 'nitropack/types'
import { Server as Engine } from 'engine.io'
import { Server } from 'socket.io'
import { defineEventHandler } from 'h3'

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine()
  const io = new Server()

  io.bind(engine)

  io.on('connection', async (socket) => {
    let [isAuth, user_id] = await isAuthenticated(socket.handshake.auth.token)
    if (isAuth) {
      socket.join(user_id)
    }

    socket.on('error', (err) => {
      if (err && err.message === 'unauthorized event') {
        socket.disconnect()
      }
    })

    socket.on('message', (message) => {
      console.log('Message:', message)
    })

    socket.on('auth', async (token) => {
      let [isAuth, user_id] = await isAuthenticated(token)
      if (isAuth) {
        socket.join(user_id)
      }
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
            // @ts-expect-error private method and property
            peer._internal.nodeReq,
            // @ts-expect-error private method and property
            peer._internal.nodeReq.socket,
            peer.websocket
          )
        }
      }
    })
  )
})

// Return if the user is authenticated or not. Also return the user_id.
async function isAuthenticated(s: string): Promise<[boolean, string]> {
  let token = s.split(' ')[1]
  console.log('Token:', token)

  const session = await getAuthSession(token)
  if (!session || isAuthSessionExpired(session)) {
    return [false, '']
  }

  return [true, session.user_id]
}
