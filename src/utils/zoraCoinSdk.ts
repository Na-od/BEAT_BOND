import { createCoin } from '@zoralabs/coins-sdk';
import { Address, Hex, PublicClient, WalletClient } from 'viem';

export interface CoinParams {
  name: string;
  symbol: string;
  uri: string;
  payoutRecipient: Address;
  platformReferrer?: Address;
  initialPurchaseWei?: bigint;
  version?: 'v3' | 'v4';
}

export interface CoinCreationResult {
  address: Address;
  version: string;
  pool: Address;
  explorerUrl: string;
}

export async function createCoinWithSdk(
  params: CoinParams,
  walletClient: WalletClient,
  publicClient: PublicClient,
  chainId: number
): Promise<CoinCreationResult> {
  const result = await createCoin(params, walletClient, publicClient);
  let explorerUrl = '';
  if (chainId === 84532) {
    explorerUrl = `https://testnet.zora.co/coin/bsep:${result.address}`;
  } else if (chainId === 8453) {
    explorerUrl = `https://zora.co/coin/base:${result.address}`;
  }
  return {
    address: result.address,
    version: result.version,
    pool: result.pool,
    explorerUrl,
  };
}
