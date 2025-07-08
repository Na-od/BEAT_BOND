// Utility to persist and retrieve purchased bonds from localStorage
// Used for FanDashboard to show all purchased coins

export interface LocalBond {
  id: string;
  creatorName: string;
  creatorAddress: string;
  avatar: string;
  tier: string;
  amount: number;
  purchasePrice: number;
  currentPrice: number;
  change24h: number;
  category?: string;
  purchasedAt: string; // ISO
}

const STORAGE_KEY = 'fan_purchased_bonds_v1'

export function saveBondToLocal(bond: LocalBond) {
  const prev = getBondsFromLocal()
  localStorage.setItem(STORAGE_KEY, JSON.stringify([bond, ...prev]))
}

export function getBondsFromLocal(): LocalBond[] {
  if (typeof window === 'undefined') return []
  try {
    const val = localStorage.getItem(STORAGE_KEY)
    if (!val) return []
    return JSON.parse(val)
  } catch {
    return []
  }
}

export function clearBondsLocal() {
  localStorage.removeItem(STORAGE_KEY)
}
