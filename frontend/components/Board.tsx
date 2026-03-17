'use client'

import { motion } from 'framer-motion'
import { Property, Player } from '@/lib/types'
import { getPropertyColorClass, getBoardPosition } from '@/lib/utils'
import BoardCell from './BoardCell'
import PlayerPiece from './PlayerPiece'

interface BoardProps {
  board: Property[]
  players: Player[]
  currentPlayerId?: string
  onCellClick?: (propertyId: number) => void
}

export default function Board({ board, players, currentPlayerId, onCellClick }: BoardProps) {
  return (
    <div className="relative w-full aspect-square max-w-4xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-green-800 to-green-900 rounded-2xl shadow-2xl">
        <div className="absolute inset-4 border-4 border-gray-800 rounded-xl">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-2">MONOPOLY</h2>
              <p className="text-gray-300">Web Edition</p>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 grid grid-cols-11 grid-rows-11">
          {board.map((property, index) => {
            const { x, y } = getBoardPosition(index)
            const isCorner = [0, 10, 20, 30].includes(index)
            
            return (
              <div
                key={property.id}
                style={{
                  gridColumn: x + 1,
                  gridRow: y + 1,
                  gridColumnEnd: isCorner ? 'span 1' : undefined,
                  gridRowEnd: isCorner ? 'span 1' : undefined,
                }}
                className={isCorner ? 'col-span-1 row-span-1' : ''}
              >
                <BoardCell
                  property={property}
                  isCorner={isCorner}
                  onClick={() => onCellClick?.(property.id)}
                />
              </div>
            )
          })}
        </div>

        {players.map((player, index) => (
          <PlayerPiece
            key={player.id}
            player={player}
            playerIndex={index}
            totalPlayers={players.length}
            isCurrentPlayer={player.id === currentPlayerId}
          />
        ))}
      </div>
    </div>
  )
}
