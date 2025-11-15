import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TreePine, Users, Home as HomeIcon, ShoppingBag, Award, TrendingUp, MapPin, Star, ChevronRight, Bell, Calendar, Activity } from 'lucide-react'
import Header from '@/components/Header'
import ParticleBackground from '@/components/ParticleBackground'
import LeadershipSection from '@/components/LeadershipSection'
import Footer from '@/components/Footer'

export default function HomePage() {
  const stats = [
    { icon: TreePine, label: 'Trees Planted', value: '12,500', target: '25,000', color: 'green' },
    { icon: ShoppingBag, label: 'Products', value: '26', trend: '+4', color: 'orange' },
    { icon: HomeIcon, label: 'Homestays', value: '5', capacity: '27 guests', color: 'blue' },
    { icon: Users, label: 'Community', value: '500+', growth: '↑ 15%', color: 'purple' },
  ]

  const features = [
    {
      title: 'Organic Marketplace',
      description: 'Fresh Himalayan products directly from local farmers',
      icon: ShoppingBag,
      href: '/marketplace',
      gradient: 'from-orange-500 to-yellow-500',
    },
    {
      title: 'Cultural Homestays',
      description: 'Authentic village experience in traditional homes',
      icon: HomeIcon,
      href: '/homestays',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Carbon Credits',
      description: 'Track and trade verified carbon offset tokens',
      icon: TreePine,
      href: '/carbon',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Community Hub',
      description: 'Connect, collaborate and contribute to village initiatives',
      icon: Users,
      href: '/community',
      gradient: 'from-purple-500 to-pink-500',
    },
  ]

  const recentActivities = [
    { icon: TreePine, text: 'New tree plantation drive started', time: '2 hours ago' },
    { icon: ShoppingBag, text: '5 new organic products added', time: '5 hours ago' },
    { icon: Award, text: 'Damday wins Green Village Award', time: '1 day ago' },
  ]

  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 overflow-hidden">
        <ParticleBackground />
        
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left space-y-8">
                <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md border border-orange-200">
                  <MapPin className="w-4 h-4 text-orange-600 mr-2" />
                  <span className="text-sm font-medium text-gray-700">Himalayan Devbhumi, Uttarakhand</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-orange-600 via-yellow-600 to-green-600 bg-clip-text text-transparent">
                    Damday Village
                  </span>
                </h1>
                
                <p className="text-2xl md:text-3xl font-semibold text-gray-800">
                  India&apos;s First Smart Carbon-Free Village
                </p>
                
                <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
                  A pioneering initiative integrating sustainable development, carbon neutrality, 
                  and cultural preservation through cutting-edge technology in the heart of the Himalayas.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/marketplace">
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 shadow-lg">
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Explore Marketplace
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/homestays">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 hover:bg-green-50">
                      <HomeIcon className="w-5 h-5 mr-2" />
                      Book Homestay
                    </Button>
                  </Link>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-6 pt-4">
                  {stats.slice(0, 2).map((stat) => (
                    <div key={stat.label} className="flex items-center gap-2">
                      <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-xs text-gray-600">{stat.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Sidebar - Quick Access */}
              <div className="space-y-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Quick Access</h3>
                    <Bell className="w-5 h-5 text-orange-600" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-green-600">
                        Register
                      </Button>
                    </Link>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Link href="/admin/login">
                      <Button variant="ghost" className="w-full justify-start">
                        <Activity className="w-4 h-4 mr-2" />
                        Admin Portal
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Recent Activity Widget */}
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-green-100 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {recentActivities.map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-2 hover:bg-green-50 rounded-lg transition-colors">
                        <activity.icon className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700">{activity.text}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-shadow"
                  style={{ borderColor: `var(--color-${stat.color}-500)` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-10 h-10 text-${stat.color}-600`} />
                    {stat.trend && (
                      <span className="text-green-600 text-sm font-semibold">{stat.trend}</span>
                    )}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                  {stat.target && (
                    <div className="text-xs text-gray-500">Target: {stat.target}</div>
                  )}
                  {stat.capacity && (
                    <div className="text-xs text-gray-500">{stat.capacity}</div>
                  )}
                  {stat.growth && (
                    <div className="text-xs text-green-600 font-medium">{stat.growth}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Explore Our Initiatives
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover how Damday Village is pioneering sustainable development
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 hover:border-orange-200 hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                  <div className="flex items-center text-orange-600 font-medium text-sm group-hover:gap-2 transition-all">
                    <span>Learn more</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* DamChain Blockchain Section */}
        <section className="py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <ParticleBackground />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <div className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-2 rounded-full mb-6">
                <span className="text-sm font-bold">⚡ POWERED BY DAMCHAIN</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                World&apos;s Most Advanced Blockchain
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Million times faster and more secure than Bitcoin. Powered by quantum-resistant cryptography, 
                AI optimization, and zero-knowledge proofs. The future of decentralized finance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-6">
                <div className="text-4xl font-bold text-cyan-400 mb-2">100K+</div>
                <div className="text-gray-300 font-medium">Transactions/Second</div>
                <div className="text-xs text-gray-400 mt-2">1M+ with sharding</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                <div className="text-4xl font-bold text-purple-400 mb-2">&lt;0.00001</div>
                <div className="text-gray-300 font-medium">kWh per Transaction</div>
                <div className="text-xs text-gray-400 mt-2">99.999% less than Bitcoin</div>
              </div>
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-6">
                <div className="text-4xl font-bold text-green-400 mb-2">256-bit</div>
                <div className="text-gray-300 font-medium">Quantum Security</div>
                <div className="text-xs text-gray-400 mt-2">Post-quantum cryptography</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-6">
                <div className="text-4xl font-bold text-yellow-400 mb-2">95%+</div>
                <div className="text-gray-300 font-medium">Gas Cost Reduction</div>
                <div className="text-xs text-gray-400 mt-2">AI-powered optimization</div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-cyan-500/50 transition-all">
                <div className="text-cyan-400 text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-3">Zero-Knowledge Proofs</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Complete privacy with zk-SNARKs and zk-STARKs. Verify transactions without revealing data.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ Private transactions</li>
                  <li>✓ Recursive proofs</li>
                  <li>✓ STARK verification</li>
                </ul>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all">
                <div className="text-purple-400 text-4xl mb-4">🌐</div>
                <h3 className="text-xl font-bold mb-3">Cross-Chain Swaps</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Seamless interoperability with Ethereum, Bitcoin, Polkadot, and Cosmos networks.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ Atomic swaps (HTLC)</li>
                  <li>✓ Bridge protocols</li>
                  <li>✓ Multi-chain support</li>
                </ul>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-green-500/50 transition-all">
                <div className="text-green-400 text-4xl mb-4">🛡️</div>
                <h3 className="text-xl font-bold mb-3">MEV Protection</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Protected from front-running attacks with encrypted mempool and fair ordering.
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>✓ Encrypted mempool</li>
                  <li>✓ Fair transaction ordering</li>
                  <li>✓ PBS (Proposer-Builder Separation)</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <Link href="/blockchain">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white border-0 shadow-2xl shadow-purple-500/50">
                  <Activity className="w-5 h-5 mr-2" />
                  Explore DamChain Blockchain
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <LeadershipSection />

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-orange-500 via-yellow-500 to-green-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Join the Green Revolution
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Be part of India&apos;s journey towards sustainable living and carbon neutrality
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 shadow-xl">
                    Get Started Today
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                    Explore Products
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      {/* Footer */}
      <Footer />
    </>
  )
}
