'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import AdminSidebar from '@/components/admin/Sidebar'
import {
  Mail, Send, Users, TrendingUp, Calendar, Target, 
  BarChart3, Plus, Eye, Edit, Trash2, Copy, Download,
  MessageSquare, Share2, Globe, Clock, CheckCircle
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Campaign {
  id: string
  name: string
  type: 'email' | 'sms' | 'social'
  status: 'active' | 'draft' | 'scheduled' | 'completed'
  audience: number
  sent: number
  opened: number
  clicked: number
  scheduledDate?: string
}

interface Automation {
  id: string
  name: string
  trigger: string
  active: boolean
  runs: number
  lastRun?: string
}

export default function MarketingAutomationPage() {
  const [activeTab, setActiveTab] = useState('campaigns')
  
  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Welcome New Users',
      type: 'email',
      status: 'active',
      audience: 1250,
      sent: 1200,
      opened: 720,
      clicked: 340
    },
    {
      id: '2',
      name: 'Carbon Credit Launch',
      type: 'email',
      status: 'scheduled',
      audience: 2500,
      sent: 0,
      opened: 0,
      clicked: 0,
      scheduledDate: '2024-12-20'
    },
    {
      id: '3',
      name: 'Tour Package Promotion',
      type: 'sms',
      status: 'completed',
      audience: 800,
      sent: 800,
      opened: 650,
      clicked: 250
    }
  ])

  const [automations] = useState<Automation[]>([
    {
      id: '1',
      name: 'New User Onboarding',
      trigger: 'User Registration',
      active: true,
      runs: 145,
      lastRun: '2 hours ago'
    },
    {
      id: '2',
      name: 'Abandoned Cart Recovery',
      trigger: 'Cart Abandoned > 24h',
      active: true,
      runs: 78,
      lastRun: '5 hours ago'
    },
    {
      id: '3',
      name: 'Re-engagement Campaign',
      trigger: 'Inactive > 30 days',
      active: false,
      runs: 230,
      lastRun: '1 week ago'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700'
      case 'scheduled': return 'bg-blue-100 text-blue-700'
      case 'draft': return 'bg-gray-100 text-gray-700'
      case 'completed': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Marketing Automation</h1>
            <p className="text-gray-600">Automated campaigns and customer engagement tools</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Campaigns</p>
                  <p className="text-2xl font-bold">{campaigns.length}</p>
                  <p className="text-xs text-green-600 mt-1">+2 this month</p>
                </div>
                <Mail className="h-12 w-12 text-blue-600 opacity-80" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Automations</p>
                  <p className="text-2xl font-bold">{automations.filter(a => a.active).length}</p>
                  <p className="text-xs text-blue-600 mt-1">Running smoothly</p>
                </div>
                <Target className="h-12 w-12 text-green-600 opacity-80" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Open Rate</p>
                  <p className="text-2xl font-bold">58.3%</p>
                  <p className="text-xs text-green-600 mt-1">+5.2% vs last month</p>
                </div>
                <BarChart3 className="h-12 w-12 text-purple-600 opacity-80" />
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Reach</p>
                  <p className="text-2xl font-bold">4,550</p>
                  <p className="text-xs text-orange-600 mt-1">Users reached</p>
                </div>
                <Users className="h-12 w-12 text-orange-600 opacity-80" />
              </div>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
              <TabsTrigger value="campaigns">
                <Mail className="h-4 w-4 mr-2" />
                Campaigns
              </TabsTrigger>
              <TabsTrigger value="automation">
                <Target className="h-4 w-4 mr-2" />
                Automation
              </TabsTrigger>
              <TabsTrigger value="templates">
                <Copy className="h-4 w-4 mr-2" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="segments">
                <Users className="h-4 w-4 mr-2" />
                Segments
              </TabsTrigger>
            </TabsList>

            {/* Campaigns Tab */}
            <TabsContent value="campaigns" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Marketing Campaigns</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Campaign
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {campaigns.map((campaign) => (
                  <Card key={campaign.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{campaign.name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(campaign.status)}`}>
                            {campaign.status}
                          </span>
                          {campaign.type === 'email' && <Mail className="h-4 w-4 text-gray-400" />}
                          {campaign.type === 'sms' && <MessageSquare className="h-4 w-4 text-gray-400" />}
                          {campaign.type === 'social' && <Share2 className="h-4 w-4 text-gray-400" />}
                        </div>
                        {campaign.scheduledDate && (
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Scheduled for: {campaign.scheduledDate}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-2xl font-bold">{campaign.audience}</p>
                        <p className="text-xs text-gray-600 mt-1">Audience</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <p className="text-2xl font-bold text-blue-600">{campaign.sent}</p>
                        <p className="text-xs text-gray-600 mt-1">Sent</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <p className="text-2xl font-bold text-green-600">
                          {campaign.sent > 0 ? Math.round((campaign.opened / campaign.sent) * 100) : 0}%
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Open Rate</p>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded">
                        <p className="text-2xl font-bold text-purple-600">
                          {campaign.sent > 0 ? Math.round((campaign.clicked / campaign.sent) * 100) : 0}%
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Click Rate</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Automation Tab */}
            <TabsContent value="automation" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Marketing Automations</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Automation
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {automations.map((automation) => (
                  <Card key={automation.id} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-lg">{automation.name}</h3>
                          {automation.active ? (
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Active
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                              Inactive
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Trigger:</strong> {automation.trigger}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-600">
                            <strong>{automation.runs}</strong> runs
                          </span>
                          {automation.lastRun && (
                            <span className="text-gray-600 flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              Last run: {automation.lastRun}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          {automation.active ? 'Pause' : 'Activate'}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="p-6 mt-6">
                <h3 className="font-semibold mb-4">Available Triggers</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'User Registration',
                    'First Purchase',
                    'Cart Abandoned',
                    'Booking Completed',
                    'Review Submitted',
                    'Inactivity (30 days)',
                    'Birthday',
                    'Subscription Renewal',
                    'Product Back in Stock'
                  ].map((trigger, idx) => (
                    <div key={idx} className="p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors">
                      <p className="text-sm font-medium">{trigger}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* Templates Tab */}
            <TabsContent value="templates" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Email Templates</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Template
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Welcome Email', category: 'Onboarding', uses: 145 },
                  { name: 'Newsletter Template', category: 'Marketing', uses: 89 },
                  { name: 'Booking Confirmation', category: 'Transactional', uses: 234 },
                  { name: 'Password Reset', category: 'System', uses: 67 },
                  { name: 'Promotion Alert', category: 'Marketing', uses: 123 },
                  { name: 'Review Request', category: 'Engagement', uses: 98 }
                ].map((template, idx) => (
                  <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="mb-4">
                      <h3 className="font-bold mb-2">{template.name}</h3>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Used {template.uses} times</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-6">Campaign Performance</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <h3 className="font-semibold mb-4">Email Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Delivery Rate</span>
                        <span className="font-bold">98.5%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '98.5%' }}></div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-600">Open Rate</span>
                        <span className="font-bold">58.3%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '58.3%' }}></div>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-600">Click Rate</span>
                        <span className="font-bold">23.7%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: '23.7%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Top Performing Campaigns</h3>
                    <div className="space-y-3">
                      {[
                        { name: 'Welcome Series', rate: '72%', color: 'green' },
                        { name: 'Product Launch', rate: '65%', color: 'blue' },
                        { name: 'Tour Promotion', rate: '58%', color: 'purple' },
                        { name: 'Newsletter', rate: '45%', color: 'orange' }
                      ].map((campaign, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <span className="text-sm font-medium">{campaign.name}</span>
                          <span className={`text-sm font-bold text-${campaign.color}-600`}>{campaign.rate}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Revenue Attribution</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-3xl font-bold text-green-600">₹125,000</p>
                      <p className="text-sm text-gray-600 mt-1">Email Campaigns</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-3xl font-bold text-blue-600">₹78,000</p>
                      <p className="text-sm text-gray-600 mt-1">SMS Campaigns</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <p className="text-3xl font-bold text-purple-600">₹45,000</p>
                      <p className="text-sm text-gray-600 mt-1">Social Media</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Segments Tab */}
            <TabsContent value="segments" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Audience Segments</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Segment
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { name: 'New Users (Last 30 days)', count: 345, growth: '+12%' },
                  { name: 'Frequent Buyers', count: 128, growth: '+8%' },
                  { name: 'Cart Abandoners', count: 89, growth: '-5%' },
                  { name: 'Inactive Users (90+ days)', count: 234, growth: '-2%' },
                  { name: 'Newsletter Subscribers', count: 1567, growth: '+15%' },
                  { name: 'VIP Customers', count: 45, growth: '+3%' }
                ].map((segment, idx) => (
                  <Card key={idx} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold mb-1">{segment.name}</h3>
                        <p className="text-2xl font-bold">{segment.count}</p>
                      </div>
                      <span className={`text-sm font-semibold ${segment.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {segment.growth}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
