import { useWriteContract, useReadContract, useWaitForTransactionReceipt, useAccount, useChainId, usePublicClient, useWalletClient } from 'wagmi'
import { parseEther, formatEther, Address } from 'viem'
import toast from 'react-hot-toast'
import { 
  ZORA_COIN_V4_ABI, 
  ZORA_COIN_FACTORY_ABI, 
  ZORA_CONTRACTS, 
  CREATOR_COINS,
  getZoraFactoryAddress,
  isSupportedChain,
  ZORA_CONSTANTS
} from '@/contracts/zoraCoin'

export function useZoraCoin(creatorAddress?: string) {
  const { address: userAddress } = useAccount()
  const chainId = useChainId()
  const { writeContractAsync, isPending } = useWriteContract()
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()
  const isChainSupported = isSupportedChain(chainId)
  
  // Get the creator's coin contract address
  const coinAddress = creatorAddress ? CREATOR_COINS[creatorAddress] : undefined
  
  // Expose the loading state
  const isLoading = isPending

  // Read coin information
  const { data: coinName } = useReadContract({
    address: coinAddress as Address,
    abi: ZORA_COIN_V4_ABI,
    functionName: 'name',
    query: { enabled: !!coinAddress && isChainSupported }
  })

  const { data: coinSymbol } = useReadContract({
    address: coinAddress as Address,
    abi: ZORA_COIN_V4_ABI,
    functionName: 'symbol',
    query: { enabled: !!coinAddress && isChainSupported }
  })

  const { data: totalSupply } = useReadContract({
    address: coinAddress as Address,
    abi: ZORA_COIN_V4_ABI,
    functionName: 'totalSupply',
    query: { enabled: !!coinAddress && isChainSupported }
  })

  const { data: userBalance } = useReadContract({
    address: coinAddress as Address,
    abi: ZORA_COIN_V4_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!coinAddress && !!userAddress && isChainSupported }
  })

  const { data: treasury } = useReadContract({
    address: coinAddress as Address,
    abi: ZORA_COIN_V4_ABI,
    functionName: 'treasury',
    query: { enabled: !!coinAddress && isChainSupported }
  })

  // Get mint price for a specific amount
  const { data: mintPriceData } = useReadContract({
    address: coinAddress as Address,
    abi: ZORA_COIN_V4_ABI,
    functionName: 'getMintPrice',
    args: [parseEther('1')], // Price for 1 coin
    query: { enabled: !!coinAddress && isChainSupported }
  })

  // Get burn price for a specific amount
  const { data: burnPriceData } = useReadContract({
    address: coinAddress as Address,
    abi: ZORA_COIN_V4_ABI,
    functionName: 'getBurnPrice',
    args: [parseEther('1')], // Price for 1 coin
    query: { enabled: !!coinAddress && isChainSupported }
  })

  // Get mint price for a specific amount (dynamic)
  const getMintPrice = async (amount: string): Promise<bigint | null> => {
    if (!coinAddress || !isChainSupported) return null
    
    try {
      // This would need to be implemented with a separate read call
      // For now, we'll estimate based on the base price
      const basePrice = mintPriceData as bigint
      if (!basePrice) return null
      
      const amountBigInt = parseEther(amount)
      const estimatedPrice = (basePrice * amountBigInt) / parseEther('1')
      
      return estimatedPrice
    } catch (error) {
      console.error('Error getting mint price:', error)
      return null
    }
  }

  // Get burn price for a specific amount (dynamic)
  const getBurnPrice = async (amount: string): Promise<bigint | null> => {
    if (!coinAddress || !isChainSupported) return null
    
    try {
      const basePrice = burnPriceData as bigint
      if (!basePrice) return null
      
      const amountBigInt = parseEther(amount)
      const estimatedPrice = (basePrice * amountBigInt) / parseEther('1')
      
      return estimatedPrice
    } catch (error) {
      console.error('Error getting burn price:', error)
      return null
    }
  }

  // Mint creator coins (buy bonds)
  const mintBond = async (amount: string) => {
    if (!coinAddress) {
      toast.error('Creator coin not found')
      return
    }

    if (!isChainSupported) {
      toast.error('Please switch to Base or Base Sepolia network')
      return
    }

    if (!userAddress) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      // Get the mint price first
      const mintPrice = await getMintPrice(amount)
      console.log('[Zora SDK] walletClient:', walletClient)
      if (!walletClient || !walletClient.signer) {
        toast.error('Wallet not connected or signer unavailable')
        throw new Error('Wallet not connected or signer unavailable')
      }
      // Log the type of signer for debugging
      console.log('[Zora SDK] walletClient.signer:', walletClient.signer)
      if (typeof walletClient.signer !== 'object' || !walletClient.signer._isSigner) {
        toast.error('Signer is missing or not a valid ethers.js Signer. Please connect your wallet using MetaMask or a compatible provider.')
        throw new Error('Signer is missing or not a valid ethers.js Signer.')
      }
      await writeContract({
        address: coinAddress as Address,
        abi: ZORA_COIN_V4_ABI,
        functionName: 'mint',
        args: [userAddress as Address, parseEther(amount)],
        value: mintPrice,
      })
      
      toast.success('Bond purchase initiated!')
    } catch (error) {
      console.error('Error minting bond:', error)
      toast.error('Failed to purchase bond')
    }
  }

  // Burn creator coins (sell bonds)
  const burnBond = async (amount: string) => {
    if (!coinAddress) {
      toast.error('Creator coin not found')
      return
    }

    if (!isChainSupported) {
      toast.error('Please switch to Base or Base Sepolia network')
      return
    }

    try {
      const { getEthersSigner } = await import('@/utils/getEthersSigner');
      const signer = getEthersSigner();
      if (!signer) {
        toast.error('No valid wallet signer found. Please connect MetaMask or a compatible wallet.')
        throw new Error('No valid wallet signer found.')
      }
      await writeContract({
        address: coinAddress as Address,
        abi: ZORA_COIN_V4_ABI,
        functionName: 'burn',
        args: [parseEther(amount)],
      })
      
      toast.success('Bond sale initiated!')
    } catch (error) {
      console.error('Error burning bond:', error)
      toast.error('Failed to sell bond')
    }
  }

  // Create a new creator coin
  /**
   * Creates a new creator coin using the Zora Coins SDK and returns coin info
   * @returns {Promise<{ coinAddress: string, explorerUrl: string, version: string, pool: string } | null>}
   */
  const createCreatorCoin = async (config: {
    name: string
    symbol: string
    treasury: string
    initialSupply: string
    uri: string
    platformReferrer?: string
  }): Promise<{ coinAddress: string, explorerUrl: string, version: string, pool: string } | null> => {
    console.log('createCreatorCoin: function called');
    console.group('createCreatorCoin')
    try {
      // Input validation
      if (!config.name?.trim() || !config.symbol?.trim() || !config.treasury || !config.initialSupply) {
        const errorMsg = 'All fields are required'
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }

      // Clean and validate name
      const cleanName = config.name.trim()
      if (cleanName.length < 3 || cleanName.length > 32) {
        const errorMsg = 'Name must be between 3 and 32 characters'
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }

      // Clean and validate symbol
      const cleanSymbol = config.symbol.trim().toUpperCase()
      if (!/^[A-Z0-9]{3,10}$/.test(cleanSymbol)) {
        const errorMsg = 'Symbol must be 3-10 alphanumeric characters (A-Z, 0-9)'
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }

      // Validate initial supply
      const initialSupply = parseEther(config.initialSupply)
      const minSupply = parseEther('1000') // Minimum 1000 tokens
      if (initialSupply < minSupply) {
        const errorMsg = `Initial supply must be at least ${formatEther(minSupply)} tokens`
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }

      const factoryAddress = getZoraFactoryAddress(chainId)
      
      // Calculate creation fee with 50% buffer for safety (declare only once)
      const creationFee = parseEther(ZORA_CONSTANTS.MIN_CREATION_FEE);
      const value = (creationFee * 150n) / 100n; // Add 50% buffer
      const minValue = parseEther(ZORA_CONSTANTS.MIN_CREATION_FEE);

      // Log all transaction parameters for debugging
      console.log('[Zora Debug] Attempting to create coin with:', {
        name: cleanName,
        symbol: cleanSymbol,
        treasury: config.treasury,
        initialSupply: initialSupply.toString(),
        value: value.toString(),
        minValue: minValue.toString(),
        chainId,
        factoryAddress,
        isChainSupported,
        userAddress
      });

      // Check for obviously wrong or missing factory address
      if (!factoryAddress || factoryAddress === '0x...' || factoryAddress.length !== 42) {
        const errorMsg = `Zora CoinV4 Factory address is missing or invalid for chainId ${chainId}. Please check your configuration.`
        console.error(errorMsg)
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }

      if (!isChainSupported) {
        const errorMsg = 'Please switch to Base or Base Sepolia network'
        console.error(errorMsg)
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }

      if (!userAddress) {
        const errorMsg = 'Please connect your wallet'
        toast.error(errorMsg)
        throw new Error(errorMsg)
      }

      // Use the new Zora Coins SDK utility
      if (!walletClient || !publicClient) {
        toast.error('Wallet client or public client not available')
        throw new Error('Wallet client or public client not available')
      }
      const { createCoinWithSdk } = await import('@/utils/zoraCoinSdk');
      const coinParams = {
        name: cleanName,
        symbol: cleanSymbol,
        uri: config.uri,
        payoutRecipient: config.treasury,
        platformReferrer: config.platformReferrer || '0x0000000000000000000000000000000000000000',
        initialPurchaseWei: parseEther(config.initialSupply),
        version: 'v4',
      };
      const result = await createCoinWithSdk(coinParams, walletClient, publicClient, chainId);
      if (!result || !result.address) {
        toast.error('Coin creation failed or address not found in SDK result.');
        return null;
      }
      toast.success('Creator coin created!');
      return {
        coinAddress: result.address,
        explorerUrl: result.explorerUrl,
        version: result.version,
        pool: result.pool,
      };

    } catch (error: any) {
      console.error('Error in createCreatorCoin:', error)
      
      // More specific error messages
      let errorMessage = 'Failed to create creator coin'
      
      if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for creation fee and gas. Please ensure you have enough ETH.'
      } else if (error.message?.includes('revert') || error.message?.includes('reverted')) {
        // Try to extract revert reason if available
        const revertReasonMatch = error.message.match(/reason: ([^\n]+)/)
        errorMessage = revertReasonMatch 
          ? `Transaction reverted: ${revertReasonMatch[1]}`
          : 'Transaction reverted. The contract may have rejected the transaction.'
      } else if (error.code === 4001) {
        errorMessage = 'Transaction was rejected by user'
      } else if (error.code === -32603) {
        errorMessage = 'Internal JSON-RPC error. Check your network connection.'
      } else if (error.details) {
        errorMessage = error.details
      } else if (error.message) {
        errorMessage = error.message
      }
      
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        code: error.code,
        data: error.data,
        stack: error.stack
      })
      
      toast.error(errorMessage)
      throw error // Re-throw to allow the UI to handle the error state
    } finally {
      console.groupEnd()
    }
  }

  return {
    // Contract data
    coinAddress,
    coinName: coinName as string | undefined,
    coinSymbol: coinSymbol as string | undefined,
    totalSupply: totalSupply ? formatEther(totalSupply) : '0',
    userBalance: userBalance ? formatEther(userBalance) : '0',
    treasury: treasury as string | undefined,
    mintPrice: mintPriceData ? formatEther(mintPriceData) : '0',
    burnPrice: burnPriceData ? formatEther(burnPriceData) : '0',
    
    // Chain support
    isChainSupported,
    supportedChains: Object.keys(ZORA_CONTRACTS).map(Number),
    
    // Functions
    mintBond,
    burnBond,
    createCreatorCoin,
    getMintPrice,
    getBurnPrice,
    
    // Loading state
    isLoading,
    isPending: isPending,
    isSuccess: false
  }
}

// Hook for managing multiple creator coins
export function useCreatorCoins() {
  const chainId = useChainId()
  
  // Get all creator coins for the current network
  const getCreatorCoins = () => {
    return Object.entries(CREATOR_COINS).map(([creatorAddress, coinAddress]) => ({
      creatorAddress,
      coinAddress
    }))
  }

  // Check if a creator has a coin
  const hasCreatorCoin = (creatorAddress: string) => {
    return !!CREATOR_COINS[creatorAddress]
  }

  // Get coin address for a creator
  const getCreatorCoinAddress = (creatorAddress: string) => {
    return CREATOR_COINS[creatorAddress]
  }

  // Add a new creator coin to the registry
  const addCreatorCoin = (creatorAddress: string, coinAddress: string) => {
    CREATOR_COINS[creatorAddress] = coinAddress
  }

  return {
    getCreatorCoins,
    hasCreatorCoin,
    getCreatorCoinAddress,
    addCreatorCoin,
    supportedChains: Object.keys(ZORA_CONTRACTS).map(Number),
    isChainSupported: isSupportedChain(chainId),
    factoryAddress: getZoraFactoryAddress(chainId)
  }
}