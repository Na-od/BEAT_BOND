import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, DollarSign, Star, Plus, Settings, Coins } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useZoraCoin, useCreatorCoins } from '@/hooks/useZoraCoin'
import { useAccount } from 'wagmi'
import { CreateCoinModal } from '@/components/creator/CreateCoinModal'

const revenueData = [
  { month: 'Jan', revenue: 2400, bonds: 120 },
  { month: 'Feb', revenue: 3200, bonds: 180 },
  { month: 'Mar', revenue: 2800, bonds: 150 },
  { month: 'Apr', revenue: 4100, bonds: 220 },
  { month: 'May', revenue: 3800, bonds: 200 },
  { month: 'Jun', revenue: 5200, bonds: 280 },
]

export function CreatorDashboard() {
  const { address } = useAccount()
  const { hasCreatorCoin, getCreatorCoinAddress } = useCreatorCoins()
  const [showCreateCoinModal, setShowCreateCoinModal] = useState(false)
  
  // Check if current user has a creator coin
  const userHasCoin = address ? hasCreatorCoin(address) : false
  const userCoinAddress = address ? getCreatorCoinAddress(address) : undefined
  
  // Get coin data if user has one
  const { 
    coinName, 
    coinSymbol, 
    totalSupply, 
    userBalance,
    treasury 
  } = useZoraCoin(address)

  const stats = [
    {
      label: 'Total Revenue',
      value: userHasCoin ? '$12,450' : '$0',
      change: userHasCoin ? '+23.5%' : '0%',
      icon: DollarSign,
      color: 'text-success-600'
    },
    {
      label: 'Coin Supply',
      value: userHasCoin ? totalSupply : '0',
      change: userHasCoin ? '+12.3%' : '0%',
      icon: Coins,
      color: 'text-primary-600'
    },
    {
      label: 'Coin Holders',
      value: userHasCoin ? '892' : '0',
      change: userHasCoin ? '+8.7%' : '0%',
      icon: Users,
      color: 'text-accent-600'
    },
    {
      label: 'Your Balance',
      value: userHasCoin ? userBalance : '0',
      change: userHasCoin ? '+15.2%' : '0%',
      icon: Star,
      color: 'text-warning-600'
    }
  ]

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-2">
              Creator Dashboard
            </h1>
            <p className="text-lg text-neutral-600">
              {userHasCoin 
                ? `Manage your ${coinSymbol || 'creator'} coin and track your creator economy`
                : 'Launch your creator coin to start building your economy'
              }
            </p>
          </div>
          
          <div className="flex space-x-3 mt-4 lg:mt-0">
            {userHasCoin ? (
              <button className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </button>
            ) : (
              <button 
                onClick={() => setShowCreateCoinModal(true)}
                className="btn-primary"
              >
                <Coins className="w-4 h-4 mr-2" />
                Launch Creator Coin
              </button>
            )}
          </div>
        </div>

        {/* Coin Status */}
        {userHasCoin ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card mb-8 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {coinName || 'Your Creator Coin'}
                </h3>
                <p className="text-neutral-600">
                  Symbol: {coinSymbol || 'COIN'} • Total Supply: {totalSupply} • 
                  Contract: {userCoinAddress ? `${userCoinAddress.slice(0, 6)}...${userCoinAddress.slice(-4)}` : 'N/A'}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-neutral-600">Powered by</div>
                <div className="font-semibold text-primary-600">Zora CoinV4</div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="card mb-8 bg-gradient-to-r from-warning-50 to-orange-50 border-warning-200"
          >
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-warning-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                Launch Your Creator Coin
              </h3>
              <p className="text-neutral-600 mb-6 max-w-2xl mx-auto">
                Create your own Zora CoinV4 token to enable direct value exchange with your supporters. 
                Fans can buy your coins, and you earn from every transaction through the bonding curve.
              </p>
              <button 
                onClick={() => setShowCreateCoinModal(true)}
                className="btn-primary text-lg px-8 py-3"
              >
                <Coins className="w-5 h-5 mr-2" />
                Create Creator Coin
              </button>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${
                    stat.color === 'text-success-600' ? 'from-success-400 to-success-600' :
                    stat.color === 'text-primary-600' ? 'from-primary-400 to-primary-600' :
                    stat.color === 'text-accent-600' ? 'from-accent-400 to-accent-600' :
                    'from-warning-400 to-warning-600'
                  } flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className={`text-sm font-medium ${stat.color}`}>
                    {stat.change}
                  </span>
                </div>
                
                <div className="text-2xl font-bold text-neutral-900 mb-1">
                  {stat.value}
                </div>
                
                <div className="text-sm text-neutral-600">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Revenue Chart */}
        {userHasCoin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card mb-8"
          >
            <h3 className="text-xl font-semibold text-neutral-900 mb-6">
              Revenue & Coin Performance
            </h3>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="bonds" 
                  stroke="#d946ef" 
                  strokeWidth={3}
                  dot={{ fill: '#d946ef', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Zora Integration Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"
        >
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Powered by Zora Protocol
              </h3>
              <p className="text-neutral-600 mb-4">
                Your creator economy is built on Zora's CoinV4 protocol, featuring automated bonding curves, 
                treasury management, and seamless trading. Learn more about the technology behind your creator coin.
              </p>
              <div className="flex flex-wrap gap-2">
                <a 
                  href="https://docs.zora.co/coins" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm"
                >
                  View Documentation
                </a>
                <a 
                  href="https://github.com/ourzora/zora-protocol" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm"
                >
                  GitHub Repository
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Create Coin Modal */}
      {showCreateCoinModal && (
        <CreateCoinModal onClose={() => setShowCreateCoinModal(false)} />
      )}
    </div>
  )
}