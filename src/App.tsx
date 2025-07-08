import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { Toaster } from 'react-hot-toast'
import { config } from './config/wagmi'
import { Navbar } from './components/layout/Navbar'
import { HomePage } from './pages/HomePage'
import { CreatorDashboard } from './pages/CreatorDashboard'
import { BondMarketplace } from './pages/BondMarketplace'
import { CreatorProfile } from './pages/CreatorProfile'
import CoinDetailPage from './pages/coin/[coinId]'
import ErrorBoundary from './components/ErrorBoundary'

import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

function App() {
  console.log('App: Rendering with config:', config);
  
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {console.log('RainbowKitProvider: Initialized')}
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
              <Navbar />
              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/creator-dashboard" element={<CreatorDashboard />} />
                  <Route path="/marketplace" element={<BondMarketplace />} />
                  <Route path="/creator/:address" element={<CreatorProfile />} />
                  <Route path="/coin/:coinId" element={<CoinDetailPage />} />
                </Routes>
              </main>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </div>
          </Router>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App