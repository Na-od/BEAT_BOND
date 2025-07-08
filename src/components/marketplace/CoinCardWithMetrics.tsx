import React from 'react'
import { CoinCard } from './CoinCard'
import { useCoinMetrics } from '@/hooks/useCoinMetrics'

export function CoinCardWithMetrics({ coin }: { coin: any }) {
  const metrics = useCoinMetrics(coin.address)
  return (
    <CoinCard
      coin={{
        ...coin,
        bondPrice: metrics.bondPrice,
        holders: metrics.holders,
        tvl: metrics.tvl,
        percentChange: metrics.percentChange,
        explorerUrl: coin.explorerUrl, // Pass explorerUrl through
      }}
    />
  )
}
