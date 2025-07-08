import { getCoinsFromLocal, StoredCoin } from './localCoins'

/**
 * Merge mock creators with locally created coins (from localStorage),
 * fetching metadata for each local coin and formatting as a CreatorCard-compatible object.
 *
 * @param mockCreators The array of hardcoded creators
 * @returns Promise<Creator[]>
 */
export async function mergeCreatorsWithLocal(mockCreators: any[]): Promise<any[]> {
  const localCoins: StoredCoin[] = getCoinsFromLocal()
  // Fetch metadata for each local coin
  const localCreators = await Promise.all(
    localCoins.map(async (coin) => {
      let meta: any = {}
      try {
        // Fetch metadata JSON from IPFS/HTTP
        const url = coin.uri.startsWith('ipfs://')
          ? `https://ipfs.io/ipfs/${coin.uri.replace('ipfs://', '')}`
          : coin.uri
        const res = await fetch(url)
        meta = await res.json()
      } catch (err) {
        meta = { name: coin.name, symbol: coin.symbol, description: '', image: '', bio: '', avatar: '', coverImage: '' }
      }
      return {
        id: coin.address || coin.symbol || Math.random().toString(36).slice(2),
        address: coin.address,
        symbol: coin.symbol,
        name: meta.name || coin.name,
        bio: meta.description || '',
        avatar: meta.image || '',
        coverImage: meta.coverImage || meta.image || coin.image || '',
        category: meta.category || 'Other',
        totalBonds: 0,
        totalValue: 0,
        bondPrice: 0,
        followers: 0,
        verified: false,
        createdAt: coin.createdAt,
        explorerUrl: coin.explorerUrl, // Add explorerUrl for use in UI
        ...meta,
      }
    })
  )
  // Merge and deduplicate by address
  const all = [...mockCreators, ...localCreators]
  const deduped = all.filter((c, i, arr) => arr.findIndex(x => x.address === c.address) === i)
  return deduped
}
