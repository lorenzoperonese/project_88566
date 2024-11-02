import { Peer, Message } from 'crossws'

export default defineWebSocketHandler({
  open: (peer: Peer) => {
    peer.send(
      JSON.stringify({
        type: 'welcome',
        message: 'Welcome to the MY CALENDAR!'
      })
    )
  },

  message: (peer: Peer, message: Message) => {
    const data = JSON.parse(message.toString())

    console.log('WS MESSAGE: ', data)
  },

  close: (peer: Peer) => {},

  error: (peer: Peer, error: Error) => {
    console.error('WS ERROR: ', error)
  }
})
