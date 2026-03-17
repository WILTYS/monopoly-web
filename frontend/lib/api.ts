import { Game } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = {
  async createGame(hostName: string, maxPlayers: number = 6) {
    const response = await fetch(`${API_URL}/games/create?host_name=${hostName}&max_players=${maxPlayers}`, {
      method: 'POST',
    })
    if (!response.ok) throw new Error('Failed to create game')
    return response.json()
  },

  async joinGame(gameId: string, playerName: string) {
    const response = await fetch(`${API_URL}/games/${gameId}/join?player_name=${playerName}`, {
      method: 'POST',
    })
    if (!response.ok) throw new Error('Failed to join game')
    return response.json()
  },

  async getGame(gameId: string): Promise<Game> {
    const response = await fetch(`${API_URL}/games/${gameId}`)
    if (!response.ok) throw new Error('Failed to get game')
    return response.json()
  },

  async startGame(gameId: string, playerId: string) {
    const response = await fetch(`${API_URL}/games/${gameId}/start?player_id=${playerId}`, {
      method: 'POST',
    })
    if (!response.ok) throw new Error('Failed to start game')
    return response.json()
  },

  async rollDice(gameId: string, playerId: string) {
    const response = await fetch(`${API_URL}/games/${gameId}/roll?player_id=${playerId}`, {
      method: 'POST',
    })
    if (!response.ok) throw new Error('Failed to roll dice')
    return response.json()
  },

  async buyProperty(gameId: string, playerId: string, propertyId: number) {
    const response = await fetch(`${API_URL}/games/${gameId}/buy?player_id=${playerId}&property_id=${propertyId}`, {
      method: 'POST',
    })
    if (!response.ok) throw new Error('Failed to buy property')
    return response.json()
  },

  async endTurn(gameId: string, playerId: string) {
    const response = await fetch(`${API_URL}/games/${gameId}/end-turn?player_id=${playerId}`, {
      method: 'POST',
    })
    if (!response.ok) throw new Error('Failed to end turn')
    return response.json()
  },

  async getGameByCode(roomCode: string) {
    const response = await fetch(`${API_URL}/games/code/${roomCode}`)
    if (!response.ok) throw new Error('Game not found')
    return response.json()
  },
}
