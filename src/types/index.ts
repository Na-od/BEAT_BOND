export interface Creator {
  id: string
  address: string
  name: string
  bio: string
  avatar: string
  coverImage: string
  category: string
  totalBonds: number
  totalValue: number
  bondPrice: number
  followers: number
  verified: boolean
  createdAt: Date
}

export interface Bond {
  id: string
  creatorId: string
  fanAddress: string
  tokenId: number
  purchasePrice: number
  currentValue: number
  purchaseDate: Date
  metadata: {
    tier: 'bronze' | 'silver' | 'gold' | 'platinum'
    benefits: string[]
    exclusiveContent: boolean
  }
}

export interface BondTier {
  name: string
  price: number
  supply: number
  benefits: string[]
  color: string
}

export interface CreatorStats {
  totalRevenue: number
  totalBonds: number
  activeHolders: number
  averageBondValue: number
  monthlyGrowth: number
}

export interface FanStats {
  totalInvested: number
  bondsOwned: number
  creatorsSupported: number
  portfolioValue: number
  totalReturns: number
}

export interface Transaction {
  id: string
  type: 'purchase' | 'sale' | 'reward'
  amount: number
  creatorId: string
  timestamp: Date
  status: 'pending' | 'completed' | 'failed'
}