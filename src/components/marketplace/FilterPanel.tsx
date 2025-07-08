import React, { useState } from 'react'
import { Slider } from '@/components/ui/Slider'
import { Checkbox } from '@/components/ui/Checkbox'
import { useButtonHandlers } from '@/hooks/useButtonHandlers'

export function FilterPanel() {
  const [priceRange, setPriceRange] = useState([0, 1])
  const [verified, setVerified] = useState(false)
  const [hasRewards, setHasRewards] = useState(false)
  const [trending, setTrending] = useState(false)
  const [highGrowth, setHighGrowth] = useState(false)
  const [stableReturns, setStableReturns] = useState(false)
  
  const { handleFilterChange, handleClearFilters } = useButtonHandlers()

  const handlePriceRangeChange = (newRange: number[]) => {
    setPriceRange(newRange)
    handleFilterChange('priceRange', newRange)
  }

  const handleVerifiedChange = (checked: boolean) => {
    setVerified(checked)
    handleFilterChange('verified', checked)
  }

  const handleRewardsChange = (checked: boolean) => {
    setHasRewards(checked)
    handleFilterChange('hasRewards', checked)
  }

  const handleTrendingChange = (checked: boolean) => {
    setTrending(checked)
    handleFilterChange('trending', checked)
  }

  const handleHighGrowthChange = (checked: boolean) => {
    setHighGrowth(checked)
    handleFilterChange('highGrowth', checked)
  }

  const handleStableReturnsChange = (checked: boolean) => {
    setStableReturns(checked)
    handleFilterChange('stableReturns', checked)
  }

  const handleClearAll = () => {
    setPriceRange([0, 1])
    setVerified(false)
    setHasRewards(false)
    setTrending(false)
    setHighGrowth(false)
    setStableReturns(false)
    handleClearFilters()
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-neutral-900 mb-6">Filters</h3>
      
      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          Bond Price Range (ETH)
        </label>
        <Slider
          value={priceRange}
          onChange={handlePriceRangeChange}
          min={0}
          max={1}
          step={0.01}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-neutral-500">
          <span>{priceRange[0]} ETH</span>
          <span>{priceRange[1]} ETH</span>
        </div>
      </div>

      {/* Creator Status */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          Creator Status
        </label>
        <div className="space-y-2">
          <Checkbox
            checked={verified}
            onChange={handleVerifiedChange}
            label="Verified Creators"
          />
          <Checkbox
            checked={hasRewards}
            onChange={handleRewardsChange}
            label="Active Rewards Program"
          />
        </div>
      </div>

      {/* Performance */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-neutral-700 mb-3">
          Performance
        </label>
        <div className="space-y-2">
          <Checkbox
            checked={trending}
            onChange={handleTrendingChange}
            label="Trending (24h)"
          />
          <Checkbox
            checked={highGrowth}
            onChange={handleHighGrowthChange}
            label="High Growth"
          />
          <Checkbox
            checked={stableReturns}
            onChange={handleStableReturnsChange}
            label="Stable Returns"
          />
        </div>
      </div>

      {/* Clear Filters */}
      <button 
        onClick={handleClearAll}
        className="w-full btn-secondary hover:bg-neutral-300 transition-colors duration-200"
      >
        Clear All Filters
      </button>
    </div>
  )
}