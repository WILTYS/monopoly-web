'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Dices, Users, Sparkles } from 'lucide-react'
import { api } from '@/lib/api'

export default function HomePage() {
  const router = useRouter()
  const [playerName, setPlayerName] = useState('')
  const [roomCode, setRoomCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCreateGame = async () => {
    if (!playerName.trim()) {
      setError('Entrez votre nom')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await api.createGame(playerName, 6)
      localStorage.setItem('playerId', result.host_id)
      localStorage.setItem('gameId', result.game_id)
      router.push(`/lobby/${result.game_id}`)
    } catch (err) {
      setError('Erreur lors de la création')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleJoinGame = async () => {
    if (!playerName.trim()) {
      setError('Entrez votre nom')
      return
    }

    if (!roomCode.trim()) {
      setError('Entrez le code de la partie')
      return
    }

    setLoading(true)
    setError('')

    try {
      const gameData = await api.getGameByCode(roomCode.toUpperCase())
      const result = await api.joinGame(gameData.game_id, playerName)
      localStorage.setItem('playerId', result.player_id)
      localStorage.setItem('gameId', gameData.game_id)
      router.push(`/lobby/${gameData.game_id}`)
    } catch (err) {
      setError('Partie introuvable')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-block mb-6"
          >
            <Dices className="w-24 h-24 text-blue-400" />
          </motion.div>
          
          <h1 className="text-6xl font-bold text-white mb-4">
            Monopoly <span className="text-blue-400">Web</span>
          </h1>
          
          <p className="text-xl text-gray-300">
            Jeu multijoueur en temps réel
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-700">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Votre nom
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Entrez votre nom"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateGame()}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateGame}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Sparkles className="w-5 h-5" />
              {loading ? 'Création...' : 'Créer une partie'}
            </motion.button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-800/50 text-gray-400">ou</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Code de la partie
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Ex: ABC123"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent uppercase"
                maxLength={6}
                onKeyPress={(e) => e.key === 'Enter' && handleJoinGame()}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoinGame}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-4 px-6 rounded-lg shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Users className="w-5 h-5" />
              {loading ? 'Connexion...' : 'Rejoindre une partie'}
            </motion.button>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>2-6 joueurs • Temps réel • Mobile & Desktop</p>
        </div>
      </motion.div>
    </div>
  )
}
