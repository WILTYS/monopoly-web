'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Dices } from 'lucide-react'

interface DiceRollerProps {
  onRoll: () => void
  disabled: boolean
  lastRoll?: number[]
}

export default function DiceRoller({ onRoll, disabled, lastRoll }: DiceRollerProps) {
  const [isRolling, setIsRolling] = useState(false)

  const handleRoll = async () => {
    setIsRolling(true)
    onRoll()
    setTimeout(() => setIsRolling(false), 500)
  }

  const getDiceFace = (value: number) => {
    const faces: Record<number, string> = {
      1: '⚀',
      2: '⚁',
      3: '⚂',
      4: '⚃',
      5: '⚄',
      6: '⚅',
    }
    return faces[value] || '⚀'
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {lastRoll && lastRoll.length === 2 && (
        <div className="flex gap-4">
          {lastRoll.map((die, index) => (
            <motion.div
              key={index}
              className={`dice ${isRolling ? 'rolling' : ''}`}
              initial={{ rotateX: 0, rotateY: 0 }}
              animate={
                isRolling
                  ? {
                      rotateX: [0, 360, 720],
                      rotateY: [0, 360, 720],
                    }
                  : {}
              }
              transition={{ duration: 0.5 }}
            >
              {getDiceFace(die)}
            </motion.div>
          ))}
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleRoll}
        disabled={disabled || isRolling}
        className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        <Dices className="w-6 h-6" />
        {isRolling ? 'Lancement...' : 'Lancer les dés'}
      </motion.button>
    </div>
  )
}
