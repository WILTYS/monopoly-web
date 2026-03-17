'use client'

import { motion } from 'framer-motion'
import { Property, PropertyType } from '@/lib/types'
import { getPropertyColorClass, formatMoney } from '@/lib/utils'
import { Home, Zap, Train } from 'lucide-react'

interface BoardCellProps {
  property: Property
  isCorner: boolean
  onClick?: () => void
}

export default function BoardCell({ property, isCorner, onClick }: BoardCellProps) {
  const colorClass = getPropertyColorClass(property.color)

  if (isCorner) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="board-cell h-full flex items-center justify-center cursor-pointer"
        onClick={onClick}
      >
        <div className="text-center p-2">
          <p className="text-xs font-bold text-white">{property.name}</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="board-cell h-full cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {property.type === PropertyType.STREET && (
        <>
          <div className={`property-color-bar ${colorClass}`} />
          <div className="p-1 pt-3 h-full flex flex-col justify-between">
            <p className="text-[10px] font-semibold text-white text-center leading-tight">
              {property.name}
            </p>
            <div className="text-center">
              <p className="text-[8px] text-gray-300">{formatMoney(property.price)}</p>
              {property.owner && (
                <div className="mt-1 flex justify-center gap-0.5">
                  {Array.from({ length: property.houses }).map((_, i) => (
                    <Home key={i} className="w-2 h-2 text-green-400" />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {property.type === PropertyType.STATION && (
        <div className="p-1 h-full flex flex-col items-center justify-center">
          <Train className="w-4 h-4 text-gray-400 mb-1" />
          <p className="text-[10px] font-semibold text-white text-center leading-tight">
            {property.name}
          </p>
          <p className="text-[8px] text-gray-300 mt-1">{formatMoney(property.price)}</p>
        </div>
      )}

      {property.type === PropertyType.UTILITY && (
        <div className="p-1 h-full flex flex-col items-center justify-center">
          <Zap className="w-4 h-4 text-yellow-400 mb-1" />
          <p className="text-[10px] font-semibold text-white text-center leading-tight">
            {property.name}
          </p>
          <p className="text-[8px] text-gray-300 mt-1">{formatMoney(property.price)}</p>
        </div>
      )}

      {property.type === PropertyType.SPECIAL && property.name !== 'Départ' && (
        <div className="p-1 h-full flex items-center justify-center">
          <p className="text-[10px] font-semibold text-white text-center leading-tight">
            {property.name}
          </p>
        </div>
      )}

      {property.is_mortgaged && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <p className="text-[8px] text-red-400 font-bold transform -rotate-45">HYPOTHÈQUE</p>
        </div>
      )}
    </motion.div>
  )
}
