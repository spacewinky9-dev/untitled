'use client'

import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Shield, Leaf, Zap } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-green-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-green-600 rounded-full flex items-center justify-center font-bold text-xl">
                DV
              </div>
              <div>
                <h3 className="text-xl font-bold">Damday Village</h3>
                <p className="text-sm text-gray-300">Smart Carbon-Free Village</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              India&apos;s first smart carbon-free village powered by DamChain blockchain technology. 
              Million times faster and more secure than Bitcoin.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                 className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"
                 className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <Leaf className="w-5 h-5 mr-2 text-green-400" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/marketplace" className="text-gray-300 hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link href="/homestays" className="text-gray-300 hover:text-white transition-colors">Homestays</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/blockchain" className="text-gray-300 hover:text-white transition-colors">DamChain Blockchain</Link></li>
              <li><Link href="/carbon" className="text-gray-300 hover:text-white transition-colors">Carbon Credits</Link></li>
            </ul>
          </div>

          {/* Blockchain Features */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              DamChain Features
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Quantum-Resistant Security</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">100,000+ TPS</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Zero-Knowledge Proofs</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">AI Gas Optimization</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">Cross-Chain Interoperability</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-400 mr-2">✓</span>
                <span className="text-gray-300">&lt;0.00001 kWh per Transaction</span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-400" />
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-gray-400 flex-shrink-0 mt-1" />
                <span className="text-gray-300">
                  Damday Village, Uttarakhand<br />
                  Himalayan Devbhumi, India
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-gray-400" />
                <a href="mailto:info@damdayvillage.com" className="text-gray-300 hover:text-white transition-colors">
                  info@damdayvillage.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-gray-400" />
                <a href="tel:+911234567890" className="text-gray-300 hover:text-white transition-colors">
                  +91 123 456 7890
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Damday Village. All rights reserved. | Powered by DamChain Blockchain
            </p>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/admin/login" className="text-gray-400 hover:text-white transition-colors">
                Admin
              </Link>
            </div>
          </div>
          
          {/* Certification Badges */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="text-center">
                <div className="text-green-400 font-semibold text-sm">🌱 Carbon Neutral</div>
                <div className="text-gray-400 text-xs">100% Verified</div>
              </div>
              <div className="text-center">
                <div className="text-blue-400 font-semibold text-sm">🔒 Blockchain Secured</div>
                <div className="text-gray-400 text-xs">256-bit Quantum-Resistant</div>
              </div>
              <div className="text-center">
                <div className="text-yellow-400 font-semibold text-sm">⚡ Lightning Fast</div>
                <div className="text-gray-400 text-xs">100K+ TPS</div>
              </div>
              <div className="text-center">
                <div className="text-purple-400 font-semibold text-sm">🏆 Award Winning</div>
                <div className="text-gray-400 text-xs">Green Village 2024</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
