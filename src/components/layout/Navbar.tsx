import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { Music, TrendingUp, Users, Zap, Settings } from 'lucide-react'
import { useButtonHandlers } from '@/hooks/useButtonHandlers'

export function Navbar() {
  const location = useLocation()
  const { handleNavigation } = useButtonHandlers()
  
  const navItems = [
    { path: '/', label: 'Home', icon: Music },
    { path: '/marketplace', label: 'Marketplace', icon: TrendingUp },
    { path: '/creator-dashboard', label: 'Creator', icon: Zap },
    // Removed Fan and Settings nav items
  ]

  const handleNavClick = (path: string) => {
    handleNavigation(path)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => handleNavClick('/')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              Beat Bond
            </span>
          </button>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className="relative px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <div className={`flex items-center space-x-2 ${
                    isActive 
                      ? 'text-primary-600' 
                      : 'text-neutral-600 hover:text-primary-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-primary-50 rounded-lg -z-10"
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Connect Button */}
          <div className="flex items-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    </nav>
  )
}