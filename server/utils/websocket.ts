import { Peer } from 'crossws'

interface ChatPeer extends Peer {
  userId?: string
  rooms?: Set<string>
}

//interface ChatMessage {
//  type: string;
//  room?: string;
//  message?: string;
//  token?: string;
//}

// Store connected peers and room subscriptions
const connectedPeers: Map<string, ChatPeer> = new Map()
const roomSubscriptions: Map<string, Set<ChatPeer>> = new Map()

// Utility functions
const addPeerToRoom = (peer: ChatPeer, roomId: string) => {
  if (!roomSubscriptions.has(roomId)) {
    roomSubscriptions.set(roomId, new Set())
  }
  roomSubscriptions.get(roomId)?.add(peer)
  peer.rooms?.add(roomId)
}

const removePeerFromRoom = (peer: ChatPeer, roomId: string) => {
  roomSubscriptions.get(roomId)?.delete(peer)
  peer.rooms?.delete(roomId)
}

const broadcastToRoom = (
  roomId: string,
  message: any,
  excludePeer?: ChatPeer
) => {
  roomSubscriptions.get(roomId)?.forEach((peer) => {
    if (peer !== excludePeer) {
      peer.send(JSON.stringify(message))
    }
  })
}
