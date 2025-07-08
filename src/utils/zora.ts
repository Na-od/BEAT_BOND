import { Chain } from 'viem/chains';

export const ZORA_MAINNET_CHAIN_ID = 7777777;
export const ZORA_TESTNET_CHAIN_ID = 999;

export interface ZoraChainInfo {
  id: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
}

export const ZORA_CHAINS: Record<number, ZoraChainInfo> = {
  1: {
    id: 1,
    name: 'Ethereum',
    rpcUrl: 'https://ethereum.rpc.thirdweb.com',
    blockExplorer: 'https://etherscan.io',
  },
  10: {
    id: 10,
    name: 'Optimism',
    rpcUrl: 'https://optimism.rpc.thirdweb.com',
    blockExplorer: 'https://optimistic.etherscan.io',
  },
  7777777: {
    id: 7777777,
    name: 'Zora',
    // Use env vars if provided, fallback to default
    rpcUrl: import.meta.env.VITE_ZORA_RPC_URL || 'https://rpc.zora.energy',
    blockExplorer: import.meta.env.VITE_ZORA_BLOCK_EXPLORER || 'https://explorer.zora.energy',
  },
  999: {
    id: 999,
    name: 'Zora Testnet',
    // Use env vars if provided, fallback to default
    rpcUrl: import.meta.env.VITE_ZORA_TESTNET_RPC_URL || 'https://testnet.rpc.zora.energy',
    blockExplorer: import.meta.env.VITE_ZORA_TESTNET_BLOCK_EXPLORER || 'https://testnet.explorer.zora.energy',
  },
  8453: {
    id: 8453,
    name: 'Base',
    rpcUrl: 'https://base.rpc.thirdweb.com',
    blockExplorer: 'https://basescan.org',
  },
};

export function getZoraChainFromViemChain(chainId: number): ZoraChainInfo | undefined {
  return ZORA_CHAINS[chainId as keyof typeof ZORA_CHAINS];
}

export function isZoraChain(chainId: number): boolean {
  return [1, 10, 7777777, 999, 8453].includes(chainId);
}

export function getZoraChainRpcUrl(chainId: number): string {
  return getZoraChainFromViemChain(chainId)?.rpcUrl || '';
}

export function getZoraChainBlockExplorer(chainId: number): string {
  return getZoraChainFromViemChain(chainId)?.blockExplorer || '';
}

export function getZoraChainName(chainId: number): string {
  return getZoraChainFromViemChain(chainId)?.name || 'Unknown';
}
