import { useEffect, useState } from 'react'
import { readContract } from '@wagmi/core'
import { formatEther } from 'viem'
import { ZORA_COIN_V4_ABI } from '@/contracts/zoraCoin'

export interface CoinMetrics {
  bondPrice: number
  holders: number
  tvl: number
  percentChange: number
  loading: boolean
}

export function useCoinMetrics(address: string) {
  const [metrics, setMetrics] = useState<CoinMetrics>({
    bondPrice: 0,
    holders: 0,
    tvl: 0,
    percentChange: 0,
    loading: true
  })

  useEffect(() => {
    if (!address) return
    let cancelled = false
    async function fetchMetrics() {
      try {
        // Fetch current bond price
        const priceRaw = await readContract({
          address,
          abi: ZORA_COIN_V4_ABI,
          functionName: 'getCurrentPrice',
        })
        const bondPrice = parseFloat(formatEther(priceRaw as bigint))
        // Fetch holders
        const holders = await readContract({
          address,
          abi: ZORA_COIN_V4_ABI,
          functionName: 'totalHolders',
        })
        // Fetch TVL
        const tvlRaw = await readContract({
          address,
          abi: ZORA_COIN_V4_ABI,
          functionName: 'totalValueLocked',
        })
        const tvl = parseFloat(formatEther(tvlRaw as bigint))
        // Fetch historical price (simulate: 24h ago, or use a backend API)
        let percentChange = 0
        try {
          const resp = await fetch(`/api/coin-history?address=${address}`)
          if (resp.ok) {
            const { price24hAgo } = await resp.json()
            percentChange = price24hAgo ? ((bondPrice - price24hAgo) / price24hAgo) * 100 : 0
          }
        } catch {}
        if (!cancelled) setMetrics({ bondPrice, holders: Number(holders), tvl, percentChange, loading: false })
      } catch {
        if (!cancelled) setMetrics(m => ({ ...m, loading: false }))
      }
    }
    fetchMetrics()
    return () => { cancelled = true }
  }, [address])

  return metrics
}
