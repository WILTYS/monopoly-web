import { create } from 'zustand'
import { Game, Player } from './types'

interface GameStore {
  game: Game | null
  playerId: string | null
  isConnected: boolean
  
  setGame: (game: Game) => void
  setPlayerId: (id: string) => void
  setConnected: (connected: boolean) => void
  updatePlayer: (playerId: string, updates: Partial<Player>) => void
  reset: () => void
}

export const useGameStore = create<GameStore>((set) => ({
  game: null,
  playerId: null,
  isConnected: false,

  setGame: (game) => set({ game }),
  
  setPlayerId: (id) => set({ playerId: id }),
  
  setConnected: (connected) => set({ isConnected: connected }),
  
  updatePlayer: (playerId, updates) =>
    set((state) => {
      if (!state.game) return state
      
      const players = state.game.players.map((p) =>
        p.id === playerId ? { ...p, ...updates } : p
      )
      
      return {
        game: {
          ...state.game,
          players,
        },
      }
    }),
  
  reset: () => set({ game: null, playerId: null, isConnected: false }),
}))
