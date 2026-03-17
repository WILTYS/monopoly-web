'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, LogOut, MessageCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { socketService } from '@/lib/socket'
import { Game, Property, LandingResult } from '@/lib/types'
import Board from '@/components/Board'
import PlayerPanel from '@/components/PlayerPanel'
import DiceRoller from '@/components/DiceRoller'
import PropertyModal from '@/components/PropertyModal'

export default function GamePage() {
  const router = useRouter()
  const params = useParams()
  const gameId = params.gameId as string

  const [game, setGame] = useState<Game | null>(null)
  const [playerId, setPlayerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [landingResult, setLandingResult] = useState<LandingResult | null>(null)
  const [message, setMessage] = useState('')

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

    socket.on('dice_rolled', (data: any) => {
      setGame(data.game)
      if (data.landing) {
        setLandingResult(data.landing)
        if (data.landing.action_required === 'buy_or_auction') {
          setSelectedProperty(data.landing.tile)
        }
      }
    })

    socket.on('property_bought', (data: any) => {
      setGame(data.game)
      setSelectedProperty(null)
      setLandingResult(null)
    })

    socket.on('turn_ended', (data: any) => {
      setGame(data.game)
      setLandingResult(null)
    })

    return () => {
      socket.off('dice_rolled')
      socket.off('property_bought')
      socket.off('turn_ended')
    }
  }, [gameId, router])

  const handleRollDice = async () => {
    if (!playerId || !game) return

    try {
      await api.rollDice(gameId, playerId)
    } catch (error) {
      console.error('Erreur lancer dés:', error)
    }
  }

  const handleBuyProperty = async () => {
    if (!playerId || !selectedProperty) return

    try {
      await api.buyProperty(gameId, playerId, selectedProperty.id)
    } catch (error) {
      console.error('Erreur achat propriété:', error)
    }
  }

  const handleEndTurn = async () => {
    if (!playerId) return

    try {
      await api.endTurn(gameId, playerId)
    } catch (error) {
      console.error('Erreur fin tour:', error)
    }
  }

  const handleLeaveGame = () => {
    socketService.leaveRoom(gameId)
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
      </div>
    )
  }

  if (!game || !playerId) return null

  const currentPlayer = game.players.find((p) => p.id === playerId)
  const isMyTurn = game.players[game.current_turn % game.players.length]?.id === playerId
  const currentTurnPlayer = game.players[game.current_turn % game.players.length]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Monopoly Web</h1>
            <p className="text-gray-400">Code: {game.room_code}</p>
          </div>
          
          <button
            onClick={handleLeaveGame}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500 rounded-lg text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Quitter
          </button>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr_300px] gap-6">
          <div className="space-y-4">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700">
              <h2 className="text-lg font-bold text-white mb-3">Joueurs</h2>
              <div className="space-y-3">
                {game.players.map((player) => (
                  <PlayerPanel
                    key={player.id}
                    player={player}
                    board={game.board}
                    isCurrentPlayer={player.id === currentTurnPlayer?.id}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6">
            <Board
              board={game.board}
              players={game.players}
              currentPlayerId={currentTurnPlayer?.id}
              onCellClick={(propertyId) => {
                const property = game.board.find((p) => p.id === propertyId)
                if (property) setSelectedProperty(property)
              }}
            />

            {currentPlayer && currentPlayer.status === 'active' && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700 w-full max-w-md">
                {isMyTurn ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-xl font-bold text-white mb-2">C'est votre tour !</p>
                      <p className="text-gray-400 text-sm">Lancez les dés pour jouer</p>
                    </div>

                    <DiceRoller
                      onRoll={handleRollDice}
                      disabled={false}
                      lastRoll={currentPlayer.last_roll}
                    />

                    {landingResult && (
                      <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500 rounded-lg">
                        <p className="text-blue-300 text-sm text-center">{landingResult.message}</p>
                      </div>
                    )}

                    <button
                      onClick={handleEndTurn}
                      className="w-full bg-gradient-to-r from-gray-600 to-gray-500 hover:from-gray-700 hover:to-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                    >
                      Terminer mon tour
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-lg text-gray-300 mb-2">
                      Tour de <span className="font-bold text-white">{currentTurnPlayer?.name}</span>
                    </p>
                    <p className="text-sm text-gray-400">Attendez votre tour...</p>
                  </div>
                )}
              </div>
            )}

            {currentPlayer && currentPlayer.status === 'bankrupt' && (
              <div className="bg-red-500/20 backdrop-blur-xl rounded-xl p-6 border border-red-500 w-full max-w-md">
                <p className="text-xl font-bold text-red-300 text-center">Vous êtes en faillite 💸</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700">
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Historique
              </h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {game.transactions.slice(-10).reverse().map((transaction, i) => (
                  <div key={i} className="text-xs text-gray-400 p-2 bg-slate-900/50 rounded">
                    {transaction.reason} - {transaction.amount}€
                  </div>
                ))}
              </div>
            </div>

            {currentPlayer && (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700">
                <h2 className="text-lg font-bold text-white mb-3">Mes propriétés</h2>
                <div className="space-y-2">
                  {currentPlayer.properties.length === 0 ? (
                    <p className="text-sm text-gray-400">Aucune propriété</p>
                  ) : (
                    currentPlayer.properties.map((propId) => {
                      const property = game.board.find((p) => p.id === propId)
                      return property ? (
                        <button
                          key={propId}
                          onClick={() => setSelectedProperty(property)}
                          className="w-full text-left p-2 bg-slate-900/50 hover:bg-slate-900 rounded text-sm text-white transition-colors"
                        >
                          {property.name}
                        </button>
                      ) : null
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedProperty && (
          <PropertyModal
            property={selectedProperty}
            onClose={() => {
              setSelectedProperty(null)
              setLandingResult(null)
            }}
            onBuy={
              landingResult?.action_required === 'buy_or_auction' && currentPlayer
                ? handleBuyProperty
                : undefined
            }
            canBuy={
              currentPlayer
                ? currentPlayer.money >= selectedProperty.price
                : false
            }
          />
        )}
      </AnimatePresence>
    </div>
  )
}
