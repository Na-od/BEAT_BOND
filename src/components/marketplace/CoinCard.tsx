import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Verified, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface CoinCardProps {
  coin: {
    id: string
    address: string
    name: string
    bio?: string
    avatar?: string
    coverImage?: string
    category?: string
    bondPrice: number
    holders: number
    tvl: number
    percentChange: number
    verified?: boolean
    explorerUrl?: string
  }
}

export function CoinCard({ coin }: CoinCardProps) {
  const navigate = useNavigate()
  const isPositive = coin.percentChange >= 0

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
      onClick={() => navigate(`/coin/${coin.address}`)}
    >
      {/* Cover Image */}
      <div className="relative h-32 -m-6 mb-4 overflow-hidden">
        <img
          src={coin.coverImage?.startsWith('ipfs://') ? `https://ipfs.io/ipfs/${coin.coverImage.replace('ipfs://','')}` : coin.coverImage || '/fallback-cover.png'}
          alt={`${coin.name} cover`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={e => (e.currentTarget.src = '/fallback-cover.png')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-medium text-neutral-700 rounded-full">
            {coin.category}
          </span>
        </div>
        {/* Price Change */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            isPositive
              ? 'bg-success-100 text-success-700'
              : 'bg-error-100 text-error-700'
          }`}>
            {coin.percentChange >= 0 ? '+' : ''}{coin.percentChange.toFixed(1)}%
          </span>
        </div>
      </div>
      {/* Coin Info */}
      <div className="flex items-start space-x-3 mb-4">
        <img
          src={coin.avatar?.startsWith('ipfs://') ? `https://ipfs.io/ipfs/${coin.avatar.replace('ipfs://','')}` : coin.avatar || '/fallback-avatar.png'}
          alt={coin.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
          onError={e => (e.currentTarget.src = '/fallback-avatar.png')}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1 mb-1">
            <h3 className="font-semibold text-neutral-900 truncate">
              {coin.name}
            </h3>
            {coin.verified && (
              <Verified className="w-4 h-4 text-primary-500 flex-shrink-0" />
            )}
          </div>
          <p className="text-sm text-neutral-600 line-clamp-2">
            {coin.bio}
          </p>
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
        <div>
          <div className="flex items-center space-x-1 text-neutral-500 mb-1">
            <TrendingUp className="w-3 h-3" />
            <span>Bond Price</span>
          </div>
          <div className="font-semibold text-neutral-900">
            {coin.bondPrice && coin.bondPrice > 0 ? `${coin.bondPrice} ETH` : <span className="text-neutral-400">--</span>}
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-1 text-neutral-500 mb-1">
            <Users className="w-3 h-3" />
            <span>Holders</span>
          </div>
          <div className="font-semibold text-neutral-900">
            {coin.holders && coin.holders > 0 ? coin.holders.toLocaleString() : <span className="text-neutral-400">--</span>}
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-1 text-neutral-500 mb-1">
            <Star className="w-3 h-3" />
            <span>TVL</span>
          </div>
          <div className="font-semibold text-neutral-900">
            {coin.tvl && coin.tvl > 0 ? `${coin.tvl.toLocaleString()} ETH` : <span className="text-neutral-400">--</span>}
          </div>
        </div>
      </div>
      {/* View Profile */}
      <button
        className="btn-primary w-full"
        onClick={e => {
          e.stopPropagation();
          navigate(`/coin/${coin.id || coin.address}`)
        }}
      >
        View Profile
      </button>
      {/* Buy on Zora button if explorerUrl is present */}
      {coin.explorerUrl && (
        <a
          href={coin.explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary w-full mt-2 flex justify-center"
          onClick={e => e.stopPropagation()}
        >
          Buy on Zora
        </a>
      )}
    </motion.div>
  )
}
