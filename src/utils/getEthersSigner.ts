import { ethers } from 'ethers';

export function getEthersSigner(): ethers.Signer | null {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    return provider.getSigner();
  }
  return null;
}
