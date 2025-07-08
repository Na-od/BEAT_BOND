import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Star, Zap, AlertCircle, Coins } from 'lucide-react'
import { useZoraCoin } from '@/hooks/useZoraCoin'
import { formatEther } from 'viem'
import toast from 'react-hot-toast'

interface BondPurchaseModalProps {
  creator: any
  tier: any
  onClose: () => void
}

export function BondPurchaseModal({ creator, tier, onClose }: BondPurchaseModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [mintPrice, setMintPrice] = useState<bigint | null>(null)
  const { 
    mintBond, 
    getMintPrice, 
    isPending, 
    coinName, 
    coinSymbol,
    coinAddress 
  } = useZoraCoin(creator.address)

  // Calculate mint price when quantity changes
  useEffect(() => {
    const calculatePrice = async () => {
      if (quantity > 0) {
        const price = await getMintPrice(quantity.toString())
        setMintPrice(price)
      }
    }
    calculatePrice()
  }, [quantity, getMintPrice])

  const handlePurchase = async () => {
    if (isPending || !mintPrice) return

    try {
      await mintBond(quantity.toString())
      toast.success(`Successfully purchased ${quantity} ${coinSymbol || 'creator coins'}!`)
      onClose()
    } catch (error) {
      console.error('Purchase failed:', error)
      toast.error('Purchase failed. Please try again.')
    }
  }

  const estimatedGas = 0.002 // Mock gas estimate
  const totalCost = mintPrice ? Number(formatEther(mintPrice)) + estimatedGas : estimatedGas

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div>
            <h2 className="text-xl font-display font-bold text-neutral-900">
              Purchase Creator Coins
            </h2>
            <p className="text-sm text-neutral-600">
              Buy {coinSymbol || 'creator coins'} via Zora Protocol
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors duration-200"
          >
            <X className="w-4 h-4 text-neutral-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Creator Info */}
          <div className="flex items-center space-x-3">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-semibold text-neutral-900">{creator.name}</div>
              <div className="text-sm text-neutral-600">{creator.category}</div>
            </div>
          </div>

          {/* Coin Info */}
          <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
            <div className="flex items-center space-x-2 mb-3">
              <Coins className="w-5 h-5 text-primary-600" />
              <h3 className="font-semibold text-primary-900">
                {coinName || 'Creator Coin'}
              </h3>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-primary-700">Symbol:</span>
                <span className="font-medium text-primary-900">{coinSymbol || 'COIN'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-700">Contract:</span>
                <span className="font-mono text-xs text-primary-900">
                  {coinAddress ? `${coinAddress.slice(0, 6)}...${coinAddress.slice(-4)}` : 'Not deployed'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-primary-700">Protocol:</span>
                <span className="font-medium text-primary-900">Zora CoinV4</span>
              </div>
            </div>
          </div>

          {/* Tier Benefits */}
          <div className={`p-4 rounded-lg bg-gradient-to-r ${tier.color} bg-opacity-10 border border-opacity-20`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-neutral-900">{tier.name} Tier Benefits</h3>
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${tier.color}`} />
            </div>
            
            <div className="space-y-1">
              {tier.benefits.slice(0, 3).map((benefit: string, i: number) => (
                <div key={i} className="flex items-center space-x-2 text-sm text-neutral-600">
                  <Star className="w-3 h-3 text-primary-500" />
                  <span>{benefit}</span>
                </div>
              ))}
              {tier.benefits.length > 3 && (
                <div className="text-xs text-primary-600 mt-2">
                  +{tier.benefits.length - 3} more benefits
                </div>
              )}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Quantity
            </label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-lg border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 transition-colors duration-200"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="input text-center w-20"
                min="1"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-lg border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 transition-colors duration-200"
              >
                +
              </button>
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Price determined by Zora bonding curve
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Coin Quantity</span>
              <span className="text-neutral-900">{quantity} {coinSymbol || 'COIN'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Mint Price</span>
              <span className="text-neutral-900">
                {mintPrice ? `${formatEther(mintPrice)} ETH` : 'Calculating...'}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Estimated Gas</span>
              <span className="text-neutral-900">{estimatedGas} ETH</span>
            </div>
            <div className="border-t border-neutral-200 pt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-neutral-900">Total</span>
                <span className="text-neutral-900">{totalCost.toFixed(6)} ETH</span>
              </div>
            </div>
          </div>

          {/* Zora Protocol Info */}
          <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700">
              <strong>Zora CoinV4:</strong> Prices are determined by an automated bonding curve. 
              Early supporters get better prices, and creators earn from every transaction.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 space-y-3">
          <button
            onClick={handlePurchase}
            disabled={isPending || !mintPrice}
            className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Purchase {quantity} Coin{quantity > 1 ? 's' : ''}</span>
              </div>
            )}
          </button>
          
          <button
            onClick={onClose}
            className="w-full btn-secondary justify-center"
            disabled={isPending}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}