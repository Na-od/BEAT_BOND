import { Address } from 'viem';

// This would come from your environment variables or configuration
// Use environment variables for contract addresses
export const ZORA_COIN_FACTORY_ADDRESS = (
  import.meta.env.VITE_ZORA_COIN_FACTORY_ADDRESS || process.env.NEXT_PUBLIC_ZORA_COIN_FACTORY_ADDRESS
) as Address;

export const ZORA_NFT_CREATOR_ADDRESS = (
  import.meta.env.VITE_ZORA_NFT_CREATOR_ADDRESS || process.env.NEXT_PUBLIC_ZORA_NFT_CREATOR_ADDRESS
) as Address;


// Helper function to get Zora coin address for a creator
// In a real app, this would query the factory contract
export function getZoraCoinAddress(creatorAddress: string): Address {
  // This is a mock implementation
  // In a real app, you would query the factory contract
  return `0x${creatorAddress.slice(2, 42)}` as Address;
}

// Helper function to format bond data for display
export function formatBondValue(value: number, decimals = 2): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals,
  });
}

// Helper function to format currency values
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Helper function to format percentage values
export function formatPercentage(value: number, decimals = 2): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}
