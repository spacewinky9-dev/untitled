'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import AdminSidebar from '@/components/admin/Sidebar'
import {
  Shield, Activity, Database, Network, TrendingUp, Server,
  CheckCircle, Settings
} from 'lucide-react'

export default function AdminBlockchainPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/blockchain/stats')
        const data = await res.json()
        setStats(data)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-6">Blockchain Dashboard</h1>
          
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Database className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-sm text-gray-600">Total Transactions</div>
                    <div className="text-2xl font-bold">{stats?.transactions || 0}</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Shield className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-sm text-gray-600">NFTs Minted</div>
                    <div className="text-2xl font-bold">{stats?.nfts || 0}</div>
                  </div>
                </div>
              </Card>
              
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Network className="h-8 w-8 text-purple-600" />
                  <div>
                    <div className="text-sm text-gray-600">Network Status</div>
                    <div className="text-2xl font-bold">Active</div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
