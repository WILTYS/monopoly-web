'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Copy, Check, Users, Play, Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { socketService } from '@/lib/socket'
import { Game, Player } from '@/lib/types'

export default function LobbyPage() {
  const router = useRouter()
  const params = useParams()
  const gameId = params.gameId as string

  const [game, setGame] = useState<Game | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedPlayerId = localStorage.getItem('playerId')
    setPlayerId(storedPlayerId)

    const loadGame = async () => {
      try {
        const gameData = await api.getGame(gameId)
        setGame(gameData)
      } catch (error) {
        console.error('Erreur chargement partie:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    loadGame()

    const socket = socketService.connect()
    if (storedPlayerId) {
      socketService.joinRoom(gameId, storedPlayerId)
    }

    socket.on('player_joined', (data: { player: Player; total_players: number }) => {
      setGame((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          players: [...prev.players, data.player],
        }
      })
    })

    socket.on('game_started', () => {
      router.push(`/game/${gameId}`)
    })

    return () => {
      socket.off('player_joined')
      socket.off('game_started')
    }
  }, [gameId, router])

  const handleCopyCode = () => {
    if (game) {
      navigator.clipboard.writeText(game.room_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleStartGame = async () => {
    if (!playerId || !game) return

    try {
      await api.startGame(gameId, playerId)
    } catch (error) {
      console.error('Erreur démarrage:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    )
  }

  if (!game) return null

  const isHost = playerId === game.host_id
  const canStart = game.players.length >= 2 && isHost

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Salon d'attente</h1>
          
          <div className="inline-flex items-center gap-3 bg-slate-800/50 backdrop-blur-xl rounded-xl px-6 py-4 border border-slate-700">
            <span className="text-gray-300">Code de la partie:</span>
            <span className="text-3xl font-bold text-blue-400">{game.room_code}</span>
            <button
              onClick={handleCopyCode}
              className="ml-2 p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              {copied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">
                Joueurs ({game.players.length}/{game.max_players})
              </h2>
            </div>

            <div className="space-y-3">
              {game.players.map((player, index) => (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 bg-slate-900/50 rounded-lg p-3"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
                    style={{ backgroundColor: player.color }}
                  >
                    {player.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">{player.name}</p>
                    {player.id === game.host_id && (
                      <span className="text-xs text-yellow-400">👑 Hôte</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {game.players.length < 2 && (
              <p className="text-sm text-gray-400 mt-4 text-center">
                En attente d'au moins 2 joueurs...
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700"
          >
            <h2 className="text-xl font-bold text-white mb-4">Règles du jeu</h2>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Lancez les dés pour vous déplacer</li>
              <li>• Achetez des propriétés</li>
              <li>• Construisez des maisons et hôtels</li>
              <li>• Collectez des loyers</li>
              <li>• Évitez la faillite</li>
              <li>• Le dernier joueur en jeu gagne!</li>
            </ul>

            <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500 rounded-lg">
              <p className="text-sm text-blue-300">
                💡 Partagez le code <strong>{game.room_code}</strong> avec vos amis pour qu'ils rejoignent!
              </p>
            </div>
          </motion.div>
        </div>

        {isHost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.button
              whileHover={{ scale: canStart ? 1.05 : 1 }}
              whileTap={{ scale: canStart ? 0.95 : 1 }}
              onClick={handleStartGame}
              disabled={!canStart}
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 px-12 rounded-xl shadow-lg flex items-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Play className="w-6 h-6" />
              Démarrer la partie
            </motion.button>

            {!canStart && game.players.length < 2 && (
              <p className="text-sm text-gray-400 mt-4">
                Attendez au moins 2 joueurs pour commencer
              </p>
            )}
          </motion.div>
        )}

        {!isHost && (
          <p className="text-center text-gray-400">
            En attente que l'hôte démarre la partie...
          </p>
        )}
      </div>
    </div>
  )
}
