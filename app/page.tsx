'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, Leaf, MapPin, ShoppingBag, ChevronRight, TrendingUp, Users, Store, Home, Award, Heart } from 'lucide-react'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import StatsSidebar from '@/components/StatsSidebar'
import LeadershipSection from '@/components/LeadershipSection'
import AboutSection from '@/components/AboutSection'
import GramPradhanSection from '@/components/GramPradhanSection'
import ParticleBackground from '@/components/ParticleBackground'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-emerald-900 overflow-hidden relative">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-green-500/10 z-[1]" />
        
        <div className="relative z-10">

        {/* Hero Section with Golden Ratio (1:1.618) */}
        <section className="pt-24 pb-16 px-4 sm:px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Main content area: ~62% (golden ratio) */}
              <div className="lg:col-span-7 space-y-8">
                <div className="space-y-6 animate-fade-in">
                  <div className="inline-block bg-gradient-to-r from-orange-500/20 to-green-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 sm:px-6 py-2 animate-bounce-subtle">
                    <p className="text-sm sm:text-base text-orange-300 font-semibold">🌱 India&#39;s First Carbon Neutral Village</p>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight">
                    Welcome to
                    <span className="block bg-gradient-to-r from-orange-400 via-yellow-300 to-green-400 bg-clip-text text-transparent mt-2 animate-pulse-soft">
                      Damday Village
                    </span>
                  </h1>
                  
                  <p className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed">
                    Experience sustainable living, authentic culture, and eco-tourism in the heart of Uttarakhand&#39;s pristine mountains
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link href="/register">
                      <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full shadow-2xl hover:scale-105 transition-transform">
                        <Sparkles className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                        Join Our Mission
                      </Button>
                    </Link>
                    <Link href="/marketplace">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-full hover:scale-105 transition-transform">
                        <ShoppingBag className="mr-2 h-5 w-5 sm:h-6 sm:w-6" />
                        Explore Marketplace
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Sidebar area: ~38% (golden ratio complement) */}
              <div className="lg:col-span-5">
                <StatsSidebar />
              </div>
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="py-12 px-6">
          <div className="container mx-auto">
            <LeadershipSection />
          </div>
        </section>

        {/* About Section */}
        <AboutSection />

        {/* Gram Pradhan Section */}
        <GramPradhanSection />

        <section className="py-16 sm:py-20 px-4 sm:px-6">
          <div className="container mx-auto">
            <div className="text-center mb-12 sm:mb-16 animate-fade-in">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Discover Paradise</h2>
              <p className="text-lg sm:text-xl text-white/60">Experience the perfect blend of nature, culture and sustainability</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <FeatureCard
                icon={<Home className="h-10 w-10 sm:h-12 sm:w-12" />}
                title="Eco Homestays"
                description="Stay in carbon-neutral homes with modern amenities and traditional charm"
                color="from-orange-500 to-red-600"
                link="/homestays"
              />
              
              <FeatureCard
                icon={<Store className="h-10 w-10 sm:h-12 sm:w-12" />}
                title="Local Marketplace"
                description="Buy authentic organic products directly from village artisans"
                color="from-green-500 to-emerald-600"
                link="/marketplace"
              />
              
              <FeatureCard
                icon={<MapPin className="h-10 w-10 sm:h-12 sm:w-12" />}
                title="Cultural Tours"
                description="Explore pristine Himalayan landscapes and rich village heritage"
                color="from-blue-500 to-cyan-600"
                link="/tours"
              />
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4 sm:px-6 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
              <ImpactStat value="100%" label="Carbon Neutral" icon={<Leaf />} />
              <ImpactStat value="500+" label="Happy Visitors" icon={<Users />} />
              <ImpactStat value="50+" label="Local Products" icon={<Store />} />
              <ImpactStat value="10+" label="Eco Homestays" icon={<Home />} />
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20 px-4 sm:px-6">
          <div className="container mx-auto text-center">
            <div className="bg-gradient-to-r from-orange-500/20 to-green-500/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 max-w-4xl mx-auto hover:scale-105 transition-transform">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
                Ready to Experience Sustainable Living?
              </h2>
              <p className="text-lg sm:text-xl text-white/70 mb-6 sm:mb-8">
                Join thousands of eco-conscious travelers and support rural India
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg rounded-full shadow-xl hover:scale-105 transition-transform">
                    Get Started Today
                  </Button>
                </Link>
                <Link href="/blockchain">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 sm:px-10 py-5 sm:py-6 text-base sm:text-lg rounded-full hover:scale-105 transition-transform">
                    Explore Carbon Credits
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-12 px-6 bg-black/40 backdrop-blur-sm border-t border-white/10">
          <Footer />
        </footer>
      </div>
    </main>
    </>
  )
}

function FeatureCard({ icon, title, description, color, link }: any) {
  return (
    <Link href={link}>
      <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 hover:bg-white/10 transition-all hover:scale-105 cursor-pointer animate-scale-in">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className={`bg-gradient-to-br ${color} w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-2xl group-hover:scale-110 transition-transform`}>
          <div className="text-white">{icon}</div>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-orange-300 transition-colors">{title}</h3>
        <p className="text-sm sm:text-base text-white/60 mb-3 sm:mb-4 leading-relaxed group-hover:text-white/80 transition-colors">{description}</p>
        <div className="flex items-center text-orange-400 font-semibold group-hover:translate-x-2 transition-transform">
          Explore <ChevronRight className="ml-1 h-5 w-5" />
        </div>
      </div>
    </Link>
  )
}

function ImpactStat({ value, label, icon }: any) {
  return (
    <div className="text-center group cursor-pointer animate-scale-in">
      <div className="bg-gradient-to-br from-orange-500/20 to-green-500/20 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 mb-2 sm:mb-3 group-hover:scale-110 transition-transform">
        <div className="text-white mb-1 sm:mb-2 flex justify-center">{icon}</div>
        <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 group-hover:text-orange-300 transition-colors">{value}</p>
      </div>
      <p className="text-sm sm:text-base text-white/70 font-medium group-hover:text-white/90 transition-colors">{label}</p>
    </div>
  )
}
