import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Verified, Users, TrendingUp, Star, Share, Heart, MessageCircle, Play } from 'lucide-react'
import { BondPurchaseModal } from '@/components/creator/BondPurchaseModal'
import { useButtonHandlers } from '@/hooks/useButtonHandlers'
import { useBondActions } from '@/hooks/useBondActions'

export function CreatorProfile() {
  const { address } = useParams()
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [selectedTier, setSelectedTier] = useState<any>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  
  const { handleShare, handleFollowCreator, handleLikeContent, handleCommentOnContent } = useButtonHandlers()
  const { handlePurchaseBond } = useBondActions(address)

  // Mock creator data
  const creator = {
    id: '1',
    address: address || '0x1234...5678',
    name: 'Luna Beats',
    bio: 'Electronic music producer creating ambient soundscapes that transport listeners to otherworldly realms. Blending organic and synthetic sounds to craft immersive audio experiences.',
    avatar: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg?auto=compress&cs=tinysrgb&w=400',
    coverImage: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1200',
    category: 'Music',
    totalBonds: 1250,
    totalValue: 45000,
    bondPrice: 0.05,
    followers: 8500,
    verified: true,
    createdAt: new Date('2024-01-15'),
    socialLinks: {
      twitter: '@lunabeats',
      instagram: '@lunabeats_official',
      spotify: 'Luna Beats'
    }
  }

  const bondTiers = [
    {
      name: 'Bronze',
      price: 0.01,
      supply: 1000,
      sold: 850,
      benefits: [
        'Monthly music updates',
        'Discord community access',
        'Behind-the-scenes content',
        'Early track previews'
      ],
      color: 'from-amber-400 to-orange-500',
      popular: false
    },
    {
      name: 'Silver',
      price: 0.05,
      supply: 500,
      sold: 320,
      benefits: [
        'All Bronze benefits',
        'Exclusive unreleased tracks',
        'Monthly live Q&A sessions',
        'Personalized thank you message',
        'Limited edition NFT artwork'
      ],
      color: 'from-gray-400 to-gray-600',
      popular: true
    },
    {
      name: 'Gold',
      price: 0.1,
      supply: 200,
      sold: 145,
      benefits: [
        'All Silver benefits',
        '1-on-1 virtual meet & greet',
        'Custom track requests',
        'Producer pack downloads',
        'Collaboration opportunities'
      ],
      color: 'from-yellow-400 to-yellow-600',
      popular: false
    },
    {
      name: 'Platinum',
      price: 0.25,
      supply: 50,
      sold: 28,
      benefits: [
        'All Gold benefits',
        'Co-production session',
        'Revenue sharing on tracks',
        'Executive producer credit',
        'Exclusive merchandise'
      ],
      color: 'from-purple-400 to-purple-600',
      popular: false
    }
  ]

  const recentContent = [
    {
      id: '1',
      type: 'track',
      title: 'Ethereal Waves',
      description: 'New ambient track exploring oceanic themes',
      thumbnail: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
      likes: 234,
      comments: 45,
      timestamp: '2 days ago',
      isLiked: false
    },
    {
      id: '2',
      type: 'update',
      title: 'Studio Session Behind the Scenes',
      description: 'Working on the next album - here\'s a sneak peek',
      thumbnail: 'https://images.pexels.com/photos/1751731/pexels-photo-1751731.jpeg?auto=compress&cs=tinysrgb&w=300',
      likes: 189,
      comments: 32,
      timestamp: '5 days ago',
      isLiked: true
    },
    {
      id: '3',
      type: 'live',
      title: 'Live Production Stream',
      description: 'Creating beats live with the community',
      thumbnail: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
      likes: 456,
      comments: 78,
      timestamp: '1 week ago',
      isLiked: false
    }
  ]

  const handlePurchaseBondClick = (tier: any) => {
    setSelectedTier(tier)
    setShowPurchaseModal(true)
  }

  const handleShareProfile = async () => {
    await handleShare({
      title: `${creator.name} - Creator Profile`,
      text: `Check out ${creator.name}'s creator profile on Beat Bond!`,
      url: window.location.href
    })
  }

  const handleFollowClick = async () => {
    await handleFollowCreator(creator.address, isFollowing)
    setIsFollowing(!isFollowing)
  }

  const handleContentLike = async (contentId: string, currentlyLiked: boolean) => {
    await handleLikeContent(contentId, currentlyLiked)
  }

  const handleContentComment = (contentId: string) => {
    handleCommentOnContent(contentId)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        <img
          src={creator.coverImage}
          alt={`${creator.name} cover`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-6">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              
              <div className="flex-1 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-3xl md:text-4xl font-display font-bold">
                    {creator.name}
                  </h1>
                  {creator.verified && (
                    <Verified className="w-6 h-6 text-primary-400" />
                  )}
                </div>
                
                <p className="text-lg text-white/90 mb-4 max-w-2xl">
                  {creator.bio}
                </p>
                
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{creator.followers.toLocaleString()} followers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{creator.totalBonds.toLocaleString()} bonds sold</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>${creator.totalValue.toLocaleString()} total value</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={handleShareProfile}
                  className="btn-secondary text-white border-white hover:bg-white hover:text-neutral-900 transition-colors duration-200"
                >
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </button>
                <button 
                  onClick={handleFollowClick}
                  className={`btn transition-colors duration-200 ${
                    isFollowing 
                      ? 'bg-white text-neutral-900 hover:bg-neutral-100' 
                      : 'btn-primary'
                  }`}
                >
                  <Heart className={`w-4 h-4 mr-2 ${isFollowing ? 'fill-current' : ''}`} />
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bond Tiers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="card"
            >
              <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6">
                Support {creator.name}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                {bondTiers.map((tier, index) => (
                  <motion.div
                    key={tier.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className={`relative border-2 rounded-xl p-6 transition-all duration-200 hover:shadow-lg ${
                      tier.popular 
                        ? 'border-primary-500 bg-primary-50' 
                        : 'border-neutral-200 hover:border-primary-300'
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                          Most Popular
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-neutral-900">
                        {tier.name}
                      </h3>
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${tier.color}`} />
                    </div>
                    
                    <div className="text-3xl font-bold text-neutral-900 mb-2">
                      {tier.price} ETH
                    </div>
                    
                    <div className="text-sm text-neutral-600 mb-4">
                      {tier.sold}/{tier.supply} sold ({Math.round((tier.sold / tier.supply) * 100)}%)
                    </div>
                    
                    <div className="w-full bg-neutral-200 rounded-full h-2 mb-6">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${tier.color}`}
                        style={{ width: `${(tier.sold / tier.supply) * 100}%` }}
                      />
                    </div>
                    
                    <ul className="space-y-2 mb-6">
                      {tier.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start space-x-2 text-sm text-neutral-600">
                          <Star className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button
                      onClick={() => handlePurchaseBondClick(tier)}
                      className={`w-full btn ${
                        tier.popular ? 'btn-primary' : 'btn-secondary'
                      } hover:scale-105 transition-transform duration-200`}
                    >
                      Purchase {tier.name} Bond
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Recent Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card"
            >
              <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6">
                Recent Content
              </h2>
              
              <div className="space-y-4">
                {recentContent.map((content, index) => (
                  <div key={content.id} className="flex space-x-4 p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
                    <div className="relative">
                      <img
                        src={content.thumbnail}
                        alt={content.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      {content.type === 'track' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white drop-shadow-lg" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-neutral-900 mb-1">
                        {content.title}
                      </h3>
                      <p className="text-sm text-neutral-600 mb-2">
                        {content.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-neutral-500">
                        <button 
                          onClick={() => handleContentLike(content.id, content.isLiked)}
                          className={`flex items-center space-x-1 hover:text-red-500 transition-colors duration-200 ${
                            content.isLiked ? 'text-red-500' : ''
                          }`}
                        >
                          <Heart className={`w-3 h-3 ${content.isLiked ? 'fill-current' : ''}`} />
                          <span>{content.likes}</span>
                        </button>
                        <button 
                          onClick={() => handleContentComment(content.id)}
                          className="flex items-center space-x-1 hover:text-blue-500 transition-colors duration-200"
                        >
                          <MessageCircle className="w-3 h-3" />
                          <span>{content.comments}</span>
                        </button>
                        <span>{content.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Creator Stats
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Total Revenue</span>
                  <span className="font-semibold text-neutral-900">
                    ${creator.totalValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Bonds Sold</span>
                  <span className="font-semibold text-neutral-900">
                    {creator.totalBonds.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Avg. Bond Price</span>
                  <span className="font-semibold text-neutral-900">
                    {creator.bondPrice} ETH
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Followers</span>
                  <span className="font-semibold text-neutral-900">
                    {creator.followers.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card"
            >
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                Connect
              </h3>
              
              <div className="space-y-3">
                {Object.entries(creator.socialLinks).map(([platform, handle]) => (
                  <a
                    key={platform}
                    href="#"
                    className="flex items-center space-x-3 text-neutral-600 hover:text-primary-600 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-medium capitalize">
                        {platform[0]}
                      </span>
                    </div>
                    <span className="capitalize">{platform}: {handle}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      {showPurchaseModal && selectedTier && (
        <BondPurchaseModal
          creator={creator}
          tier={selectedTier}
          onClose={() => {
            setShowPurchaseModal(false)
            setSelectedTier(null)
          }}
        />
      )}
    </div>
  )
}