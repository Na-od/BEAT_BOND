import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCoinMetrics } from '@/hooks/useCoinMetrics'
import { mergeCreatorsWithLocal } from '@/utils/mergeCreators'

export default function CoinDetailPage() {
  const { coinId } = useParams()
  const [coin, setCoin] = useState<any | null>(null)
  const metrics = useCoinMetrics(coin?.address || '')

  useEffect(() => {
    async function fetchCoin() {
      const all = await mergeCreatorsWithLocal([])
      const found = all.find((c: any) => c.id === coinId || c.address === coinId || c.symbol === coinId)
      setCoin(found || null)
    }
    fetchCoin()
  }, [coinId])

  if (!coin) {
    return <div className="min-h-screen flex items-center justify-center text-lg">Coin not found</div>
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex flex-col items-center mb-8">
          <img
            src={coin.coverImage?.startsWith('ipfs://') ? `https://ipfs.io/ipfs/${coin.coverImage.replace('ipfs://','')}` : coin.coverImage || '/fallback-cover.png'}
            alt={coin.name}
            className="w-full h-48 object-cover rounded-lg mb-4"
            onError={e => (e.currentTarget.src = '/fallback-cover.png')}
          />
          <img
            src={coin.avatar?.startsWith('ipfs://') ? `https://ipfs.io/ipfs/${coin.avatar.replace('ipfs://','')}` : coin.avatar || '/fallback-avatar.png'}
            alt={coin.name}
            className="w-24 h-24 rounded-full border-4 border-white -mt-16 mb-2 object-cover"
            onError={e => (e.currentTarget.src = '/fallback-avatar.png')}
          />
          <h1 className="text-3xl font-bold text-neutral-900 mb-1">{coin.name}</h1>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-primary-600 font-semibold">{coin.symbol}</span>
            {coin.verified && <span className="bg-primary-100 text-primary-600 px-2 py-1 rounded-full text-xs">Verified</span>}
          </div>
          <div className="text-neutral-600 mb-2">{coin.bio}</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-2 gap-6 text-center mb-6">
            <div>
              <div className="text-neutral-500 mb-1">Bond Price</div>
              <div className="text-2xl font-bold text-neutral-900">{metrics.loading ? '...' : (metrics.bondPrice && metrics.bondPrice > 0 ? `${metrics.bondPrice} ETH` : <span className="text-neutral-400">--</span>)}</div>
            </div>
            <div>
              <div className="text-neutral-500 mb-1">Holders</div>
              <div className="text-2xl font-bold text-neutral-900">{metrics.loading ? '...' : (metrics.holders && metrics.holders > 0 ? metrics.holders : <span className="text-neutral-400">--</span>)}</div>
            </div>
            <div>
              <div className="text-neutral-500 mb-1">TVL</div>
              <div className="text-2xl font-bold text-neutral-900">{metrics.loading ? '...' : (metrics.tvl && metrics.tvl > 0 ? `${metrics.tvl} ETH` : <span className="text-neutral-400">--</span>)}</div>
            </div>
            <div>
              <div className="text-neutral-500 mb-1">24h Change</div>
              <div className={`text-2xl font-bold ${metrics.percentChange >= 0 ? 'text-success-600' : 'text-error-600'}`}>{metrics.loading ? '...' : (typeof metrics.percentChange === 'number' ? `${metrics.percentChange >= 0 ? '+' : ''}${metrics.percentChange.toFixed(2)}%` : <span className="text-neutral-400">--</span>)}</div>
            </div>
          </div>
          <div className="text-neutral-700 text-base whitespace-pre-line">
            {coin.description || coin.bio}
          </div>
        </div>
        {/* Add more detailed stats, buy/sell actions, or chart here if desired */}
      </div>
    </div>
  )
}
