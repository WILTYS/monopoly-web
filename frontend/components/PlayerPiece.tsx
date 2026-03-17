'use client'

import { motion } from 'framer-motion'
import { Player } from '@/lib/types'
import { getPlayerPosition } from '@/lib/utils'

interface PlayerPieceProps {
  player: Player
  playerIndex: number
  totalPlayers: number
  isCurrentPlayer: boolean
}

export default function PlayerPiece({ player, playerIndex, totalPlayers, isCurrentPlayer }: PlayerPieceProps) {
  const position = getPlayerPosition(player.position, playerIndex, totalPlayers)

  return (
    <motion.div
      className="player-piece"
      style={{
        left: position.left,
        top: position.top,
        backgroundColor: player.color,
        boxShadow: isCurrentPlayer ? `0 0 20px ${player.color}` : undefined,
      }}
      animate={{
        left: position.left,
        top: position.top,
      }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 20,
      }}
    >
      <span className="text-2xl">{player.avatar}</span>
      {isCurrentPlayer && (
        <motion.div
          className="pulse-ring"
          style={{ borderColor: player.color, borderWidth: 2 }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.div>
  )
}
