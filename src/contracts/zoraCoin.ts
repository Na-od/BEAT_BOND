// Zora CoinV4 Contract Integration
// Based on Zora Protocol documentation: https://docs.zora.co/coins

export const ZORA_COIN_V4_ABI = [
  // Core CoinV4 functions
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      { name: "amount", type: "uint256" }
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { name: "account", type: "address" }
    ],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function"
  },
  // Treasury and pricing functions
  {
    inputs: [
      { name: "amount", type: "uint256" }
    ],
    name: "getMintPrice",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { name: "amount", type: "uint256" }
    ],
    name: "getBurnPrice",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "treasury",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "minter", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "cost", type: "uint256" }
    ],
    name: "Mint",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "burner", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "payout", type: "uint256" }
    ],
    name: "Burn",
    type: "event"
  }
] as const

// Zora CoinV4 Factory ABI for creating new coins
export const ZORA_COIN_FACTORY_ABI = [
  {
    inputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "treasury", type: "address" },
      { name: "initialSupply", type: "uint256" }
    ],
    name: "createCoin",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      { name: "coinAddress", type: "address" }
    ],
    name: "getCoinInfo",
    outputs: [
      { name: "name", type: "string" },
      { name: "symbol", type: "string" },
      { name: "treasury", type: "address" },
      { name: "totalSupply", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "creator", type: "address" },
      { indexed: true, name: "coin", type: "address" },
      { indexed: false, name: "name", type: "string" },
      { indexed: false, name: "symbol", type: "string" }
    ],
    name: "CoinCreated",
    type: "event"
  }
] as const

// Contract addresses - Updated with actual Zora Factory address
export const ZORA_CONTRACTS = {
  // Base Mainnet (Chain ID: 8453)
  8453: {
    coinFactory: "0x777777751622c0d3258f214F9DF38E35BF45baF3", // Official Zora Factory
    protocolRewards: "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B", // Zora Protocol Rewards
  },
  // Base Sepolia Testnet (Chain ID: 84532)
  84532: {
    coinFactory: "0x777777751622c0d3258f214F9DF38E35BF45baF3", // Same factory on testnet
    protocolRewards: "0x7777777F279eba3d3Ad8F4E708545291A6fDBA8B", // Same rewards on testnet
  }
} as const

// Creator coin registry - maps creator addresses to their coin contracts
// These will be populated as creators deploy their coins
export const CREATOR_COINS: Record<string, string> = {
  // Example creator coins - replace with actual deployed coins
  // Format: "creatorAddress": "coinContractAddress"
  
  // Mock data for demo purposes
  "0x1234567890123456789012345678901234567890": "0xCOIN1111111111111111111111111111111111111",
  "0x2345678901234567890123456789012345678901": "0xCOIN2222222222222222222222222222222222222",
  "0x3456789012345678901234567890123456789012": "0xCOIN3333333333333333333333333333333333333",
}

export type ZoraCoinConfig = {
  name: string
  symbol: string
  treasury: string
  initialSupply: bigint
}

// Helper function to get factory address for current chain
export function getZoraFactoryAddress(chainId: number): string | undefined {
  return ZORA_CONTRACTS[chainId as keyof typeof ZORA_CONTRACTS]?.coinFactory
}

// Helper function to check if chain is supported
export function isSupportedChain(chainId: number): boolean {
  return chainId in ZORA_CONTRACTS
}

// Constants for Zora Protocol
export const ZORA_CONSTANTS = {
  // Minimum creation fee (may vary based on network conditions)
  MIN_CREATION_FEE: "0.000777", // ETH
  
  // Default initial supply for new coins
  DEFAULT_INITIAL_SUPPLY: "1000",
  
  // Protocol fee percentage (built into bonding curve)
  PROTOCOL_FEE_BPS: 250, // 2.5%
  
  // Treasury fee percentage
  TREASURY_FEE_BPS: 250, // 2.5%
} as const