'use client'

export default function AboutSection() {
  return (
    <section className="py-12 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 sm:p-12 hover:scale-[1.02] transition-all">
          <div className="text-center mb-6">
            <div className="inline-block mb-3">
              <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500/20 to-green-500/20 backdrop-blur-sm border border-orange-300/30 rounded-full px-6 py-2">
                <span className="text-2xl">🌿</span>
                <span className="text-orange-300 font-semibold">About Us</span>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-300 via-yellow-200 to-green-300 bg-clip-text text-transparent mb-4">
              A Vision for Sustainable Tomorrow
            </h2>
          </div>
          
          <div className="space-y-4 text-center">
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed">
              Damday Village stands as India's pioneering carbon-neutral village, harmoniously blending ancient wisdom with modern innovation. 
              Nestled in the pristine Himalayas of Uttarakhand, we are committed to preserving our environment while empowering our community.
            </p>
            
            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              Through sustainable practices, eco-tourism, and the revolutionary DamChain blockchain technology, 
              we're creating a model for rural development that honors tradition while embracing the future. 
              Our mission is to inspire communities worldwide to adopt sustainable living practices that benefit both people and planet.
            </p>
            
            <div className="grid grid-cols-3 gap-4 pt-6">
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
          </div>
        </div>
      </div>
    </section>
  )
}
