import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { PropertyColor } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPropertyColorClass(color: PropertyColor): string {
  const colorMap: Record<PropertyColor, string> = {
    [PropertyColor.BROWN]: 'bg-amber-800',
    [PropertyColor.LIGHT_BLUE]: 'bg-sky-400',
    [PropertyColor.PINK]: 'bg-pink-500',
    [PropertyColor.ORANGE]: 'bg-orange-500',
    [PropertyColor.RED]: 'bg-red-600',
    [PropertyColor.YELLOW]: 'bg-yellow-400',
    [PropertyColor.GREEN]: 'bg-green-600',
    [PropertyColor.DARK_BLUE]: 'bg-blue-800',
    [PropertyColor.STATION]: 'bg-gray-700',
    [PropertyColor.UTILITY]: 'bg-gray-600',
    [PropertyColor.NONE]: 'bg-transparent',
  }
  return colorMap[color] || 'bg-gray-500'
}

export function formatMoney(amount: number): string {
  return `${amount}€`
}

export function getBoardPosition(index: number): { x: number; y: number } {
  const positions: Record<number, { x: number; y: number }> = {}
  
  for (let i = 0; i <= 10; i++) {
    positions[i] = { x: 10 - i, y: 10 }
  }
  
  for (let i = 11; i <= 19; i++) {
    positions[i] = { x: 0, y: 10 - (i - 10) }
  }
  
  positions[20] = { x: 0, y: 0 }
  
  for (let i = 21; i <= 29; i++) {
    positions[i] = { x: i - 20, y: 0 }
  }
  
  positions[30] = { x: 10, y: 0 }
  
  for (let i = 31; i <= 39; i++) {
    positions[i] = { x: 10, y: i - 30 }
  }
  
  return positions[index] || { x: 0, y: 0 }
}

export function getPlayerPosition(
  boardIndex: number,
  playerIndex: number,
  totalPlayers: number
): { left: string; top: string } {
  const { x, y } = getBoardPosition(boardIndex)
  
  const cellSize = 100 / 11
  const baseLeft = x * cellSize
  const baseTop = y * cellSize
  
  const offset = (playerIndex - totalPlayers / 2) * 8
  
  return {
    left: `calc(${baseLeft}% + ${offset}px)`,
    top: `calc(${baseTop}% + ${offset}px)`,
  }
}
