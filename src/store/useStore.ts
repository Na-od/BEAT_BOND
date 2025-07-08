import { create } from 'zustand'
import { Creator, Bond, Transaction } from '@/types'

interface AppState {
  // User state
  userType: 'creator' | 'fan' | null
  setUserType: (type: 'creator' | 'fan' | null) => void
  
  // Creators
  creators: Creator[]
  setCreators: (creators: Creator[]) => void
  addCreator: (creator: Creator) => void
  
  // Bonds
  bonds: Bond[]
  setBonds: (bonds: Bond[]) => void
  addBond: (bond: Bond) => void
  
  // Transactions
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[]) => void
  addTransaction: (transaction: Transaction) => void
  
  // UI state
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

export const useStore = create<AppState>((set) => ({
  // User state
  userType: null,
  setUserType: (type) => set({ userType: type }),
  
  // Creators
  creators: [],
  setCreators: (creators) => set({ creators }),
  addCreator: (creator) => set((state) => ({ 
    creators: [...state.creators, creator] 
  })),
  
  // Bonds
  bonds: [],
  setBonds: (bonds) => set({ bonds }),
  addBond: (bond) => set((state) => ({ 
    bonds: [...state.bonds, bond] 
  })),
  
  // Transactions
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  addTransaction: (transaction) => set((state) => ({ 
    transactions: [...state.transactions, transaction] 
  })),
  
  // UI state
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}))