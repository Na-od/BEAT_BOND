import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Verified, Star } from 'lucide-react'
import { Creator } from '@/types'
import { useButtonHandlers } from '@/hooks/useButtonHandlers'

interface CreatorCardProps {
  creator: Creator
}

export function CreatorCard({ creator }: CreatorCardProps) {
  const { handleViewCreatorProfile } = useButtonHandlers()
  
  const bondPriceChange = Math.random() > 0.5 ? 
    `+${(Math.random() * 15).toFixed(1)}%` : 
    `-${(Math.random() * 8).toFixed(1)}%`
  
  const isPositive = bondPriceChange.startsWith('+')

  const handleViewProfile = () => {
    handleViewCreatorProfile(creator.address)
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
      onClick={handleViewProfile}
    >
      {/* Cover Image */}
      <div className="relative h-32 -m-6 mb-4 overflow-hidden">
        <img
          src={creator.coverImage}
          alt={`${creator.name} cover`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-neutral-700 rounded-full">
            {creator.category}
          </span>
        </div>

        {/* Price Change */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            isPositive 
              ? 'bg-success-100 text-success-700' 
              : 'bg-error-100 text-error-700'
          }`}>
            {bondPriceChange}
          </span>
        </div>
      </div>

      {/* Creator Info */}
      <div className="flex items-start space-x-3 mb-4">
        <img
          src={creator.avatar}
          alt={creator.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1 mb-1">
            <h3 className="font-semibold text-neutral-900 truncate">
              {creator.name}
            </h3>
            {creator.verified && (
              <Verified className="w-4 h-4 text-primary-500 flex-shrink-0" />
            )}
          </div>
          
          <p className="text-sm text-neutral-600 line-clamp-2">
            {creator.bio}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <div className="flex items-center space-x-1 text-neutral-500 mb-1">
            <TrendingUp className="w-3 h-3" />
            <span>Bond Price</span>
          </div>
          <div className="font-semibold text-neutral-900">
            {creator.bondPrice} ETH
          </div>
        </div>
        
        <div>
          <div className="flex items-center space-x-1 text-neutral-500 mb-1">
            <Users className="w-3 h-3" />
            <span>Holders</span>
          </div>
          <div className="font-semibold text-neutral-900">
            {creator.totalBonds.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Total Value */}
      <div className="mb-4">
        <div className="text-xs text-neutral-500 mb-1">Total Value Locked</div>
        <div className="text-lg font-bold text-neutral-900">
          ${creator.totalValue.toLocaleString()}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleViewProfile()
        }}
        className="w-full btn-primary justify-center group-hover:bg-primary-700 transition-colors duration-200"
      >
        View Profile
        <Star className="w-4 h-4 ml-2" />
      </button>
    </motion.div>
  )
}