'use client'

import { motion } from 'framer-motion'
import { Player, Property } from '@/lib/types'
import { formatMoney } from '@/lib/utils'
import { Coins, Home, Key } from 'lucide-react'

interface PlayerPanelProps {
  player: Player
  board: Property[]
  isCurrentPlayer: boolean
}

export default function PlayerPanel({ player, board, isCurrentPlayer }: PlayerPanelProps) {
  const playerProperties = board.filter((p) => p.owner === player.id)
  const totalHouses = playerProperties.reduce((sum, p) => sum + p.houses, 0)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border-2 ${
        isCurrentPlayer ? 'border-blue-500 shadow-lg shadow-blue-500/50' : 'border-slate-700'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={{ backgroundColor: player.color }}
        >
          {player.avatar}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white">{player.name}</h3>
          {isCurrentPlayer && (
            <span className="text-xs text-blue-400 font-semibold">Votre tour</span>
          )}
        </div>
        {!player.is_connected && (
          <span className="text-xs text-red-400">Déconnecté</span>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Coins className="w-4 h-4 text-yellow-400" />
          <span className="text-gray-300">Argent:</span>
          <span className="font-bold text-white ml-auto">{formatMoney(player.money)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Home className="w-4 h-4 text-green-400" />
          <span className="text-gray-300">Propriétés:</span>
          <span className="font-bold text-white ml-auto">{playerProperties.length}</span>
        </div>

        {totalHouses > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Home className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300">Maisons:</span>
            <span className="font-bold text-white ml-auto">{totalHouses}</span>
          </div>
        )}

        {player.get_out_of_jail_cards > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <Key className="w-4 h-4 text-purple-400" />
            <span className="text-gray-300">Cartes prison:</span>
            <span className="font-bold text-white ml-auto">{player.get_out_of_jail_cards}</span>
          </div>
        )}
      </div>

      {player.status === 'in_jail' && (
        <div className="mt-3 p-2 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-xs text-red-300 text-center font-semibold">🔒 En prison</p>
        </div>
      )}

      {player.status === 'bankrupt' && (
        <div className="mt-3 p-2 bg-gray-500/20 border border-gray-500 rounded-lg">
          <p className="text-xs text-gray-300 text-center font-semibold">💸 Faillite</p>
        </div>
      )}
    </motion.div>
  )
}
