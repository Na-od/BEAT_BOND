import { ZoraProtocolSDK } from '@zoralabs/protocol-sdk'
import { ethers } from 'ethers'

// This utility initializes the Zora SDK with the user's signer
// Call getZoraSdk(signer) to get an SDK instance

export function getZoraSdk(signer: ethers.Signer) {
  return new ZoraProtocolSDK({ signer })
}

// Helper for coin creation
export async function createCreatorCoinWithSdk({ signer, name, symbol, initialSupply, treasury }) {
  const sdk = getZoraSdk(signer)
  // The SDK will validate parameters and send the transaction
  // initialSupply must be a string or BigNumber
  return sdk.erc20.createCreatorCoin({
    name,
    symbol,
    initialSupply,
    treasuryAddress: treasury,
  })
}
