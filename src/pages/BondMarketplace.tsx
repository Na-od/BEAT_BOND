import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, TrendingUp, Users, Star, Music, Palette, Camera, Gamepad2 } from 'lucide-react'
import { CoinCard } from '@/components/marketplace/CoinCard'
import { CoinCardWithMetrics } from '@/components/marketplace/CoinCardWithMetrics'
import { FilterPanel } from '@/components/marketplace/FilterPanel'
import { useButtonHandlers } from '@/hooks/useButtonHandlers'
import { mergeCreatorsWithLocal } from '@/utils/mergeCreators';
import { useCoinMetrics } from '@/hooks/useCoinMetrics';

const initialMockCreators = [
  {
    id: '1',
    address: '0x1234...5678',
    name: 'Luna Beats',
    bio: 'Electronic music producer creating ambient soundscapes',
    avatar: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=400',
    coverImage: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Music',
    totalBonds: 1250,
    totalValue: 45000,
    bondPrice: 0.05,
    followers: 8500,
    verified: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    address: '0x2345...6789',
    name: 'Digital Canvas',
    bio: 'NFT artist exploring the intersection of technology and nature',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
    coverImage: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Art',
    totalBonds: 890,
    totalValue: 32000,
    bondPrice: 0.08,
    followers: 5200,
    verified: true,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '3',
    address: '0x3456...7890',
    name: 'StreamMaster',
    bio: 'Gaming content creator and esports commentator',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
    coverImage: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Gaming',
    totalBonds: 2100,
    totalValue: 78000,
    bondPrice: 0.03,
    followers: 15000,
    verified: false,
    createdAt: new Date('2024-01-20')
  }
]

const categories = [
  { name: 'All', icon: Star, count: 156 },
  { name: 'Music', icon: Music, count: 45 },
  { name: 'Art', icon: Palette, count: 38 },
  { name: 'Photography', icon: Camera, count: 29 },
  { name: 'Gaming', icon: Gamepad2, count: 44 }
]

export function BondMarketplace() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('trending')
  const [showFilters, setShowFilters] = useState(false)
  const [creators, setCreators] = useState<any[]>([])
  const { handleFilterChange } = useButtonHandlers()

  useEffect(() => {
    mergeCreatorsWithLocal(initialMockCreators).then(setCreators)
  }, [])

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = (creator.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (creator.bio || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || creator.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    handleFilterChange('search', e.target.value)
  }

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName)
    handleFilterChange('category', categoryName)
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
    handleFilterChange('sort', e.target.value)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-2">
            Creator Bond Marketplace
          </h1>
          <p className="text-lg text-neutral-600">
            Discover and invest in your favorite creators
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search creators..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="input pl-10 pr-4 py-3 text-lg focus:ring-2 focus:ring-primary-500 transition-all duration-200"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="input px-4 py-3 text-lg lg:w-48 focus:ring-2 focus:ring-primary-500 transition-all duration-200"
            >
              <option value="trending">Trending</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="followers">Most Followers</option>
            </select>

            {/* Filter Toggle */}
            <button
              onClick={toggleFilters}
              className={`btn px-6 py-3 text-lg lg:w-auto transition-all duration-200 ${
                showFilters ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              const isSelected = selectedCategory === category.name
              
              return (
                <button
                  key={category.name}
                  onClick={() => handleCategorySelect(category.name)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isSelected
                      ? 'bg-primary-600 text-white shadow-lg scale-105'
                      : 'bg-white text-neutral-600 hover:bg-primary-50 hover:text-primary-600 hover:scale-105'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{category.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isSelected ? 'bg-primary-500' : 'bg-neutral-200'
                  }`}>
                    {category.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-80 flex-shrink-0"
            >
              <FilterPanel />
            </motion.div>
          )}

          {/* Creator Grid */}
          <div className="flex-1">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCreators.map((coin, index) => (
                <motion.div
                  key={coin.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <CoinCardWithMetrics coin={coin} />
                </motion.div>
              ))}
            </div>

            {filteredCreators.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-neutral-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  No creators found
                </h3>
                <p className="text-neutral-600 mb-4">
                  Try adjusting your search or filters
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('All')
                    setSortBy('trending')
                  }}
                  className="btn-primary"
                >
                  Clear Search
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}