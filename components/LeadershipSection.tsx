'use client'

import Image from 'next/image'
import { useState } from 'react'

interface Leader {
  name: string
  title: string
  imageUrl: string
  description: string
}

export default function LeadershipSection() {
  const leaders: Leader[] = [
    {
      name: 'Smt. Droupadi Murmu',
      title: 'Hon\'ble President of India',
      imageUrl: 'https://github.com/user-attachments/assets/4eff0c94-a647-4f83-aa35-b6a6ce2f7c59',
      description: 'Inspiring India\'s vision for environmental conservation and sustainable development.',
    },
    {
      name: 'Shri Narendra Modi',
      title: 'Hon\'ble Prime Minister of India',
      imageUrl: 'https://github.com/user-attachments/assets/6923e12b-f0e3-4252-9a84-fa9dfde16a64',
      description: 'Leading India\'s vision for sustainable development and carbon neutrality.',
    },
    {
      name: 'Shri Pushkar Singh Dhami',
      title: 'Hon\'ble Chief Minister of Uttarakhand',
      imageUrl: 'https://github.com/user-attachments/assets/263e4687-4d39-4baf-84b2-2c37126729bc',
      description: 'Championing Devbhumi\'s journey towards environmental conservation and rural development.',
    },
  ]

  return (
    <section className="py-12 bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-orange-500/20 to-green-500/20 backdrop-blur-sm border border-orange-300/30 rounded-full px-6 py-2">
              <span className="text-2xl">🇮🇳</span>
              <span className="text-orange-300 font-semibold">Leadership & Vision</span>
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-orange-300 to-green-300 bg-clip-text text-transparent">
            Visionary Leadership Driving Change
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Under the visionary leadership of our national and state leaders, 
            Damday Village is pioneering sustainable development in the Himalayas
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {leaders.map((leader, index) => (
            <LeaderCard key={leader.name} leader={leader} index={index} />
          ))}
        </div>

        <div className="mt-8 text-center animate-fade-in">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500/20 to-green-600/20 backdrop-blur-sm border border-orange-300/30 text-white rounded-full shadow-md hover:scale-105 transition-transform cursor-pointer">
            <span className="text-sm font-medium">
              🌱 Empowering Rural India through Digital Innovation & Sustainability
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function LeaderCard({ leader, index }: { leader: Leader; index: number }) {
  const [imageError, setImageError] = useState(false)
  
  return (
    <div
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:bg-white/15 hover:scale-105 transition-all group"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-40 h-40 mb-4 rounded-full overflow-hidden ring-4 ring-orange-300/50 shadow-xl group-hover:ring-orange-400/70 transition-all">
            {!imageError ? (
              <img
                src={leader.imageUrl}
                alt={leader.name}
                className="object-cover w-full h-full"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-400 to-green-500 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {leader.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            )}
          </div>
          <h3 className="text-lg font-bold text-white mb-1 group-hover:text-orange-300 transition-colors">
            {leader.name}
          </h3>
          <p className="text-xs font-medium text-orange-300 mb-3 px-3 py-1 bg-orange-500/20 rounded-full">
            {leader.title}
          </p>
          <p className="text-xs text-white/60 leading-relaxed group-hover:text-white/80 transition-colors">
            {leader.description}
          </p>
        </div>
      </div>
    </div>
  )
}
