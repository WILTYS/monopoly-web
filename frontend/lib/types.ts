export enum PropertyType {
  STREET = 'street',
  STATION = 'station',
  UTILITY = 'utility',
  SPECIAL = 'special',
}

export enum PropertyColor {
  BROWN = 'brown',
  LIGHT_BLUE = 'light_blue',
  PINK = 'pink',
  ORANGE = 'orange',
  RED = 'red',
  YELLOW = 'yellow',
  GREEN = 'green',
  DARK_BLUE = 'dark_blue',
  STATION = 'station',
  UTILITY = 'utility',
  NONE = 'none',
}

export enum PlayerStatus {
  ACTIVE = 'active',
  IN_JAIL = 'in_jail',
  BANKRUPT = 'bankrupt',
}

export enum GameStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
}

export interface Property {
  id: number
  name: string
  type: PropertyType
  color: PropertyColor
  price: number
  rent: number[]
  house_cost?: number
  hotel_cost?: number
  mortgage_value: number
  owner?: string
  houses: number
  is_mortgaged: boolean
}

export interface Player {
  id: string
  name: string
  avatar: string
  color: string
  position: number
  money: number
  properties: number[]
  get_out_of_jail_cards: number
  status: PlayerStatus
  jail_turns: number
  is_connected: boolean
  last_roll?: number[]
}

export interface Transaction {
  from_player?: string
  to_player?: string
  amount: number
  reason: string
  timestamp: string
}

export interface Game {
  id: string
  room_code: string
  host_id: string
  players: Player[]
  current_turn: number
  status: GameStatus
  board: Property[]
  turn_history: any[]
  transactions: Transaction[]
  created_at: string
  started_at?: string
  finished_at?: string
  winner_id?: string
  max_players: number
  settings: Record<string, any>
}

export interface RollDiceResponse {
  dice: number[]
  total: number
  is_double: boolean
  new_position: number
  passed_go: boolean
}

export interface LandingResult {
  tile: Property
  action_required?: string
  message: string
  rent?: number
  amount?: number
  card_type?: string
}
