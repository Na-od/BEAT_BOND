import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base, baseSepolia } from 'wagmi/chains'

console.log('Configuring Wagmi with chains:', { base, baseSepolia });

const config = getDefaultConfig({
  appName: 'Beat Bond',
  // Use environment variable for WalletConnect project ID (Vite or Next.js)
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || (() => { throw new Error('No WalletConnect projectId found. Please set VITE_WALLETCONNECT_PROJECT_ID in your .env file.'); })(),
  chains: [base, baseSepolia],
  ssr: false,
});

console.log('Wagmi config created:', config);

export { config };