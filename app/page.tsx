import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TreePine, Users, Home as HomeIcon, ShoppingBag, Award, TrendingUp, MapPin, Star, ChevronRight, Bell, Calendar, Activity, Sparkles, Leaf, Mountain, Heart, Zap } from 'lucide-react'
import Header from '@/components/Header'
import ParticleBackground from '@/components/ParticleBackground'
import LeadershipSection from '@/components/LeadershipSection'
import Footer from '@/components/Footer'

export default function HomePage() {
  const stats = [
    { icon: TreePine, label: 'Trees Planted', value: '12,500', target: '25,000', color: 'emerald', trend: '+2.5K this month' },
    { icon: ShoppingBag, label: 'Products', value: '26', trend: '+4 new', color: 'amber', growth: '15% increase' },
    { icon: HomeIcon, label: 'Homestays', value: '5', capacity: '27 guests', color: 'blue', rating: '4.8/5' },
    { icon: Users, label: 'Community', value: '500+', growth: '↑ 15%', color: 'purple', active: '342 active' },
  ]

  const features = [
    {
      title: 'Organic Marketplace',
      description: 'Fresh Himalayan products directly from local farmers',
      icon: ShoppingBag,
      href: '/marketplace',
      gradient: 'from-amber-500 via-orange-500 to-yellow-500',
      benefits: ['Farm Fresh', 'Zero Pesticides', 'Direct Trade'],
    },
    {
      title: 'Cultural Homestays',
      description: 'Authentic village experience in traditional homes',
      icon: HomeIcon,
      href: '/homestays',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      benefits: ['Local Culture', 'Home-Cooked', 'Nature Walks'],
    },
    {
      title: 'Carbon Credits',
      description: 'Track and trade verified carbon offset tokens',
      icon: TreePine,
      href: '/carbon',
      gradient: 'from-emerald-500 via-green-500 to-lime-500',
      benefits: ['Verified Credits', 'Blockchain Secure', 'Real Impact'],
    },
    {
      title: 'Community Hub',
      description: 'Connect, collaborate and contribute to village initiatives',
      icon: Users,
      href: '/community',
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      benefits: ['Events', 'Volunteer', 'Connect'],
    },
  ]

  const recentActivities = [
    { icon: TreePine, text: 'New tree plantation drive started in Sector A', time: '2 hours ago', badge: 'Active' },
    { icon: ShoppingBag, text: '5 new organic products added to marketplace', time: '5 hours ago', badge: 'New' },
    { icon: Award, text: 'Damday wins National Green Village Award 2024', time: '1 day ago', badge: 'Achievement' },
    { icon: Users, text: '50+ volunteers joined cleanup initiative', time: '2 days ago', badge: 'Community' },
  ]

  const testimonials = [
    {
      text: "Damday Village has transformed sustainable living. The blockchain integration is revolutionary!",
      author: "Dr. Rajesh Kumar",
      role: "Environmental Scientist",
      avatar: "🧑‍🔬"
    },
    {
      text: "Best homestay experience! The local food and hospitality were exceptional.",
      author: "Sarah Chen",
      role: "Travel Blogger",
      avatar: "✈️"
    },
    {
      text: "The organic produce quality is outstanding. Supporting local farmers feels great!",
      author: "Amit Sharma",
      role: "Regular Customer",
      avatar: "🌾"
    },
  ]

  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-green-50 overflow-hidden">
        <ParticleBackground />
        
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left space-y-6 animate-float">
                <div className="inline-flex items-center glass px-6 py-3 rounded-full shadow-lg border border-amber-200 hover:shadow-xl transition-all duration-300">
                  <MapPin className="w-5 h-5 text-orange-600 mr-2 animate-pulse-soft" />
                  <span className="text-sm font-semibold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">Himalayan Devbhumi, Uttarakhand</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-green-600 bg-clip-text text-transparent drop-shadow-sm">
                    Damday Village
                  </span>
                </h1>
                
                <div className="relative">
                  <h2 className="text-2xl md:text-4xl font-bold text-gray-800 mb-2">
                    India&apos;s First Smart Carbon-Free Village
                  </h2>
                  <div className="flex items-center justify-center lg:justify-start gap-2 mt-3">
                    <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                    <span className="text-sm font-medium text-gray-600">Powered by DamChain Blockchain</span>
                    <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
                  </div>
                </div>
                
                <p className="text-lg text-gray-700 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  A pioneering initiative integrating <span className="font-semibold text-green-700">sustainable development</span>, 
                  <span className="font-semibold text-blue-700"> carbon neutrality</span>, and 
                  <span className="font-semibold text-purple-700"> cultural preservation</span> through cutting-edge technology.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/marketplace">
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-600 hover:via-amber-600 hover:to-yellow-600 shadow-xl hover:shadow-2xl transition-all duration-300 text-white border-0 group">
                      <ShoppingBag className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Explore Marketplace
                      <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/homestays">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-green-600 text-green-700 hover:bg-green-50 hover:border-green-700 shadow-md hover:shadow-lg transition-all duration-300">
                      <HomeIcon className="w-5 h-5 mr-2" />
                      Book Homestay
                    </Button>
                  </Link>
                </div>

                {/* Quick Stats Mini */}
                <div className="flex flex-wrap gap-6 pt-6 justify-center lg:justify-start">
                  {stats.slice(0, 2).map((stat) => (
                    <div key={stat.label} className="glass rounded-xl px-4 py-3 shadow-md hover:shadow-lg transition-all duration-300 border border-white/40">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br from-${stat.color}-400 to-${stat.color}-600`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                          <div className="text-xs text-gray-600">{stat.label}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Sidebar - Enhanced Widgets */}
              <div className="space-y-4">
                {/* Quick Access Card */}
                <div className="glass rounded-2xl shadow-2xl border border-white/60 p-6 hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-amber-500" />
                      Quick Access
                    </h3>
                    <Bell className="w-5 h-5 text-orange-600 animate-pulse-soft" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Link href="/login">
                      <Button variant="outline" className="w-full border-2 hover:border-blue-500 hover:text-blue-600 transition-all duration-300">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-300">
                        Register
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-2">
                    <Link href="/admin/login" className="block">
                      <Button variant="ghost" className="w-full justify-start hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all duration-300">
                        <Activity className="w-4 h-4 mr-2" />
                        Admin Portal
                      </Button>
                    </Link>
                    <Link href="/dashboard" className="block">
                      <Button variant="ghost" className="w-full justify-start hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-300">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        User Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Recent Activity Widget */}
                <div className="glass rounded-2xl shadow-2xl border border-white/60 p-6 hover:shadow-3xl transition-all duration-300">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="w-5 h-5 text-green-600 animate-pulse" />
                    <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {recentActivities.map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl transition-all duration-300 cursor-pointer group">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-300">
                          <activity.icon className="w-4 h-4 text-green-700" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800 font-medium">{activity.text}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-gray-500">{activity.time}</p>
                            <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                              {activity.badge}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact Counter */}
                <div className="glass rounded-2xl shadow-2xl border border-white/60 p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="flex items-center gap-2 mb-3">
                    <Leaf className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-bold text-gray-900">Today&apos;s Impact</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-white/80 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">125</div>
                      <div className="text-xs text-gray-600">Trees Today</div>
                    </div>
                    <div className="text-center p-2 bg-white/80 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">2.5T</div>
                      <div className="text-xs text-gray-600">CO₂ Offset</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-white/70 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, idx) => (
                <div
                  key={stat.label}
                  className="glass rounded-2xl shadow-xl p-6 border-l-4 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                  style={{ 
                    borderColor: `var(--tw-gradient-to)`,
                    borderImage: `linear-gradient(to bottom, rgb(${stat.color === 'emerald' ? '16 185 129' : stat.color === 'amber' ? '245 158 11' : stat.color === 'blue' ? '59 130 246' : '168 85 247'}), rgb(${stat.color === 'emerald' ? '5 150 105' : stat.color === 'amber' ? '217 119 6' : stat.color === 'blue' ? '37 99 235' : '126 34 206'})) 1`
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br from-${stat.color}-400 to-${stat.color}-600 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    {stat.trend && (
                      <span className="text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded-full">{stat.trend}</span>
                    )}
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-sm font-semibold text-gray-700 mb-2">{stat.label}</div>
                  {stat.target && (
                    <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-md inline-block">
                      Target: {stat.target}
                    </div>
                  )}
                  {stat.capacity && (
                    <div className="text-xs text-gray-600 mt-1">{stat.capacity}</div>
                  )}
                  {stat.growth && (
                    <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full inline-block mt-1">
                      {stat.growth}
                    </div>
                  )}
                  {stat.rating && (
                    <div className="flex items-center gap-1 mt-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-700">{stat.rating}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid - Enhanced */}
        <section className="py-20 bg-gradient-to-b from-white/70 to-orange-50/70">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-green-100 px-6 py-2 rounded-full mb-4">
                <Sparkles className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-bold text-gray-700">OUR INITIATIVES</span>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6">
                Explore Our <span className="bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">Initiatives</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover how Damday Village is pioneering sustainable development through innovation and tradition
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, idx) => (
                <Link
                  key={feature.title}
                  href={feature.href}
                  className="group glass rounded-2xl shadow-xl hover:shadow-3xl transition-all duration-500 p-8 border border-white/60 hover:border-white/80 hover:-translate-y-2 relative overflow-hidden"
                  style={{
                    animationDelay: `${idx * 100}ms`
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5`}></div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-orange-600 group-hover:to-green-600 transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {feature.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${feature.gradient}`}></div>
                          {benefit}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center text-orange-600 font-bold text-sm group-hover:gap-3 transition-all duration-300">
                      <span>Explore Now</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white/80 px-6 py-2 rounded-full mb-4 shadow-md">
                <Heart className="w-5 h-5 text-pink-600" />
                <span className="text-sm font-bold text-gray-700">TESTIMONIALS</span>
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-4">
                What People <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Say</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className="glass rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className="text-6xl mb-4">{testimonial.avatar}</div>
                  <p className="text-gray-700 italic mb-6 leading-relaxed">&quot;{testimonial.text}&quot;</p>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="font-bold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DamChain Blockchain Section */}
        <section className="py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <ParticleBackground />
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <div className="inline-flex items-center bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-3 rounded-full mb-6 shadow-xl">
                <Zap className="w-5 h-5 mr-2" />
                <span className="text-sm font-bold">⚡ POWERED BY DAMCHAIN</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                World&apos;s Most Advanced Blockchain
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Million times faster and more secure than Bitcoin. Powered by quantum-resistant cryptography, 
                AI optimization, and zero-knowledge proofs. The future of decentralized finance.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { value: '100K+', label: 'Transactions/Second', sub: '1M+ with sharding', color: 'from-cyan-500 to-blue-500' },
                { value: '<0.00001', label: 'kWh per Transaction', sub: '99.999% less than Bitcoin', color: 'from-purple-500 to-pink-500' },
                { value: '256-bit', label: 'Quantum Security', sub: 'Post-quantum cryptography', color: 'from-green-500 to-emerald-500' },
                { value: '95%+', label: 'Gas Cost Reduction', sub: 'AI-powered optimization', color: 'from-yellow-500 to-orange-500' },
              ].map((stat, idx) => (
                <div key={idx} className={`glass-dark rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${stat.color}/20`}>
                  <div className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{stat.value}</div>
                  <div className="text-gray-200 font-medium mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-400">{stat.sub}</div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href="/blockchain">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white border-0 shadow-2xl shadow-purple-500/50 hover:shadow-3xl transition-all duration-300">
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
        <section className="py-24 bg-gradient-to-r from-orange-500 via-amber-500 to-green-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                Join the Green Revolution
              </h2>
              <p className="text-2xl mb-10 text-white/95 leading-relaxed">
                Be part of India&apos;s journey towards sustainable living and carbon neutrality
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 text-lg px-8 py-6">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Get Started Today
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button size="lg" variant="outline" className="border-3 border-white text-white hover:bg-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg px-8 py-6">
                    <ShoppingBag className="w-5 h-5 mr-2" />
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
