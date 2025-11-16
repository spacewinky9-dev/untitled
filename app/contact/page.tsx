import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Mail, Phone, MapPin, MessageSquare, Send, Clock, Globe, Facebook, Twitter, Instagram } from 'lucide-react'
import Header from '@/components/Header'
import ParticleBackground from '@/components/ParticleBackground'
import Footer from '@/components/Footer'
import StatsSidebar from '@/components/StatsSidebar'

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      value: 'info@damdayvillage.com',
      link: 'mailto:info@damdayvillage.com',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: '+91 123 456 7890',
      link: 'tel:+911234567890',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: 'Damday Village, Uttarakhand, India',
      link: '#',
      gradient: 'from-orange-500 to-yellow-500',
    },
    {
      icon: Clock,
      title: 'Office Hours',
      value: 'Mon - Sat: 9 AM - 6 PM',
      link: '#',
      gradient: 'from-purple-500 to-pink-500',
    },
  ]

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', link: 'https://facebook.com', color: 'hover:text-blue-400' },
    { icon: Twitter, label: 'Twitter', link: 'https://twitter.com', color: 'hover:text-cyan-400' },
    { icon: Instagram, label: 'Instagram', link: 'https://instagram.com', color: 'hover:text-pink-400' },
    { icon: Globe, label: 'Website', link: 'https://damdayvillage.com', color: 'hover:text-green-400' },
  ]

  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-purple-900/15 to-emerald-600/20 z-[1]" />
        
        <div className="relative z-10">
          {/* Hero Section */}
          <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="container mx-auto max-w-full 2xl:max-w-[1800px]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
                    <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-2 rounded-full border border-white/30 mb-6">
                      <MessageSquare className="w-5 h-5 text-purple-300 mr-2" />
                      <span className="text-sm font-medium text-white">Get in Touch</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                      Contact Us
                    </h1>
                    
                    <p className="text-xl text-white/80 leading-relaxed mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      Have questions about Damday Village, our homestays, tours, or carbon credit programs? We&apos;re here to help! Reach out to us anytime.
                    </p>
                  </div>
                </div>
                
                <div className="lg:col-span-4">
                  <StatsSidebar />
                </div>
              </div>
            </div>
          </section>

          {/* Contact Info Cards */}
          <section className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="container mx-auto max-w-full 2xl:max-w-[1800px]">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {contactInfo.map((info) => (
                  <a
                    key={info.title}
                    href={info.link}
                    className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:bg-white/15 hover:scale-105 transition-all"
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${info.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                      <info.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
                      {info.title}
                    </h3>
                    <p className="text-sm text-white/70">{info.value}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="container mx-auto max-w-full 2xl:max-w-[1800px]">
              <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
                <h2 className="text-3xl font-bold text-white mb-2 text-center">Send Us a Message</h2>
                <p className="text-white/70 text-center mb-8">Fill out the form below and we&apos;ll get back to you soon</p>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      placeholder="What's this about?"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      placeholder="Tell us more..."
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    />
                  </div>
                  
                  <Button size="lg" className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </section>

          {/* Map & Social Links */}
          <section className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="container mx-auto max-w-full 2xl:max-w-[1800px]">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Map Placeholder */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Find Us</h3>
                  <div className="aspect-video bg-gradient-to-br from-orange-500/20 to-green-500/20 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-16 h-16 text-white/40" />
                  </div>
                  <p className="text-white/70 text-sm mt-4 text-center">
                    Damday Village, Devbhumi Uttarakhand, India
                  </p>
                </div>

                {/* Social Links */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Connect With Us</h3>
                  <p className="text-white/70 mb-6">
                    Follow us on social media to stay updated with latest news, events, and stories from Damday Village.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {socialLinks.map((social) => (
                      <a
                        key={social.label}
                        href={social.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center space-x-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-4 transition-all ${social.color}`}
                      >
                        <social.icon className="w-6 h-6 text-white" />
                        <span className="text-white font-medium">{social.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="py-12 px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
            <div className="container mx-auto max-w-full 2xl:max-w-[1800px]">
              <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-white/90 mb-8">
                  Check out our FAQ section for quick answers to common questions
                </p>
                <Link href="/blog">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                    Visit FAQ
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      <Footer />
    </>
  )
}
