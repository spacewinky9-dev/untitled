'use client'

import { ChevronRight, TrendingUp, Users, Store, Home, Award, Heart } from 'lucide-react'
import DamChainHighlight from './DamChainHighlight'

export default function StatsSidebar() {
  const stats = [
    { icon: <Users className="h-5 w-5" />, value: '2,500+', label: 'Community Members', color: 'from-orange-500 to-red-500' },
    { icon: <Store className="h-5 w-5" />, value: '150+', label: 'Local Products', color: 'from-green-500 to-emerald-500' },
    { icon: <Home className="h-5 w-5" />, value: '25+', label: 'Eco Homestays', color: 'from-blue-500 to-cyan-500' },
    { icon: <TrendingUp className="h-5 w-5" />, value: '100%', label: 'Carbon Neutral', color: 'from-purple-500 to-pink-500' },
    { icon: <Award className="h-5 w-5" />, value: '#1', label: 'Green Village', color: 'from-yellow-500 to-orange-500' },
    { icon: <Heart className="h-5 w-5" />, value: '5000+', label: 'Happy Visitors', color: 'from-red-500 to-rose-500' },
  ]

  return (
    <div className="lg:sticky lg:top-24 space-y-2">
      <div className="mb-3 hidden lg:block">
        <h3 className="text-lg font-bold text-white mb-1 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">Live Stats</h3>
        <p className="text-xs text-white/80 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Real-time metrics</p>
      </div>
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-xl p-3 hover:bg-white/20 transition-all hover:scale-105 cursor-pointer group shadow-lg shadow-black/30"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`bg-gradient-to-br ${stat.color} p-2 rounded-lg shadow-lg group-hover:scale-110 transition-transform`}>
                <div className="text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">{stat.icon}</div>
              </div>
              <div>
                <p className="text-lg font-bold text-white group-hover:text-orange-300 transition-colors drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">{stat.value}</p>
                <p className="text-xs text-white/80 group-hover:text-white/95 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">{stat.label}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-white/50 group-hover:text-white/80 group-hover:translate-x-1 transition-all drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" />
          </div>
        </div>
      ))}
      
      {/* DamChain Highlight */}
      <div className="hidden lg:block">
        <DamChainHighlight />
      </div>
    </div>
  )
}
