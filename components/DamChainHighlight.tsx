'use client'

import { Zap, Shield, Globe, TrendingUp } from 'lucide-react'

export default function DamChainHighlight() {
  const highlights = [
    { icon: <Zap className="h-5 w-5" />, title: '100,000+ TPS', description: 'Lightning fast transactions', color: 'from-yellow-500 to-orange-500' },
    { icon: <Shield className="h-5 w-5" />, title: 'Quantum-Resistant', description: '256-bit security', color: 'from-blue-500 to-cyan-500' },
    { icon: <Globe className="h-5 w-5" />, title: 'Cross-Chain', description: 'Interoperable ecosystem', color: 'from-green-500 to-emerald-500' },
    { icon: <TrendingUp className="h-5 w-5" />, title: 'Eco-Friendly', description: '<0.00001 kWh/tx', color: 'from-purple-500 to-pink-500' },
  ]

  return (
    <div className="mt-6 space-y-3">
      <div className="text-center mb-4">
        <h4 className="text-lg font-bold text-white mb-1">DamChain Blockchain</h4>
        <p className="text-xs text-white/60">Revolutionary Technology</p>
      </div>
      
      {highlights.map((highlight, idx) => (
        <div 
          key={idx}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-3 hover:bg-white/15 transition-all hover:scale-105 cursor-pointer group"
        >
          <div className="flex items-center space-x-3">
            <div className={`bg-gradient-to-br ${highlight.color} p-2 rounded-lg shadow-lg group-hover:scale-110 transition-transform`}>
              <div className="text-white">{highlight.icon}</div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors">{highlight.title}</p>
              <p className="text-xs text-white/60 group-hover:text-white/80 transition-colors">{highlight.description}</p>
            </div>
          </div>
        </div>
      ))}
      
      <div className="mt-4 text-center">
        <a 
          href="/blockchain"
          className="inline-block text-sm text-orange-400 hover:text-orange-300 transition-colors font-medium"
        >
          Learn More About DamChain →
        </a>
      </div>
    </div>
  )
}
