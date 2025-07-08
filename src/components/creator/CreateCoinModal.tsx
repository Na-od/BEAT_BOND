import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Coins, AlertCircle, Info, ExternalLink } from 'lucide-react'
import { useZoraCoin } from '@/hooks/useZoraCoin'
import { useAccount, useChainId, usePublicClient } from 'wagmi'
import { ZORA_CONSTANTS, isSupportedChain } from '@/contracts/zoraCoin'
import toast from 'react-hot-toast'

interface CreateCoinModalProps {
  onClose: () => void
}

export function CreateCoinModal({ onClose }: CreateCoinModalProps) {
  const [showMetadataModal, setShowMetadataModal] = useState(false)
  const [metadataJson, setMetadataJson] = useState('')
  const [formErrors, setFormErrors] = useState<{[k: string]: string}>({})
  const { address } = useAccount()
  const chainId = useChainId()
  const { createCreatorCoin, isPending, isChainSupported } = useZoraCoin()
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    initialSupply: ZORA_CONSTANTS.DEFAULT_INITIAL_SUPPLY,
    uri: '',
    platformReferrer: '',
    image: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Inline validation helper
  const validateField = (field: string, value: string) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 3 || value.trim().length > 32) return 'Name must be 3-32 characters';
        return '';
      case 'symbol':
        if (!value.trim()) return 'Symbol is required';
        if (!/^[A-Z0-9]{3,10}$/.test(value.trim().toUpperCase())) return 'Symbol must be 3-10 uppercase letters or numbers';
        return '';
      case 'initialSupply':
        if (!value.trim()) return 'Initial supply is required';
        if (isNaN(Number(value)) || Number(value) <= 0) return 'Initial supply must be a positive number';
        if (Number(value) > 1e18) return 'Initial supply too large';
        return '';
      case 'uri':
        if (!value.trim()) return 'Metadata URI is required';
        if (!/^ipfs:\/\/[a-zA-Z0-9]+$/.test(value.trim()) && !/^https?:\/\//.test(value.trim())) return 'Must be a valid IPFS or HTTPS URI';
        return '';
      case 'platformReferrer':
        if (value.trim() && !/^0x[a-fA-F0-9]{40}$/.test(value.trim())) return 'Must be a valid Ethereum address';
        return '';
      default:
        return '';
    }
  };

  // Validate all fields
  const validateAll = () => {
    const errors: {[k: string]: string} = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, (formData as any)[key]);
      if (err) errors[key] = err;
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Metadata JSON generator
  const generateMetadataJson = () => {
    const json = {
      name: formData.name || 'My Awesome Coin',
      symbol: formData.symbol || 'COIN',
      description: 'This is my community coin on Zora.',
      image: formData.image || 'ipfs://<your-image-cid>',
      external_url: 'https://yourwebsite.com'
    };
    setMetadataJson(JSON.stringify(json, null, 2));
    setShowMetadataModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation
    if (!validateAll()) {
      toast.error('Please fix form errors')
      return
    }

    // Trim and clean inputs
    const cleanName = formData.name.trim()
    const cleanSymbol = formData.symbol.trim().toUpperCase()
    
    // Additional client-side validation
    if (cleanName.length < 3 || cleanName.length > 32) {
      toast.error('Name must be between 3 and 32 characters')
      return
    }
    
    if (!/^[A-Z0-9]{3,10}$/.test(cleanSymbol)) {
      toast.error('Symbol must be 3-10 alphanumeric characters (A-Z, 0-9)')
      return
    }

    if (!address) {
      toast.error('Please connect your wallet')
      return
    }

    if (!isChainSupported) {
      toast.error('Please switch to Base or Base Sepolia network')
      return
    }

    let loadingToast: string | null = null
    
    try {
      // Show loading state
      loadingToast = toast.loading(
        <div>
          <div>Processing transaction...</div>
          <div className="text-sm text-gray-500">Please confirm in your wallet</div>
        </div>,
        { duration: Infinity }
      )
      
      // Create the coin and get the address and explorer link
      const result = await createCreatorCoin({
        name: cleanName,
        symbol: cleanSymbol,
        treasury: address,
        initialSupply: formData.initialSupply,
        uri: formData.uri.trim(),
        platformReferrer: formData.platformReferrer?.trim() || undefined
      })
      
      if (!result || !result.coinAddress || !result.explorerUrl) {
        throw new Error('Coin address or explorer URL not returned')
      }
      // Compose pool explorer link if pool address present
      let poolLink = ''
      if (result.pool && result.pool !== '0x0000000000000000000000000000000000000000') {
        if (chainId === 84532) {
          poolLink = `https://testnet.zora.co/address/${result.pool}`
        } else if (chainId === 8453) {
          poolLink = `https://zora.co/address/${result.pool}`
        }
      }
      
      // Show loading toast with explorer link
      toast.loading(
        <div>
          <div>Transaction submitted!</div>
          <div className="text-sm text-gray-500">Waiting for confirmation...</div>
          <a 
            href={result.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm inline-flex items-center mt-1"
            onClick={(e) => e.stopPropagation()}
          >
            View on Zora <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>,
        { 
          id: loadingToast,
          duration: 10000
        }
      )
      
      // Show success toast with version, pool, and explorer link
      toast.success(
        <div>
          <div>Creator coin created successfully!</div>
          <div className="text-xs text-gray-500 mt-1">Version: {result.version?.toUpperCase() || 'N/A'}</div>
          {poolLink && (
            <div className="text-xs text-gray-500 mt-1">
              Pool: <a href={poolLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{result.pool}</a>
            </div>
          )}
          <a 
            href={result.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm inline-flex items-center mt-2"
            onClick={(e) => e.stopPropagation()}
          >
            View on Zora <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>,
        { duration: 12000 }
      )

      // Save coin to localStorage for display in marketplace/fans page
      try {
        const { saveCoinToLocal } = await import('@/utils/localCoins');
        saveCoinToLocal({
          creator: address,
          address: result.coinAddress,
          uri: formData.uri.trim(),
          symbol: cleanSymbol,
          name: cleanName,
          version: result.version,
          pool: result.pool,
          explorerUrl: result.explorerUrl, // Save the Zora link
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error('Failed to save coin to local:', err);
      }
      
      // Close the modal after a short delay
      setTimeout(() => {
        onClose()
      }, 2000)
      
      // Optionally, refresh the creator coins list or trigger a callback
      if (typeof onSuccess === 'function') {
        onSuccess()
      }

      
    } catch (error: any) {
      console.error('Error in form submission:', error)
      
      // Don't show duplicate error messages (they're already shown in the hook)
      if (!error.message?.includes('User rejected') && 
          !error.message?.includes('rejected transaction') &&
          !error.message?.includes('User denied')) {
            
        toast.error(
          <div>
            <div>Failed to create creator coin</div>
            <div className="text-sm text-red-200">
              {error.message || 'Unknown error occurred'}
            </div>
          </div>,
          { duration: 10000 }
        )
      }
    } finally {
      if (loadingToast) {
        toast.dismiss(loadingToast)
      }
      setIsLoading(false)
    }
  }

  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 8453: return 'Base Mainnet'
      case 84532: return 'Base Sepolia'
      default: return 'Unknown Network'
    }
  }

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
              Create Creator Coin
            </h2>
            <p className="text-sm text-neutral-600">
              Launch your own Zora CoinV4 token
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Coin Image Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Coin Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="input"
              disabled={!isChainSupported}
              onChange={async (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) return;
                // Upload to Pinata
                try {
                  toast.loading('Uploading image to Pinata...', { id: 'pinata-image' })
                  const jwt = import.meta.env.VITE_PINATA_JWT
                  if (!jwt) throw new Error('Pinata JWT missing in .env')
                  const { uploadJsonToPinata } = await import('../../utils/pinataUpload')
                  // Pinata image upload expects a FormData, so let's use fetch directly
                  const form = new FormData()
                  form.append('file', file)
                  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${jwt}` },
                    body: form
                  })
                  if (!res.ok) throw new Error('Failed to upload image')
                  const data = await res.json()
                  const ipfsUri = `ipfs://${data.IpfsHash}`
                  setFormData(f => ({ ...f, image: ipfsUri }))
                  toast.success('Image uploaded!', { id: 'pinata-image' })
                } catch (err: any) {
                  toast.error('Image upload failed: ' + (err.message || err), { id: 'pinata-image' })
                }
              }}
            />
            {formData.image && (
              <div className="mt-2">
                <img src={`https://ipfs.io/ipfs/${formData.image.replace('ipfs://','')}`} alt="Coin preview" className="w-24 h-24 rounded object-cover border" />
                <div className="text-xs text-neutral-500 mt-1">{formData.image}</div>
              </div>
            )}
          </div>

          {/* Network Check */}
          {!isChainSupported ? (
            <div className="flex items-start space-x-3 p-4 bg-error-50 border border-error-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-error-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-error-700">
                <strong>Unsupported Network:</strong> Please switch to Base or Base Sepolia 
                <strong>Unsupported Network:</strong> Please switch to Base Mainnet or Base Sepolia 
                to create a Zora CoinV4 token. Current network: {getNetworkName(chainId)}
              </div>
            </div>
          ) : (
            <div className="flex items-start space-x-3 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <Info className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-primary-700">
                <strong>Zora CoinV4 Integration:</strong> Your creator coin will be deployed using Zora's 
                bonding curve protocol on {getNetworkName(chainId)}, enabling automatic pricing and treasury management.
              </div>
            </div>
          )}

          {/* Coin Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Coin Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Luna Beats Coin"
              className={`input ${formErrors.name ? 'border-red-500' : ''}`}
              required
              disabled={!isChainSupported}
            />
            {formErrors.name && (
              <div className="text-xs text-red-500 mt-1">{formErrors.name}</div>
            )}
          </div>

          {/* Coin Symbol */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Coin Symbol *
            </label>
            <input
              type="text"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
              placeholder="e.g., LUNA"
              className={`input ${formErrors.symbol ? 'border-red-500' : ''}`}
              maxLength={10}
              required
              disabled={!isChainSupported}
            />
            <div className="text-xs text-neutral-500 mt-1">
              3-10 characters, will be converted to uppercase
            </div>
            {formErrors.symbol && (
              <div className="text-xs text-red-500 mt-1">{formErrors.symbol}</div>
            )}
          </div>

          {/* Initial Supply */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Initial Supply
            </label>
            <input
              type="number"
              value={formData.initialSupply}
              onChange={(e) => setFormData({ ...formData, initialSupply: e.target.value })}
              placeholder={ZORA_CONSTANTS.DEFAULT_INITIAL_SUPPLY}
              className={`input ${formErrors.initialSupply ? 'border-red-500' : ''}`}
              min="1"
              step="1"
              disabled={!isChainSupported}
            />
            <div className="text-xs text-neutral-500 mt-1">
              Number of coins to mint initially to your treasury
            </div>
            {formErrors.initialSupply && (
              <div className="text-xs text-red-500 mt-1">{formErrors.initialSupply}</div>
            )}
          </div>

          {/* Metadata URI */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Metadata URI
              <button
                type="button"
                className="ml-2 text-xs text-blue-600 underline"
                onClick={generateMetadataJson}
              >
                Generate
              </button>
            </label>
            <input
              type="text"
              className={`input ${formErrors.uri ? 'border-red-500' : ''}`}
              value={formData.uri}
              onChange={e => {
                setFormData(f => ({ ...f, uri: e.target.value }))
                setFormErrors(fe => ({ ...fe, uri: validateField('uri', e.target.value) }))
              }}
              placeholder="ipfs://... or https://..."
            />
            {formErrors.uri && (
              <div className="text-xs text-red-500 mt-1">{formErrors.uri}</div>
            )}
          </div>

          {/* Platform Referrer */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Platform Referrer <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              className={`input ${formErrors.platformReferrer ? 'border-red-500' : ''}`}
              value={formData.platformReferrer}
              onChange={e => {
                setFormData(f => ({ ...f, platformReferrer: e.target.value }))
                setFormErrors(fe => ({ ...fe, platformReferrer: validateField('platformReferrer', e.target.value) }))
              }}
              placeholder="0x..."
            />
            {formErrors.platformReferrer && (
              <div className="text-xs text-red-500 mt-1">{formErrors.platformReferrer}</div>
            )}
          </div>

          {/* Treasury Info */}
          <div className="bg-neutral-50 rounded-lg p-4">
            <h4 className="font-medium text-neutral-900 mb-2">Treasury Configuration</h4>
            <div className="text-sm text-neutral-600 space-y-1">
              <div><strong>Treasury Address:</strong> {address || 'Not connected'}</div>
              <div><strong>Revenue Share:</strong> Automatic via Zora bonding curve</div>
              <div><strong>Protocol Fee:</strong> {ZORA_CONSTANTS.PROTOCOL_FEE_BPS / 100}%</div>
              <div><strong>Treasury Fee:</strong> {ZORA_CONSTANTS.TREASURY_FEE_BPS / 100}%</div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Creation Fee</span>
              <span className="text-neutral-900">{ZORA_CONSTANTS.MIN_CREATION_FEE} ETH</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Gas Fee</span>
              <span className="text-neutral-900">~0.002 ETH</span>
            </div>
            <div className="border-t border-neutral-200 pt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-neutral-900">Total Cost</span>
                <span className="text-neutral-900">~{(parseFloat(ZORA_CONSTANTS.MIN_CREATION_FEE) + 0.002).toFixed(6)} ETH</span>
              </div>
            </div>
          </div>

          {showMetadataModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowMetadataModal(false)}><X /></button>
              <h3 className="text-lg font-bold mb-2 flex items-center"><Info className="w-4 h-4 mr-1" /> Metadata Template</h3>
              <pre className="bg-gray-100 rounded p-2 text-xs overflow-x-auto mb-2" style={{ maxHeight: 220 }}>{metadataJson}</pre>
              <div className="flex gap-2 justify-end">
                <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={() => {navigator.clipboard.writeText(metadataJson); toast.success('Copied!')}}>Copy</button>
                <button
                  className="bg-green-600 text-white px-4 py-1 rounded disabled:opacity-60"
                  disabled={uploading}
                  onClick={async () => {
                    try {
                      setUploading(true)
                      toast.loading('Uploading to Pinata...', { id: 'pinata' })
                      const jwt = import.meta.env.VITE_PINATA_JWT
                      if (!jwt) throw new Error('Pinata JWT missing in .env')
                      const json = JSON.parse(metadataJson)
                      const { uploadJsonToPinata } = await import('../../utils/pinataUpload')
                      const uri = await uploadJsonToPinata(json, jwt)
                      setShowMetadataModal(false)
                      setFormData(f => ({ ...f, uri }))
                      toast.success('Uploaded! URI copied to form', { id: 'pinata' })
                    } catch (err: any) {
                      toast.error('Pinata upload failed: ' + (err.message || err), { id: 'pinata' })
                    } finally {
                      setUploading(false)
                    }
                  }}
                >{uploading ? 'Uploading...' : 'Upload to IPFS (Pinata)'}</button>
              </div>
            </div>
          </div>
        )}

          {/* Zora Factory Info */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Zora Factory Details</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div><strong>Factory Address:</strong></div>
              <div className="font-mono text-xs break-all">0x777777751622c0d3258f214F9DF38E35BF45baF3</div>
              <div className="flex items-center space-x-2 mt-2">
                <a 
                  href="https://docs.zora.co/coins" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xs flex items-center space-x-1"
                >
                  <span>View Documentation</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start space-x-2 p-3 bg-warning-50 border border-warning-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-warning-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-warning-700">
              <strong>Important:</strong> Once created, your coin cannot be modified. 
              Make sure all details are correct before proceeding. The coin will be deployed 
              on the Zora Protocol with automated bonding curve pricing.
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending || !formData.name || !formData.symbol || !isChainSupported}
            className="w-full btn-primary justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Creating Coin...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Coins className="w-4 h-4" />
                <span>Create Creator Coin</span>
              </div>
            )}
          </button>

          {!isChainSupported && (
            <div className="text-center text-sm text-neutral-500">
              Switch to Base or Base Sepolia to enable coin creation
            </div>
          )}
        </form>
      </motion.div>
    </motion.div>
  )
}