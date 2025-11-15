import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Users, MessageSquare, Calendar, Trophy, Heart, Share2, UserPlus, TrendingUp, ChevronRight, Star, Zap, Award } from 'lucide-react'
import Header from '@/components/Header'
import ParticleBackground from '@/components/ParticleBackground'
import Footer from '@/components/Footer'
import StatsSidebar from '@/components/StatsSidebar'

export default function CommunityPage() {
  const stats = [
    { icon: Users, label: 'Active Members', value: '500+', subtitle: 'Growing Daily', color: 'purple' },
    { icon: MessageSquare, label: 'Discussions', value: '1,250', subtitle: 'This Month', color: 'blue' },
    { icon: Calendar, label: 'Events', value: '24', subtitle: 'Upcoming', color: 'orange' },
    { icon: Trophy, label: 'Projects', value: '48', subtitle: 'Completed', color: 'green' },
  ]

  const features = [
    {
      title: 'Community Forums',
      description: 'Engage in meaningful discussions about sustainability, local initiatives, and village development',
      icon: MessageSquare,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Events & Workshops',
      description: 'Participate in cultural events, sustainability workshops, and community gatherings',
      icon: Calendar,
      gradient: 'from-orange-500 to-yellow-500',
    },
    {
      title: 'Collaborative Projects',
      description: 'Join hands with villagers on tree plantation, organic farming, and eco-tourism projects',
      icon: Users,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Rewards & Recognition',
      description: 'Earn rewards for your contributions and get recognized for your environmental impact',
      icon: Trophy,
      gradient: 'from-green-500 to-emerald-500',
    },
  ]

  const upcomingEvents = [
    {
      title: 'Tree Plantation Drive',
      date: 'December 15, 2024',
      time: '9:00 AM',
      location: 'Damday Valley',
      participants: 45,
      category: 'Environment',
    },
    {
      title: 'Organic Farming Workshop',
      date: 'December 20, 2024',
      time: '2:00 PM',
      location: 'Community Center',
      participants: 32,
      category: 'Education',
    },
    {
      title: 'Cultural Festival',
      date: 'December 25, 2024',
      time: '5:00 PM',
      location: 'Village Square',
      participants: 120,
      category: 'Culture',
    },
    {
      title: 'Blockchain Tech Talk',
      date: 'December 28, 2024',
      time: '3:00 PM',
      location: 'Online',
      participants: 68,
      category: 'Technology',
    },
  ]

  const communityMembers = [
    { name: 'Rajesh Kumar', role: 'Tree Planting Lead', contributions: 125, avatar: '🌳' },
    { name: 'Priya Sharma', role: 'Organic Farming Expert', contributions: 98, avatar: '🌾' },
    { name: 'Amit Singh', role: 'Tech Volunteer', contributions: 87, avatar: '💻' },
    { name: 'Anita Devi', role: 'Cultural Ambassador', contributions: 76, avatar: '🎨' },
  ]

  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 overflow-hidden">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 z-[1]" />
        
        <div className="relative z-10">
          {/* Hero Section */}
          <section className="pt-24 pb-12 px-6">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
                    <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30 mb-6">
                      <Users className="w-5 h-5 text-purple-300 mr-2" />
                      <span className="text-sm font-medium text-white">Join 500+ Active Members</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-white">
                      Community Hub
                    </h1>
                    
                    <p className="text-xl text-white/70 leading-relaxed mb-8">
                      Connect with like-minded individuals, collaborate on sustainability projects, 
                      and be part of India&apos;s first smart carbon-free village revolution.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/register">
                        <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg">
                          <UserPlus className="w-5 h-5 mr-2" />
                          Join Community
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                      </Link>
                      <Link href="/blog">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                          <MessageSquare className="w-5 h-5 mr-2" />
                          Read Stories
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-4">
                  <StatsSidebar />
                </div>
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className="py-12 px-6">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:scale-105 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <stat.icon className="w-10 h-10 text-purple-300" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-white/70 mb-2">{stat.label}</div>
                    <div className="text-xs text-white/50">{stat.subtitle}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section className="py-12 px-6">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Community Features
                </h2>
                <p className="text-lg text-white/70 max-w-2xl mx-auto">
                  Collaborate, contribute, and make a difference together
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:scale-105 transition-all"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-white/60">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-12 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Upcoming Events
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Join exciting events and workshops happening in Damday Village
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {upcomingEvents.map((event) => (
                <div key={event.title} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:scale-105 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        event.category === 'Environment' ? 'bg-green-500/30 text-green-200' :
                        event.category === 'Education' ? 'bg-blue-500/30 text-blue-200' :
                        event.category === 'Culture' ? 'bg-purple-500/30 text-purple-200' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {event.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-white/70 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 mr-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/20">
                    <div className="flex items-center text-sm text-white/70">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{event.participants} participants</span>
                    </div>
                    <Button size="sm" variant="outline" className="border-purple-300 text-white hover:bg-white/10">
                      Join Event
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Contributors */}
        <section className="py-12 px-6">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Top Contributors
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Meet our amazing community members making a difference
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {communityMembers.map((member) => (
                <div key={member.name} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:scale-105 transition-all text-center">
                  <div className="text-6xl mb-4">{member.avatar}</div>
                  <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-sm text-white/60 mb-3">{member.role}</p>
                  
                  <div className="pt-4 border-t border-white/20">
                    <div className="flex items-center justify-center text-purple-300">
                      <Award className="w-4 h-4 mr-2" />
                      <span className="font-bold">{member.contributions}</span>
                      <span className="text-xs ml-1 text-white/50">contributions</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-12 px-6">
          <div className="container mx-auto">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-white text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Make Your Impact Today
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Every contribution counts. Join our community and be part of the sustainable future.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <Heart className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Volunteer</h3>
                  <p className="text-white/80">Contribute your time and skills</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <Share2 className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Share Ideas</h3>
                  <p className="text-white/80">Propose new initiatives</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Grow Together</h3>
                  <p className="text-white/80">Learn and inspire others</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl">
                    Join Now
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        </div>
      </div>
      
      <Footer />
    </>
  )
}
