import { io, Socket } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8000'

class SocketService {
  private socket: Socket | null = null

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        autoConnect: true,
      })

      this.socket.on('connect', () => {
        console.log('✅ WebSocket connecté')
      })

      this.socket.on('disconnect', () => {
        console.log('❌ WebSocket déconnecté')
      })

      this.socket.on('connect_error', (error) => {
        console.error('Erreur de connexion:', error)
      })
    }

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  getSocket(): Socket | null {
    return this.socket
  }

  joinRoom(gameId: string, playerId: string) {
    if (this.socket) {
      this.socket.emit('join_room', { game_id: gameId, player_id: playerId })
    }
  }

  leaveRoom(gameId: string) {
    if (this.socket) {
      this.socket.emit('leave_room', { game_id: gameId })
    }
  }

  sendMessage(gameId: string, playerName: string, message: string) {
    if (this.socket) {
      this.socket.emit('send_message', {
        game_id: gameId,
        player_name: playerName,
        message,
      })
    }
  }
}

export const socketService = new SocketService()
