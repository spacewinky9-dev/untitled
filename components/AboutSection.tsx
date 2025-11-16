'use client'

import Link from 'next/link'
import { Home, Store, MapPin, ChevronRight } from 'lucide-react'

export default function AboutSection() {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div className="container mx-auto max-w-full 2xl:max-w-[1800px]">
        <div className="w-full">
          {/* About Content - Full Width */}
          <div className="w-full">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 lg:p-16 hover:scale-[1.01] transition-all h-full">
              <div className="mb-6">
                <div className="inline-block mb-3">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500/20 to-green-500/20 backdrop-blur-sm border border-orange-300/30 rounded-full px-6 py-2">
                    <span className="text-2xl">🌿</span>
                    <span className="text-orange-300 font-semibold">About Us</span>
                  </div>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-300 via-yellow-200 to-green-300 bg-clip-text text-transparent mb-4">
                  A Vision for Sustainable Tomorrow
                </h2>
              </div>
              
              <div className="space-y-4">
                <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
                  Damday Village stands as India&apos;s pioneering carbon-neutral village, harmoniously blending ancient wisdom with modern innovation. 
                  Nestled in the pristine Himalayas of Uttarakhand, we are committed to preserving our environment while empowering our community.
                </p>
                
                <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                  Through sustainable practices, eco-tourism, and the revolutionary DamChain blockchain technology, 
                  we&apos;re creating a model for rural development that honors tradition while embracing the future. 
                  Our mission is to inspire communities worldwide to adopt sustainable living practices that benefit both people and planet.
                </p>
                
                <div className="grid grid-cols-3 gap-4 pt-6 pb-8">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-orange-400 mb-1">100%</div>
                    <div className="text-xs sm:text-sm text-white/60">Carbon Neutral</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-green-400 mb-1">2,500+</div>
                    <div className="text-xs sm:text-sm text-white/60">Community</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-1">#1</div>
                    <div className="text-xs sm:text-sm text-white/60">Green Village</div>
                  </div>
                </div>

                {/* Discover Paradise Section - Now inside About box */}
                <div className="pt-8 border-t border-white/10">
                  <div className="text-center mb-8">
                    <h3 className="text-3xl sm:text-4xl font-bold text-white mb-3 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">Discover Paradise</h3>
                    <p className="text-base sm:text-lg text-white/70 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">Experience the perfect blend of nature, culture and sustainability</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <FeatureCard
                      icon={<Home className="h-8 w-8 sm:h-10 sm:w-10" />}
                      title="Eco Homestays"
                      description="Stay in carbon-neutral homes with modern amenities and traditional charm"
                      color="from-orange-500 to-red-600"
                      link="/homestays"
                    />
                    
                    <FeatureCard
                      icon={<Store className="h-8 w-8 sm:h-10 sm:w-10" />}
                      title="Local Marketplace"
                      description="Buy authentic organic products directly from village artisans"
                      color="from-green-500 to-emerald-600"
                      link="/marketplace"
                    />
                    
                    <FeatureCard
                      icon={<MapPin className="h-8 w-8 sm:h-10 sm:w-10" />}
                      title="Cultural Tours"
                      description="Explore pristine Himalayan landscapes and rich village heritage"
                      color="from-blue-500 to-cyan-600"
                      link="/tours"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description, color, link }: any) {
  return (
    <Link href={link}>
      <div className="group relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 sm:p-6 hover:bg-white/15 transition-all hover:scale-105 cursor-pointer shadow-xl shadow-black/30">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className={`bg-gradient-to-br ${color} w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-2xl group-hover:scale-110 transition-transform`}>
          <div className="text-white">{icon}</div>
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">{title}</h3>
        <p className="text-xs sm:text-sm text-white/80 mb-2 sm:mb-3 leading-relaxed group-hover:text-white/95 transition-colors drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">{description}</p>
        <div className="flex items-center text-orange-400 font-semibold group-hover:translate-x-2 transition-transform drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-sm">
          Explore <ChevronRight className="ml-1 h-4 w-4" />
        </div>
      </div>
    </Link>
  )
}
