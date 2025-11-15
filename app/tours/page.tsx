import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Users, Camera, Mountain, Clock, Star, ChevronRight } from 'lucide-react'
import Header from '@/components/Header'
import ParticleBackground from '@/components/ParticleBackground'
import Footer from '@/components/Footer'
import StatsSidebar from '@/components/StatsSidebar'
import LeadershipSection from '@/components/LeadershipSection'

export default function ToursPage() {
  const tours = [
    {
      id: 1,
      name: 'Himalayan Village Trek',
      duration: '3 Days / 2 Nights',
      difficulty: 'Moderate',
      price: 8500,
      groupSize: '4-10 people',
      rating: 4.8,
      description: 'Experience the pristine beauty of Himalayan villages with guided treks through pine forests and traditional mountain settlements.',
      highlights: ['Mountain Views', 'Local Culture', 'Traditional Cuisine', 'Photography'],
    },
    {
      id: 2,
      name: 'Eco-Tourism Day Trip',
      duration: '1 Day',
      difficulty: 'Easy',
      price: 2500,
      groupSize: '2-8 people',
      rating: 4.9,
      description: 'A perfect day exploring sustainable practices, organic farms, and renewable energy projects in Damday Village.',
      highlights: ['Organic Farming', 'Solar Projects', 'Carbon-Free Living', 'Village Tour'],
    },
    {
      id: 3,
      name: 'Cultural Heritage Experience',
      duration: '2 Days / 1 Night',
      difficulty: 'Easy',
      price: 5500,
      groupSize: '2-12 people',
      rating: 4.7,
      description: 'Immerse yourself in local culture with traditional dance, music, handicrafts, and authentic Pahadi cuisine.',
      highlights: ['Cultural Programs', 'Handicrafts Workshop', 'Traditional Cooking', 'Folk Music'],
    },
    {
      id: 4,
      name: 'Adventure Mountain Expedition',
      duration: '5 Days / 4 Nights',
      difficulty: 'Challenging',
      price: 15000,
      groupSize: '4-8 people',
      rating: 4.9,
      description: 'An adventurous trek through high-altitude trails, camping under stars, and reaching breathtaking viewpoints.',
      highlights: ['High Altitude Trek', 'Camping', 'Sunrise Views', 'Wildlife Spotting'],
    },
  ]

  const features = [
    {
      title: 'Expert Guides',
      description: 'Local experienced guides who know every trail and story',
      icon: Users,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Eco-Friendly',
      description: 'Zero-waste tours supporting sustainable tourism',
      icon: Mountain,
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Authentic Culture',
      description: 'Experience genuine Himalayan village life',
      icon: Camera,
      gradient: 'from-orange-500 to-yellow-500',
    },
    {
      title: 'Safety First',
      description: 'Well-equipped tours with safety protocols',
      icon: MapPin,
      gradient: 'from-purple-500 to-pink-500',
    },
  ]

  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 overflow-hidden">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-green-500/10 z-[1]" />
        
        <div className="relative z-10">
          {/* Hero Section */}
          <section className="pt-24 pb-12 px-6">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
                    <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full border border-white/30 mb-6">
                      <MapPin className="w-5 h-5 text-blue-300 mr-2" />
                      <span className="text-sm font-medium text-white">Explore the Himalayas</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-white">
                      Cultural & Adventure Tours
                    </h1>
                    
                    <p className="text-xl text-white/70 leading-relaxed mb-8">
                      Discover the beauty of Damday Village and the surrounding Himalayas with our expertly guided eco-tours and cultural experiences.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/register">
                        <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700 shadow-lg">
                          <Camera className="w-5 h-5 mr-2" />
                          Book a Tour
                          <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                      </Link>
                      <Link href="/contact">
                        <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm">
                          Contact Us
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

          {/* Leadership Section */}
          <section className="py-12 px-6">
            <div className="container mx-auto">
              <LeadershipSection />
            </div>
          </section>

          {/* Features */}
          <section className="py-12 px-6">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Why Choose Our Tours
                </h2>
                <p className="text-lg text-white/70 max-w-2xl mx-auto">
                  Experience the best of sustainable tourism in the Himalayas
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
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-white/60">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tours Grid */}
          <section className="py-12 px-6">
            <div className="container mx-auto">
              <h2 className="text-4xl font-bold text-white mb-8">Available Tours</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {tours.map((tour) => (
                  <div key={tour.id} className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden hover:bg-white/15 hover:scale-105 transition-all">
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2">{tour.name}</h3>
                          <div className="flex items-center text-yellow-400">
                            <Star className="w-5 h-5 mr-1" fill="currentColor" />
                            <span className="font-semibold">{tour.rating}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          tour.difficulty === 'Easy' ? 'bg-green-500/30 text-green-200' :
                          tour.difficulty === 'Moderate' ? 'bg-yellow-500/30 text-yellow-200' :
                          'bg-red-500/30 text-red-200'
                        }`}>
                          {tour.difficulty}
                        </span>
                      </div>

                      <p className="text-white/60 text-sm mb-6 leading-relaxed">{tour.description}</p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-white/70 text-sm">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{tour.duration}</span>
                        </div>
                        <div className="flex items-center text-white/70 text-sm">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{tour.groupSize}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {tour.highlights.map((highlight) => (
                          <span key={highlight} className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs text-white">
                            {highlight}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-white/20">
                        <div>
                          <span className="text-3xl font-bold text-white">₹{tour.price.toLocaleString()}</span>
                          <span className="text-white/60 text-sm ml-2">per person</span>
                        </div>
                        <Link href="/register">
                          <Button className="bg-gradient-to-r from-blue-500 to-green-600 hover:from-blue-600 hover:to-green-700">
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 px-6">
            <div className="container mx-auto">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready for an Adventure?
                </h2>
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                  Book your tour today and experience the magic of the Himalayas with sustainable, community-focused tourism.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl">
                      Book Your Tour
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/contact">
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                      Contact Us
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
