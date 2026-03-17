/**
 * Polling service pour remplacer WebSocket
 * Interroge l'API toutes les 2 secondes pour obtenir l'état du jeu
 */

import { Game } from './types'

class PollingService {
  private intervals: Map<string, NodeJS.Timeout> = new Map()
  private callbacks: Map<string, (game: Game) => void> = new Map()

  startPolling(gameId: string, callback: (game: Game) => void, intervalMs: number = 2000) {
    // Arrêter le polling existant si présent
    this.stopPolling(gameId)

    // Stocker le callback
    this.callbacks.set(gameId, callback)

    // Démarrer le polling
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games/${gameId}`)
        if (response.ok) {
          const data = await response.json()
          callback(data.game)
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }, intervalMs)

    this.intervals.set(gameId, interval)
  }

  stopPolling(gameId: string) {
    const interval = this.intervals.get(gameId)
    if (interval) {
      clearInterval(interval)
      this.intervals.delete(gameId)
      this.callbacks.delete(gameId)
    }
  }

  stopAll() {
    this.intervals.forEach((interval) => clearInterval(interval))
    this.intervals.clear()
    this.callbacks.clear()
  }
}

export const pollingService = new PollingService()
