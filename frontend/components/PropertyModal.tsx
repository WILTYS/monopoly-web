'use client'

import { motion } from 'framer-motion'
import { Property } from '@/lib/types'
import { getPropertyColorClass, formatMoney } from '@/lib/utils'
import { X, Home, DollarSign } from 'lucide-react'

interface PropertyModalProps {
  property: Property
  onClose: () => void
  onBuy?: () => void
  canBuy: boolean
}

export default function PropertyModal({ property, onClose, onBuy, canBuy }: PropertyModalProps) {
  const colorClass = getPropertyColorClass(property.color)

  return (
    <div className="card-popup" onClick={onClose}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="property-card"
        style={{ borderColor: property.color }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-white">{property.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className={`h-3 rounded-full mb-6 ${colorClass}`} />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Prix d'achat</span>
            <span className="text-2xl font-bold text-white">{formatMoney(property.price)}</span>
          </div>

          {property.rent && property.rent.length > 0 && (
            <div className="border-t border-slate-700 pt-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-3">Loyers</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Terrain nu</span>
                  <span className="text-white">{formatMoney(property.rent[0])}</span>
                </div>
                {property.rent.slice(1, 5).map((rent, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-gray-400 flex items-center gap-1">
                      <Home className="w-3 h-3" /> {i + 1} maison{i > 0 ? 's' : ''}
                    </span>
                    <span className="text-white">{formatMoney(rent)}</span>
                  </div>
                ))}
                {property.rent[5] && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Hôtel</span>
                    <span className="text-white font-bold">{formatMoney(property.rent[5])}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {property.house_cost && (
            <div className="border-t border-slate-700 pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Coût maison</span>
                <span className="text-white">{formatMoney(property.house_cost)}</span>
              </div>
            </div>
          )}

          <div className="border-t border-slate-700 pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Valeur hypothécaire</span>
              <span className="text-white">{formatMoney(property.mortgage_value)}</span>
            </div>
          </div>

          {property.owner && (
            <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-3">
              <p className="text-blue-300 text-sm text-center">
                Propriétaire: <span className="font-bold">{property.owner}</span>
              </p>
            </div>
          )}

          {!property.owner && onBuy && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBuy}
              disabled={!canBuy}
              className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 px-6 rounded-lg shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <DollarSign className="w-5 h-5" />
              Acheter pour {formatMoney(property.price)}
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
