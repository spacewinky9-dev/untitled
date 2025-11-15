import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TreePine, Award, TrendingUp, ShoppingBag, Users, Leaf, BarChart3, CircleDollarSign, ChevronRight, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import ParticleBackground from '@/components/ParticleBackground'
import Footer from '@/components/Footer'

export default function CarbonCreditsPage() {
  const stats = [
    { icon: TreePine, label: 'Trees Planted', value: '12,500', subtitle: 'Target: 25,000', color: 'green' },
    { icon: CircleDollarSign, label: 'Carbon Credits', value: '8,400', subtitle: 'Tons CO₂ Offset', color: 'blue' },
    { icon: Award, label: 'Certifications', value: '156', subtitle: 'Verified Projects', color: 'purple' },
    { icon: Users, label: 'Contributors', value: '500+', subtitle: 'Active Members', color: 'orange' },
  ]

  const features = [
    {
      title: 'Verified Carbon Offsets',
      description: 'All carbon credits are verified and tracked on the DamChain blockchain for complete transparency',
      icon: Award,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Real-Time Trading',
      description: 'Buy, sell, and trade carbon credits instantly with our blockchain-powered marketplace',
      icon: TrendingUp,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Impact Tracking',
      description: 'Monitor your environmental impact with detailed analytics and transparent reporting',
      icon: BarChart3,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Community Projects',
      description: 'Support local reforestation and sustainability initiatives directly',
      icon: Users,
      gradient: 'from-orange-500 to-yellow-500',
    },
  ]

  const projects = [
    {
      name: 'Himalayan Pine Reforestation',
      location: 'Damday Valley',
      credits: '2,500 tons CO₂',
      status: 'Active',
      progress: 75,
    },
    {
      name: 'Village Solar Power Initiative',
      location: 'Damday Village',
      credits: '1,800 tons CO₂',
      status: 'Active',
      progress: 90,
    },
    {
      name: 'Organic Farming Project',
      location: 'Surrounding Areas',
      credits: '1,200 tons CO₂',
      status: 'Active',
      progress: 60,
    },
    {
      name: 'Water Conservation Program',
      location: 'Damday Region',
      credits: '900 tons CO₂',
      status: 'Completed',
      progress: 100,
    },
  ]

  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden">
        <ParticleBackground />
        
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-6 py-2 rounded-full shadow-md border border-green-200 mb-6">
                <TreePine className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Blockchain-Verified Carbon Credits</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Carbon Credit Marketplace
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Trade verified carbon credits on the DamChain blockchain. Support environmental initiatives 
                and achieve carbon neutrality with complete transparency and security.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Start Trading Credits
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/blockchain">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 hover:bg-green-50">
                    <Leaf className="w-5 h-5 mr-2" />
                    Explore DamChain
                  </Button>
                </Link>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 border-l-4 hover:shadow-xl transition-shadow"
                  style={{ borderColor: `var(--color-${stat.color}-500)` }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`w-10 h-10 text-${stat.color}-600`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 mb-2">{stat.label}</div>
                  <div className="text-xs text-gray-500">{stat.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                How Carbon Credits Work
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Participate in the carbon credit ecosystem powered by blockchain technology
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Plant & Verify</h3>
                <p className="text-gray-600">Trees are planted and verified on-site with GPS tracking and documentation</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Blockchain Record</h3>
                <p className="text-gray-600">Each carbon offset is recorded on DamChain as an immutable token</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Trade Credits</h3>
                <p className="text-gray-600">Buy and sell verified carbon credits on our secure marketplace</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">4</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Track Impact</h3>
                <p className="text-gray-600">Monitor your environmental impact with real-time analytics</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Platform Features
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Advanced features powered by DamChain blockchain technology
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 hover:border-green-200 hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Active Projects */}
        <section className="py-16 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Active Carbon Offset Projects
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Support verified environmental projects in the Damday region
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {projects.map((project) => (
                <div key={project.name} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{project.name}</h3>
                      <p className="text-sm text-gray-600 flex items-center">
                        <TreePine className="w-4 h-4 mr-1" />
                        {project.location}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <div className="text-sm text-gray-600">Carbon Credits</div>
                      <div className="text-lg font-bold text-green-600">{project.credits}</div>
                    </div>
                    <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Join the Carbon Credit Revolution
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Start trading verified carbon credits today and make a real impact on the environment
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 shadow-xl">
                    Create Account
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                    Explore Marketplace
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  )
}
