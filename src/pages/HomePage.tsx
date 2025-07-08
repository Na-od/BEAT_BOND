import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, TrendingUp, Shield, Users, Music, Star } from 'lucide-react'
import { useButtonHandlers } from '@/hooks/useButtonHandlers'

export function HomePage() {
  const { handleNavigation, handleUserTypeSelection } = useButtonHandlers()

  const features = [
    {
      icon: Zap,
      title: 'Direct Value Exchange',
      description: 'Skip the middleman. Creators earn directly from their supporters through tokenized bonds.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: TrendingUp,
      title: 'Tradeable Creator Bonds',
      description: 'Fan investments become tradeable assets that can appreciate based on creator success.',
      color: 'from-green-400 to-blue-500'
    },
    {
      icon: Shield,
      title: 'Zora Integration',
      description: 'Built on Zora\'s CoinV4 protocol for secure, decentralized creator economy.',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: Users,
      title: 'Community Rewards',
      description: 'Early supporters get exclusive access, content, and rewards as creators grow.',
      color: 'from-blue-400 to-indigo-500'
    }
  ]

  const stats = [
    { label: 'Creators Onboarded', value: '2,500+' },
    { label: 'Total Value Exchanged', value: '$1.2M' },
    { label: 'Active Supporters', value: '15,000+' },
    { label: 'Average Creator Earnings', value: '$850/mo' }
  ]

  const handleExploreCreators = () => {
    handleNavigation('/marketplace')
  }

  const handleLaunchAsCreator = () => {
    handleUserTypeSelection('creator')
  }

  const handleBrowseCreators = () => {
    handleNavigation('/marketplace')
  }

  const handleStartAsCreator = () => {
    handleUserTypeSelection('creator')
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-accent-50 py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6">
                <Star className="w-4 h-4 mr-2" />
                Revolutionizing Creator Economy
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-neutral-900 mb-6">
                Direct Value Exchange
                <br />
                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Between Creators & Fans
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-neutral-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Skip traditional platforms. Enable direct investment in creators through tradeable bonds. 
                Creators earn more, fans get real value, everyone wins.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <button
                onClick={handleExploreCreators}
                className="btn-primary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Explore Creators
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              
              <button
                onClick={handleLaunchAsCreator}
                className="btn-secondary text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Launch as Creator
                <Music className="w-5 h-5 ml-2" />
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-neutral-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              Why Beat Bond?
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Traditional platforms extract value. We enable direct exchange and mutual growth.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card hover:shadow-lg transition-all duration-300 group"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    {feature.title}
                  </h3>
                  
                  <p className="text-neutral-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 lg:py-32 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Simple steps to start earning or investing in the creator economy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Creators Launch Bonds',
                description: 'Artists, musicians, and creators tokenize their future success into tradeable bonds with different tiers and benefits.'
              },
              {
                step: '02',
                title: 'Fans Invest & Support',
                description: 'Supporters purchase creator bonds, getting exclusive access, content, and potential returns as creators grow.'
              },
              {
                step: '03',
                title: 'Value Grows Together',
                description: 'As creators succeed, bond values increase. Fans can trade bonds or hold for long-term rewards and exclusive benefits.'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-6">
                  {item.step}
                </div>
                
                <h3 className="text-xl font-semibold text-neutral-900 mb-4">
                  {item.title}
                </h3>
                
                <p className="text-neutral-600 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Ready to Transform the Creator Economy?
            </h2>
            
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of creators and fans building direct value relationships without platform middlemen.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleStartAsCreator}
                className="bg-white text-primary-600 hover:bg-primary-50 btn text-lg px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Start as Creator
              </button>
              
              <button
                onClick={handleBrowseCreators}
                className="bg-primary-700 text-white hover:bg-primary-800 btn text-lg px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                Browse Creators
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}