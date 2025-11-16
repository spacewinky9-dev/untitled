'use client'

import { useState } from 'react'
import { Quote } from 'lucide-react'

export default function GramPradhanSection() {
  const [imageError, setImageError] = useState(false)
  const imageUrl = 'https://github.com/user-attachments/assets/6ccb032f-a39c-4b0d-988b-f196784e1940'
  
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
      <div className="container mx-auto max-w-full 2xl:max-w-[1800px]">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:scale-[1.01] transition-all">
          <div className="grid md:grid-cols-2 gap-8 items-center p-8 sm:p-12">
            {/* Image Section */}
            <div className="flex justify-center md:justify-start">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-2xl overflow-hidden ring-4 ring-orange-400/50 shadow-2xl">
                {!imageError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageUrl}
                    alt="Shiwani Vishwakarma - Gram Pradhan"
                    className="object-cover w-full h-full"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-green-500 flex flex-col items-center justify-center">
                    <span className="text-6xl font-bold text-white mb-2">SV</span>
                    <span className="text-white text-sm">Gram Pradhan</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Quote Section */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  Shiwani Vishwakarma
                </h3>
                <p className="text-base sm:text-lg text-orange-300 font-medium">
                  Gram Pradhan, Damday Village
                </p>
              </div>
              
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 h-10 w-10 text-orange-400/30" />
                <blockquote className="relative pl-8 space-y-4">
                  <p className="text-lg sm:text-xl text-white/90 leading-relaxed italic">
                    &ldquo;Climate change is not just an environmental challenge—it&apos;s a test of our civilization&apos;s will to survive and thrive. 
                    Every small action we take today shapes the world our children will inherit tomorrow.&rdquo;
                  </p>
                  
                  <p className="text-base sm:text-lg text-white/80 leading-relaxed">
                    &ldquo;Through unity, innovation, and unwavering commitment to sustainability, we are proving that rural communities 
                    can lead the way in creating a harmonious balance between development and environmental preservation. 
                    Our journey is a testament to the power of positive action and collective responsibility.&rdquo;
                  </p>
                  
                  <p className="text-base sm:text-lg text-white/70 leading-relaxed font-medium">
                    &ldquo;Let us work together to build a future where prosperity and planet protection go hand in hand, 
                    where tradition meets technology, and where every life flourishes in harmony with nature.&rdquo;
                  </p>
                </blockquote>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <div className="h-1 w-20 bg-gradient-to-r from-orange-400 to-green-500 rounded-full"></div>
                <span className="text-sm text-white/60">Leading with Vision & Purpose</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
