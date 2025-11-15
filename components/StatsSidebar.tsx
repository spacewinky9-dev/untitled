'use client'

import { ChevronRight, TrendingUp, Users, Store, Home, Award, Heart, Leaf } from 'lucide-react'

export default function StatsSidebar() {
  const stats = [
    { icon: <Users className="h-6 w-6" />, value: '2,500+', label: 'Community Members', color: 'from-orange-500 to-red-500' },
    { icon: <Store className="h-6 w-6" />, value: '150+', label: 'Local Products', color: 'from-green-500 to-emerald-500' },
    { icon: <Home className="h-6 w-6" />, value: '25+', label: 'Eco Homestays', color: 'from-blue-500 to-cyan-500' },
    { icon: <TrendingUp className="h-6 w-6" />, value: '100%', label: 'Carbon Neutral', color: 'from-purple-500 to-pink-500' },
    { icon: <Award className="h-6 w-6" />, value: '#1', label: 'Green Village', color: 'from-yellow-500 to-orange-500' },
    { icon: <Heart className="h-6 w-6" />, value: '5000+', label: 'Happy Visitors', color: 'from-red-500 to-rose-500' },
  ]

  return (
    <div className="sticky top-24 space-y-3">
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
