'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp, Users, Leaf, Building } from 'lucide-react'

interface Stat {
  label: string
  value: string
  icon: any
  color: string
}

export default function StatsSidebar() {
  const stats: Stat[] = [
    { label: 'Carbon Neutral', value: '100%', icon: Leaf, color: 'text-green-600' },
    { label: 'Villagers', value: '2,500+', icon: Users, color: 'text-blue-600' },
    { label: 'Homestays', value: '15+', icon: Building, color: 'text-purple-600' },
    { label: 'Growth', value: '25%', icon: TrendingUp, color: 'text-orange-600' },
  ]

  return (
    <div className="sticky top-24 space-y-4">
      <Card className="p-6 bg-gradient-to-br from-orange-500 to-green-600 text-white">
        <h3 className="text-xl font-bold mb-4">Village Stats</h3>
        <div className="space-y-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
      
      <Card className="p-6">
        <h4 className="font-bold mb-3">Latest Updates</h4>
        <div className="space-y-3 text-sm">
          <div className="border-l-2 border-orange-500 pl-3">
            <div className="font-medium">New Homestay</div>
            <div className="text-gray-600">Opened this month</div>
          </div>
          <div className="border-l-2 border-green-500 pl-3">
            <div className="font-medium">Carbon Goal</div>
            <div className="text-gray-600">Achieved 100%</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
