'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, ShoppingBag } from 'lucide-react'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LeadershipSection from '@/components/LeadershipSection'
import AboutSection from '@/components/AboutSection'
import GramPradhanSection from '@/components/GramPradhanSection'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-purple-900/15 to-emerald-600/20 z-[1]" />
        
        <div className="relative z-10">

        {/* Hero Section - Full Width */}
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="container mx-auto max-w-full 2xl:max-w-[1800px]">
            <div className="space-y-8 text-center">
              <div className="space-y-6 animate-fade-in">
                <div className="inline-block bg-gradient-to-r from-orange-500/30 to-green-500/30 backdrop-blur-sm border border-orange-500/40 rounded-full px-4 sm:px-6 py-2 animate-bounce-subtle shadow-lg shadow-orange-500/20">
                  <p className="text-sm sm:text-base text-orange-200 font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">🌱 India&#39;s First Carbon Neutral Village</p>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                  Welcome to
                  <span className="block bg-gradient-to-r from-orange-400 via-yellow-300 to-green-400 bg-clip-text text-transparent mt-2 animate-pulse-soft drop-shadow-[0_4px_12px_rgba(255,153,51,0.6)]">
                    Damday Village
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                  Experience sustainable living, authentic culture, and eco-tourism in the heart of Uttarakhand&#39;s pristine mountains
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
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
          </div>
        </section>

        {/* Leadership Section - Right after hero */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-black/30 backdrop-blur-md">
          <div className="container mx-auto max-w-full 2xl:max-w-[1800px]">
            <LeadershipSection />
          </div>
        </section>

        {/* About Section with Discover Paradise */}
        <AboutSection />

        {/* Gram Pradhan Section */}
        <GramPradhanSection />

        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="container mx-auto text-center max-w-full 2xl:max-w-[1400px]">
            <div className="bg-gradient-to-r from-orange-500/30 to-green-500/30 backdrop-blur-xl border border-white/30 rounded-3xl p-8 sm:p-12 lg:p-16 hover:scale-[1.01] transition-transform shadow-2xl shadow-orange-500/20">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                Ready to Experience Sustainable Living?
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
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

        <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-black/40 backdrop-blur-sm border-t border-white/10">
          <Footer />
        </footer>
      </div>
    </main>
    </>
  )
}
