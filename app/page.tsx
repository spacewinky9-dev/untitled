'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, Leaf, MapPin, ShoppingBag, ChevronRight, TrendingUp, Users, Store, Home, Award, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js'
    script.async = true
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as any).particlesJS) {
        (window as any).particlesJS('particles-js', {
          particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: ['#ff6b35', '#f7931e', '#4ade80'] },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: '#fbbf24', opacity: 0.2, width: 1 },
            move: { enable: true, speed: 2, direction: 'none', random: true }
          }
        })
      }
    }
    document.body.appendChild(script)
    return () => { if (document.body.contains(script)) document.body.removeChild(script) }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-emerald-900 overflow-hidden relative">
      <div id="particles-js" className="absolute inset-0 z-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-green-500/10 z-[1]" />
      
      <div className="relative z-10">
        <nav className="fixed top-0 left-0 right-0 bg-black/20 backdrop-blur-xl border-b border-white/10 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">🇮🇳</span>
                </div>
                <div>
                  <h1 className="text-white font-bold text-xl">Damday Village</h1>
                  <p className="text-orange-300 text-xs">Carbon-Free Paradise</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/homestays" className="text-white/80 hover:text-orange-400 transition-colors">Homestays</Link>
                <Link href="/marketplace" className="text-white/80 hover:text-orange-400 transition-colors">Marketplace</Link>
                <Link href="/blockchain" className="text-white/80 hover:text-orange-400 transition-colors">Carbon Credits</Link>
                <Link href="/login" className="bg-gradient-to-r from-orange-500 to-green-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all">
                  Login
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-8">
                <div className="space-y-6 animate-fade-in">
                  <div className="inline-block bg-gradient-to-r from-orange-500/20 to-green-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-6 py-2">
                    <p className="text-orange-300 font-semibold">🌱 India&#39;s First Carbon Neutral Village</p>
                  </div>
                  
                  <h1 className="text-6xl md:text-8xl font-black text-white leading-tight">
                    Welcome to
                    <span className="block bg-gradient-to-r from-orange-400 via-yellow-300 to-green-400 bg-clip-text text-transparent mt-2">
                      Damday Village
                    </span>
                  </h1>
                  
                  <p className="text-2xl text-white/70 max-w-2xl leading-relaxed">
                    Experience sustainable living, authentic culture, and eco-tourism in the heart of Uttarakhand&#39;s pristine mountains
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link href="/register">
                      <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-6 text-lg rounded-full shadow-2xl">
                        <Sparkles className="mr-2 h-6 w-6" />
                        Join Our Mission
                      </Button>
                    </Link>
                    <Link href="/marketplace">
                      <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-6 text-lg rounded-full">
                        <ShoppingBag className="mr-2 h-6 w-6" />
                        Explore Marketplace
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-4 space-y-4">{mounted && <StatsCards />}</div>
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-4">Discover Paradise</h2>
              <p className="text-xl text-white/60">Experience the perfect blend of nature, culture and sustainability</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Home className="h-12 w-12" />}
                title="Eco Homestays"
                description="Stay in carbon-neutral homes with modern amenities and traditional charm"
                color="from-orange-500 to-red-600"
                link="/homestays"
              />
              
              <FeatureCard
                icon={<Store className="h-12 w-12" />}
                title="Local Marketplace"
                description="Buy authentic organic products directly from village artisans"
                color="from-green-500 to-emerald-600"
                link="/marketplace"
              />
              
              <FeatureCard
                icon={<MapPin className="h-12 w-12" />}
                title="Cultural Tours"
                description="Explore pristine Himalayan landscapes and rich village heritage"
                color="from-blue-500 to-cyan-600"
                link="/tours"
              />
            </div>
          </div>
        </section>

        <section className="py-20 px-6 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <ImpactStat value="100%" label="Carbon Neutral" icon={<Leaf />} />
              <ImpactStat value="500+" label="Happy Visitors" icon={<Users />} />
              <ImpactStat value="50+" label="Local Products" icon={<Store />} />
              <ImpactStat value="10+" label="Eco Homestays" icon={<Home />} />
            </div>
          </div>
        </section>

        <section className="py-20 px-6">
          <div className="container mx-auto text-center">
            <div className="bg-gradient-to-r from-orange-500/20 to-green-500/20 backdrop-blur-xl border border-white/20 rounded-3xl p-12 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Experience Sustainable Living?
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Join thousands of eco-conscious travelers and support rural India
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white px-10 py-6 text-lg rounded-full shadow-xl">
                    Get Started Today
                  </Button>
                </Link>
                <Link href="/blockchain">
                  <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-6 text-lg rounded-full">
                    Explore Carbon Credits
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-12 px-6 bg-black/40 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-white font-bold text-lg mb-4">Damday Village</h3>
                <p className="text-white/60 text-sm">India&#39;s first carbon-free village in Uttarakhand</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Explore</h4>
                <div className="space-y-2">
                  <Link href="/homestays" className="block text-white/60 hover:text-orange-400 text-sm">Homestays</Link>
                  <Link href="/marketplace" className="block text-white/60 hover:text-orange-400 text-sm">Marketplace</Link>
                  <Link href="/tours" className="block text-white/60 hover:text-orange-400 text-sm">Tours</Link>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Community</h4>
                <div className="space-y-2">
                  <Link href="/blog" className="block text-white/60 hover:text-orange-400 text-sm">Blog</Link>
                  <Link href="/community" className="block text-white/60 hover:text-orange-400 text-sm">Community</Link>
                  <Link href="/carbon" className="block text-white/60 hover:text-orange-400 text-sm">Carbon Credits</Link>
                </div>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <div className="space-y-2">
                  <Link href="/privacy" className="block text-white/60 hover:text-orange-400 text-sm">Privacy Policy</Link>
                  <Link href="/terms" className="block text-white/60 hover:text-orange-400 text-sm">Terms of Service</Link>
                </div>
              </div>
            </div>
            <div className="border-t border-white/10 pt-8 text-center">
              <p className="text-white/60 text-sm">© 2024 Damday Village. Made with ❤️ in Uttarakhand</p>
            </div>
          </div>
        </footer>
      </div>
    </main>
  )
}

function StatsCards() {
  const stats = [
    { icon: <Users className="h-6 w-6" />, value: '2,500+', label: 'Community Members', color: 'from-orange-500 to-red-500' },
    { icon: <Store className="h-6 w-6" />, value: '150+', label: 'Local Products', color: 'from-green-500 to-emerald-500' },
    { icon: <Home className="h-6 w-6" />, value: '25+', label: 'Eco Homestays', color: 'from-blue-500 to-cyan-500' },
    { icon: <TrendingUp className="h-6 w-6" />, value: '100%', label: 'Carbon Neutral', color: 'from-purple-500 to-pink-500' },
    { icon: <Award className="h-6 w-6" />, value: '#1', label: 'Green Village', color: 'from-yellow-500 to-orange-500' },
    { icon: <Heart className="h-6 w-6" />, value: '5000+', label: 'Happy Visitors', color: 'from-red-500 to-rose-500' },
  ]

  return (
    <div className="space-y-3">
      {stats.map((stat, idx) => (
        <div key={idx} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 hover:bg-white/15 transition-all hover:scale-105 cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`bg-gradient-to-br ${stat.color} p-2 rounded-xl shadow-lg`}>
                <div className="text-white">{stat.icon}</div>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-white/40" />
          </div>
        </div>
      ))}
    </div>
  )
}

function FeatureCard({ icon, title, description, color, link }: any) {
  return (
    <Link href={link}>
      <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className={`bg-gradient-to-br ${color} w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform`}>
          <div className="text-white">{icon}</div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-white/60 mb-4 leading-relaxed">{description}</p>
        <div className="flex items-center text-orange-400 font-semibold group-hover:translate-x-2 transition-transform">
          Explore <ChevronRight className="ml-1 h-5 w-5" />
        </div>
      </div>
    </Link>
  )
}

function ImpactStat({ value, label, icon }: any) {
  return (
    <div className="text-center group cursor-pointer">
      <div className="bg-gradient-to-br from-orange-500/20 to-green-500/20 backdrop-blur-sm border border-white/20 rounded-2xl p-6 mb-3 group-hover:scale-110 transition-transform">
        <div className="text-white mb-2">{icon}</div>
        <p className="text-4xl font-bold text-white mb-1">{value}</p>
      </div>
      <p className="text-white/70 font-medium">{label}</p>
    </div>
  )
}
