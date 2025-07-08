import { useEffect, useState, useMemo, useCallback } from 'react';
import { useAccount, usePublicClient, useChainId } from 'wagmi';
import { formatEther, createPublicClient, http, Address } from 'viem';
import { mainnet, base, zora } from 'viem/chains';
import { ZoraNFTCreatorV2Abi } from '@zoralabs/zora-721-contracts';
import { ZDK, ZDKNetwork, ZDKChain } from '@zoralabs/zdk';
import { getZoraChainFromViemChain } from '@/utils/zora';

// Types for ZORA SDK response
type ZDKTokenNode = {
  token: {
    tokenId: string;
    collectionAddress: string;
    name?: string | null;
    description?: string | null;
    image?: {
      url?: string;
    } | null;
    collection?: {
      name?: string | null;
      symbol?: string | null;
    } | null;
  };
  marketsSummary?: Array<{
    price?: {
      nativePrice?: {
        decimal: number;
      } | null;
    } | null;
  }>;
};

type ZDKTokensResponse = {
  tokens: {
    nodes: ZDKTokenNode[];
  };
};

// ZORA contract addresses
const ZORA_NFT_CREATOR_V2_ADDRESS = '0xA2c2A96A232113Dd4993E8b048EEbc3371AE8d85'; // Mainnet
const ZORA_1155_FACTORY = '0x7777774baa94a71b47f3fb744e561ba201c9564e'; // Mainnet

export interface BondData {
  id: string;
  creatorAddress: string;
  creatorName: string;
  amount: number;
  purchasePrice: number;
  currentPrice: number;
  change24h: number;
  lastUpdated: Date;
  avatar?: string;
  tier?: string;
  category?: string;
}

export function useBondData() {
  console.log('useBondData: Initializing hook');
  
  const { address: userAddress, isConnected, chain } = useAccount();
  const publicClient = usePublicClient();
  const chainId = useChainId();
  const [bonds, setBonds] = useState<BondData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  console.log('useBondData: User address:', userAddress);
  console.log('useBondData: Is connected:', isConnected);
  console.log('useBondData: Chain ID:', chainId);
  console.log('useBondData: Public client:', publicClient);

  // Initialize ZDK for ZORA API access
  const zdkNetwork = useMemo(() => {
    if (!chainId) return null;
    
    const zoraChain = getZoraChainFromViemChain(chainId);
    if (!zoraChain) return null;
    
    return new ZDKNetwork(
      zoraChain.id === 1 ? ZDKChain.Mainnet : 
      zoraChain.id === 10 ? ZDKChain.Optimism :
      zoraChain.id === 8453 ? ZDKChain.Base :
      zoraChain.id === 999 ? ZDKChain.ZoraTestnet :
      ZDKChain.Zora
    );
  }, [chainId]);

  const zdk = useMemo(() => {
    if (!zdkNetwork) return null;
    
    return new ZDK({
      apiKey: process.env.REACT_APP_ZORA_API_KEY || '',
      network: zdkNetwork,
    });
  }, [zdkNetwork]);

  // Fetch creator tokens for the connected wallet
  const fetchCreatorTokens = useCallback(async (): Promise<BondData[]> => {
    if (!userAddress || !zdk || !publicClient) {
      console.log('fetchCreatorTokens: Missing required parameters');
      return [];
    }

    try {
      console.log('fetchCreatorTokens: Fetching tokens for address:', userAddress);
      
      // Get tokens owned by the user
      const tokensResponse = await zdk.tokens({
        where: {
          ownerAddresses: [userAddress as Address],
          // Filter for ZORA 721 and 1155 tokens
          collectionAddresses: [ZORA_NFT_CREATOR_V2_ADDRESS, ZORA_1155_FACTORY] as [string, string],
        },
        includeFullDetails: true,
        pagination: {
          limit: 50, // Limit to 50 tokens per request
        },
      });

      // Type assertion to handle the response
      const response = tokensResponse as unknown as ZDKTokensResponse;
      console.log('fetchCreatorTokens: Tokens response:', response);

      // Process tokens into BondData format
      const bondsData = response.tokens.nodes
        .filter(node => node.token) // Filter out any null/undefined tokens
        .map((node, index) => {
          const { token } = node;
          const collectionName = token.collection?.name || `Creator ${index + 1}`;
          
          // Try to get price from market data if available
          let currentPrice = 0.01; // Default base price
          if (node.marketsSummary?.[0]?.price?.nativePrice?.decimal) {
            currentPrice = node.marketsSummary[0].price.nativePrice.decimal;
          }
          
          // Calculate price change (mock for now)
          const priceChange = (Math.random() * 10) - 2; // Random change between -2% and +8%
          
          return {
            id: `${token.collectionAddress}-${token.tokenId}`,
            creatorAddress: token.collectionAddress,
            creatorName: collectionName,
            amount: 1, // For ERC-721, amount is always 1
            purchasePrice: currentPrice * (1 - (priceChange / 100)),
            currentPrice,
            change24h: priceChange,
            lastUpdated: new Date(),
            avatar: token.image?.url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${token.collectionAddress}`,
            tier: ['Bronze', 'Silver', 'Gold'][Math.floor(Math.random() * 3)],
            category: collectionName.split(' ')[0] || 'Art',
          };
        });

      return bondsData;
    } catch (err) {
      console.error('Error in fetchCreatorTokens:', err);
      // Return empty array instead of throwing to prevent UI from breaking
      return [];
    }
  }, [userAddress, zdk, publicClient]);

  // Main data fetching function
  const fetchBondData = useCallback(async () => {
    console.log('fetchBondData: Starting to fetch bond data');
    
    // Use mock data in development for now
    if (process.env.NODE_ENV === 'development') {
      console.log('fetchBondData: Using mock data in development');
      try {
        setIsLoading(true);
        const mockData = await fetchMockBonds();
        console.log('fetchBondData: Using mock data:', mockData);
        setBonds(mockData);
        setIsLoading(false);
        return;
      } catch (err) {
        console.error('Error in fetchBondData (mock):', err);
        setError(err instanceof Error ? err : new Error('Failed to load mock data'));
        setIsLoading(false);
        return;
      }
    }
    
    // Real implementation for production
    if (!userAddress) {
      console.log('fetchBondData: No user address, skipping fetch');
      setIsLoading(false);
      return;
    }
    
    if (!publicClient || !zdk) {
      console.error('fetchBondData: No public client or ZDK available');
      setError(new Error('Blockchain client not available'));
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      console.log('fetchBondData: Fetching creator tokens');
      const bondsData = await fetchCreatorTokens();
      console.log('fetchBondData: Fetched bonds data:', bondsData);
      
      setBonds(bondsData);
      setError(null);
    } catch (err) {
      console.error('Error in fetchBondData:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch bond data'));
    } finally {
      setIsLoading(false);
    }
  }, [userAddress, publicClient, zdk, fetchCreatorTokens]);
  
  // Mock data for development
  const fetchMockBonds = useCallback(async (): Promise<BondData[]> => {
    console.log('fetchMockBonds: Returning mock bonds data');
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        resolve([
          {
            id: '1',
            creatorAddress: '0x1234567890123456789012345678901234567890',
            creatorName: 'Demo Creator 1',
            amount: 10,
            purchasePrice: 0.01,
            currentPrice: 0.015,
            change24h: 5.25,
            lastUpdated: new Date(),
            tier: 'Gold',
            category: 'Music',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo1'
          },
          {
            id: '2',
            creatorAddress: '0x2345678901234567890123456789012345678901',
            creatorName: 'Demo Creator 2',
            amount: 5,
            purchasePrice: 0.02,
            currentPrice: 0.025,
            change24h: 2.5,
            lastUpdated: new Date(),
            tier: 'Silver',
            category: 'Art',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo2'
          },
        ]);
      }, 500);
    });
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchBondData();
    
    // Set up polling (every 30 seconds)
    const interval = setInterval(fetchBondData, 30000);
    
    return () => clearInterval(interval);
  }, [fetchBondData]);

  return { bonds, isLoading, error, refresh: fetchBondData };
}

export default useBondData;
