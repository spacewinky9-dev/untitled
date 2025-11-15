'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import AdminSidebar from '@/components/admin/Sidebar'
import {
  Activity, TrendingUp, Database, Shield, Network, Wallet,
  ArrowUpDown, Filter, Download, Plus, Search, Eye,
  Settings, Zap, DollarSign, Users, Clock, CheckCircle,
  XCircle, AlertCircle, BarChart3, PieChart, LineChart
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Transaction {
  id: string
  hash: string
  from: string
  to: string
  amount: string
  timestamp: number
  status: 'pending' | 'confirmed' | 'failed'
  gasUsed: string
  type: 'transfer' | 'carbon_credit' | 'smart_contract'
}

interface CarbonCredit {
  id: string
  name: string
  amount: number
  price: number
  owner: string
  verified: boolean
  project: string
}

export default function AdvancedBlockchainPage() {
  const [activeTab, setActiveTab] = useState('explorer')
  const [stats, setStats] = useState<any>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [carbonCredits, setCarbonCredits] = useState<CarbonCredit[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [gasPrice, setGasPrice] = useState<any>(null)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, gasPriceRes] = await Promise.all([
        fetch('/api/blockchain/stats'),
        fetch('/api/blockchain/gas-price')
      ])
      
      const statsData = await statsRes.json()
      const gasPriceData = await gasPriceRes.json()
      
      setStats(statsData)
      setGasPrice(gasPriceData)
      
      // Mock transaction data for demo
      setTransactions([
        {
          id: '1',
          hash: '0x1234...5678',
          from: '0xabcd...efgh',
          to: '0x9876...5432',
          amount: '1.5',
          timestamp: Date.now() - 300000,
          status: 'confirmed',
          gasUsed: '21000',
          type: 'carbon_credit'
        },
        {
          id: '2',
          hash: '0x2345...6789',
          from: '0xbcde...fghi',
          to: '0x8765...4321',
          amount: '0.5',
          timestamp: Date.now() - 600000,
          status: 'confirmed',
          gasUsed: '35000',
          type: 'transfer'
        },
        {
          id: '3',
          hash: '0x3456...7890',
          from: '0xcdef...ghij',
          to: '0x7654...3210',
          amount: '2.0',
          timestamp: Date.now() - 120000,
          status: 'pending',
          gasUsed: '0',
          type: 'smart_contract'
        }
      ])
      
      // Mock carbon credits data
      setCarbonCredits([
        {
          id: '1',
          name: 'Himalayan Reforestation',
          amount: 1000,
          price: 50,
          owner: '0xabcd...efgh',
          verified: true,
          project: 'Tree Plantation Drive'
        },
        {
          id: '2',
          name: 'Solar Energy Project',
          amount: 500,
          price: 75,
          owner: '0xbcde...fghi',
          verified: true,
          project: 'Village Solar Power'
        },
        {
          id: '3',
          name: 'Organic Farming Initiative',
          amount: 750,
          price: 40,
          owner: '0xcdef...ghij',
          verified: false,
          project: 'Sustainable Agriculture'
        }
      ])
      
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(tx => {
    if (filter !== 'all' && tx.status !== filter) return false
    if (searchTerm && !tx.hash.toLowerCase().includes(searchTerm.toLowerCase())) return false
    return true
  })

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Blockchain Dashboard</h1>
            <p className="text-gray-600">Comprehensive blockchain management and analytics</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Transactions</p>
                  <p className="text-2xl font-bold">{stats?.transactions || 0}</p>
                  <p className="text-xs text-green-600 mt-1">+12% this week</p>
                </div>
                <Database className="h-12 w-12 text-blue-600 opacity-80" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Carbon Credits</p>
                  <p className="text-2xl font-bold">{carbonCredits.length}</p>
                  <p className="text-xs text-green-600 mt-1">+5% this month</p>
                </div>
                <Shield className="h-12 w-12 text-green-600 opacity-80" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Gas Price</p>
                  <p className="text-2xl font-bold">{gasPrice?.current || 0.001} ETH</p>
                  <p className="text-xs text-orange-600 mt-1">Optimized</p>
                </div>
                <Zap className="h-12 w-12 text-yellow-600 opacity-80" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Network Status</p>
                  <p className="text-2xl font-bold text-green-600">Active</p>
                  <p className="text-xs text-gray-600 mt-1">100% Uptime</p>
                </div>
                <Network className="h-12 w-12 text-purple-600 opacity-80" />
              </div>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-6 lg:w-auto lg:inline-grid">
              <TabsTrigger value="explorer">
                <Eye className="h-4 w-4 mr-2" />
                Explorer
              </TabsTrigger>
              <TabsTrigger value="carbon">
                <Shield className="h-4 w-4 mr-2" />
                Carbon Credits
              </TabsTrigger>
              <TabsTrigger value="contracts">
                <Database className="h-4 w-4 mr-2" />
                Smart Contracts
              </TabsTrigger>
              <TabsTrigger value="gas">
                <Zap className="h-4 w-4 mr-2" />
                Gas Optimizer
              </TabsTrigger>
              <TabsTrigger value="wallet">
                <Wallet className="h-4 w-4 mr-2" />
                Wallet
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Blockchain Explorer Tab */}
            <TabsContent value="explorer" className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Transaction History</h2>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by hash..."
                        className="pl-10 pr-4 py-2 border rounded-lg text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <select
                      className="px-4 py-2 border rounded-lg text-sm"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Hash</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">From</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">To</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Type</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Time</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm font-mono text-blue-600">{tx.hash}</td>
                          <td className="py-3 px-4 text-sm font-mono">{tx.from}</td>
                          <td className="py-3 px-4 text-sm font-mono">{tx.to}</td>
                          <td className="py-3 px-4 text-sm font-semibold">{tx.amount} ETH</td>
                          <td className="py-3 px-4 text-sm">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                              {tx.type.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <span className={`flex items-center gap-1 ${
                              tx.status === 'confirmed' ? 'text-green-600' :
                              tx.status === 'pending' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {tx.status === 'confirmed' && <CheckCircle className="h-4 w-4" />}
                              {tx.status === 'pending' && <Clock className="h-4 w-4" />}
                              {tx.status === 'failed' && <XCircle className="h-4 w-4" />}
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-600">
                            {new Date(tx.timestamp).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            {/* Carbon Credit Marketplace Tab */}
            <TabsContent value="carbon" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Carbon Credit Marketplace</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  List New Credit
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {carbonCredits.map((credit) => (
                  <Card key={credit.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{credit.name}</h3>
                        <p className="text-sm text-gray-600">{credit.project}</p>
                      </div>
                      {credit.verified && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Amount:</span>
                        <span className="font-semibold">{credit.amount} tons CO₂</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Price:</span>
                        <span className="font-semibold text-green-600">₹{credit.price}/ton</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Owner:</span>
                        <span className="font-mono text-xs">{credit.owner}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        <DollarSign className="h-4 w-4 mr-1" />
                        Buy
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Smart Contracts Tab */}
            <TabsContent value="contracts" className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Smart Contract Deployment</h2>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Deploy Contract
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Contract Type</label>
                      <select className="w-full px-4 py-2 border rounded-lg">
                        <option>ERC-20 Token</option>
                        <option>ERC-721 NFT</option>
                        <option>Carbon Credit</option>
                        <option>Custom Contract</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Contract Name</label>
                      <input
                        type="text"
                        placeholder="Enter contract name"
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Initial Supply</label>
                      <input
                        type="number"
                        placeholder="1000000"
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>

                    <Button className="w-full">Deploy to Blockchain</Button>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Deployed Contracts</h3>
                    <div className="space-y-2">
                      {[
                        { name: 'DamCoin Token', address: '0x1234...5678', type: 'ERC-20' },
                        { name: 'Carbon NFT', address: '0x2345...6789', type: 'ERC-721' },
                        { name: 'Village DAO', address: '0x3456...7890', type: 'Governance' }
                      ].map((contract, idx) => (
                        <div key={idx} className="bg-white p-3 rounded border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{contract.name}</span>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              {contract.type}
                            </span>
                          </div>
                          <p className="text-xs font-mono text-gray-600">{contract.address}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Gas Price Optimizer Tab */}
            <TabsContent value="gas" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Gas Price Optimizer Dashboard</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <Card className="p-4 bg-green-50 border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Low (Slow)</p>
                    <p className="text-2xl font-bold text-green-600">{gasPrice?.slow || '0.001'} ETH</p>
                    <p className="text-xs text-gray-500 mt-1">~30 min</p>
                  </Card>

                  <Card className="p-4 bg-yellow-50 border-yellow-200">
                    <p className="text-sm text-gray-600 mb-1">Medium (Average)</p>
                    <p className="text-2xl font-bold text-yellow-600">{gasPrice?.average || '0.002'} ETH</p>
                    <p className="text-xs text-gray-500 mt-1">~5 min</p>
                  </Card>

                  <Card className="p-4 bg-red-50 border-red-200">
                    <p className="text-sm text-gray-600 mb-1">High (Fast)</p>
                    <p className="text-2xl font-bold text-red-600">{gasPrice?.fast || '0.003'} ETH</p>
                    <p className="text-xs text-gray-500 mt-1">~30 sec</p>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3">AI-Powered Gas Prediction</h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-3">
                        <TrendingUp className="h-5 w-5 text-blue-600 mt-1" />
                        <div>
                          <p className="font-medium text-blue-900 mb-1">Recommendation: Use Medium Gas Price</p>
                          <p className="text-sm text-blue-700">
                            Based on historical data and current network utilization (45%), 
                            you can save up to 25% by waiting 10 minutes for lower gas prices.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Gas Savings This Month</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">₹4,250</p>
                        <p className="text-sm text-gray-600 mt-1">Total Saved</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">15%</p>
                        <p className="text-sm text-gray-600 mt-1">Average Reduction</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">127</p>
                        <p className="text-sm text-gray-600 mt-1">Transactions Optimized</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Wallet Tab */}
            <TabsContent value="wallet" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Admin Wallet Management</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
                      <p className="text-sm opacity-90 mb-1">Total Balance</p>
                      <p className="text-3xl font-bold mb-3">15.75 ETH</p>
                      <p className="text-sm">≈ ₹1,575,000</p>
                    </div>

                    <Button className="w-full" size="lg">
                      <Wallet className="h-5 w-5 mr-2" />
                      Connect MetaMask
                    </Button>

                    <div className="space-y-2">
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Receive Funds
                      </Button>
                      <Button variant="outline" className="w-full">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        Send Funds
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Token Holdings</h3>
                    <div className="space-y-2">
                      {[
                        { name: 'DamCoin', symbol: 'DAM', balance: '10,000', value: '₹50,000' },
                        { name: 'Carbon Credit Token', symbol: 'CCT', balance: '500', value: '₹25,000' },
                        { name: 'Governance Token', symbol: 'GOV', balance: '100', value: '₹10,000' }
                      ].map((token, idx) => (
                        <div key={idx} className="p-3 border rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                              {token.symbol[0]}
                            </div>
                            <div>
                              <p className="font-medium">{token.name}</p>
                              <p className="text-sm text-gray-600">{token.balance} {token.symbol}</p>
                            </div>
                          </div>
                          <p className="font-semibold text-green-600">{token.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Transaction Volume</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <LineChart className="h-16 w-16 text-gray-400" />
                    <p className="text-sm text-gray-500 ml-2">Chart visualization</p>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4">Carbon Credit Distribution</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                    <PieChart className="h-16 w-16 text-gray-400" />
                    <p className="text-sm text-gray-500 ml-2">Chart visualization</p>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Avg Block Time', value: '2.3s', trend: '+5%' },
                    { label: 'TPS (Current)', value: '1,234', trend: '+12%' },
                    { label: 'Network Hashrate', value: '450 TH/s', trend: '+8%' },
                    { label: 'Active Nodes', value: '5,432', trend: '+15%' }
                  ].map((metric, idx) => (
                    <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-sm text-gray-600 mt-1">{metric.label}</p>
                      <p className="text-xs text-green-600 mt-1">{metric.trend}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
