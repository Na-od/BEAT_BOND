// Utility for storing and retrieving created coins in localStorage
export interface StoredCoin {
  creator: string;
  address: string;
  uri: string;
  symbol: string;
  name: string;
  image?: string;
  version?: string;
  pool?: string;
  explorerUrl?: string; // Add explorerUrl for Zora link
  createdAt: string;
}

const STORAGE_KEY = 'zora_created_coins_v1';

export function saveCoinToLocal(coin: StoredCoin) {
  const coins: StoredCoin[] = getCoinsFromLocal();
  coins.push(coin);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(coins));
}

export function getCoinsFromLocal(): StoredCoin[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredCoin[];
  } catch {
    return [];
  }
}
