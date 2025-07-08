import { useState } from 'react'
import { useZoraCoin } from '@/hooks/useZoraCoin'
import { useAccount } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import toast from 'react-hot-toast'

export function useBondActions(creatorAddress?: string) {
  const { address } = useAccount()
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  
  const {
    mintBond,
    burnBond,
    getMintPrice,
    getBurnPrice,
    isPending,
    coinAddress,
    coinSymbol,
    userBalance
  } = useZoraCoin(creatorAddress)

  // Purchase bonds (mint coins)
  const handlePurchaseBond = async (amount: string, tierName?: string) => {
    if (!address) {
      toast.error('Please connect your wallet')
      return false
    }

    if (!coinAddress) {
      toast.error('Creator coin not found')
      return false
    }

    try {
      setIsProcessing(true)
      
      // Get current mint price
      const mintPrice = await getMintPrice(amount)
      if (!mintPrice) {
        toast.error('Could not calculate mint price')
        return false
      }

      // Show price confirmation
      const priceInEth = formatEther(mintPrice)
      const confirmed = window.confirm(
        `Purchase ${amount} ${coinSymbol || 'coins'} for ${priceInEth} ETH?`
      )
      
      if (!confirmed) {
        return false
      }

      await mintBond(amount)
      
      toast.success(
        `Successfully purchased ${amount} ${coinSymbol || 'creator coins'}!`
      )
      
      return true
    } catch (error) {
      console.error('Bond purchase failed:', error)
      toast.error('Purchase failed. Please try again.')
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  // Sell bonds (burn coins)
  const handleSellBond = async (amount: string) => {
    if (!address) {
      toast.error('Please connect your wallet')
      return false
    }

    if (!coinAddress) {
      toast.error('Creator coin not found')
      return false
    }

    // Check if user has enough balance
    const userBalanceNum = parseFloat(userBalance)
    const sellAmount = parseFloat(amount)
    
    if (sellAmount > userBalanceNum) {
      toast.error('Insufficient balance')
      return false
    }

    try {
      setIsProcessing(true)
      
      // Get current burn price
      const burnPrice = await getBurnPrice(amount)
      if (!burnPrice) {
        toast.error('Could not calculate sell price')
        return false
      }

      // Show price confirmation
      const priceInEth = formatEther(burnPrice)
      const confirmed = window.confirm(
        `Sell ${amount} ${coinSymbol || 'coins'} for ${priceInEth} ETH?`
      )
      
      if (!confirmed) {
        return false
      }

      await burnBond(amount)
      
      toast.success(
        `Successfully sold ${amount} ${coinSymbol || 'creator coins'}!`
      )
      
      return true
    } catch (error) {
      console.error('Bond sale failed:', error)
      toast.error('Sale failed. Please try again.')
      return false
    } finally {
      setIsProcessing(false)
    }
  }

  // Quick buy preset amounts
  const handleQuickBuy = async (presetAmount: number) => {
    return await handlePurchaseBond(presetAmount.toString())
  }

  // Quick sell preset amounts
  const handleQuickSell = async (presetAmount: number) => {
    return await handleSellBond(presetAmount.toString())
  }

  // Sell all bonds
  const handleSellAll = async () => {
    if (parseFloat(userBalance) === 0) {
      toast.error('No bonds to sell')
      return false
    }
    
    return await handleSellBond(userBalance)
  }

  // Calculate potential returns
  const calculatePotentialReturns = async (amount: string) => {
    try {
      const mintPrice = await getMintPrice(amount)
      const burnPrice = await getBurnPrice(amount)
      
      if (!mintPrice || !burnPrice) return null
      
      const mintPriceEth = parseFloat(formatEther(mintPrice))
      const burnPriceEth = parseFloat(formatEther(burnPrice))
      const spread = mintPriceEth - burnPriceEth
      const spreadPercentage = (spread / mintPriceEth) * 100
      
      return {
        mintPrice: mintPriceEth,
        burnPrice: burnPriceEth,
        spread,
        spreadPercentage
      }
    } catch (error) {
      console.error('Failed to calculate returns:', error)
      return null
    }
  }

  return {
    // Actions
    handlePurchaseBond,
    handleSellBond,
    handleQuickBuy,
    handleQuickSell,
    handleSellAll,
    
    // Calculations
    calculatePotentialReturns,
    
    // State
    isProcessing: isProcessing || isPending,
    selectedTier,
    setSelectedTier,
    quantity,
    setQuantity,
    
    // Coin info
    coinAddress,
    coinSymbol,
    userBalance
  }
}