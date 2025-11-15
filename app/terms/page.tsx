import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FileText, Scale, AlertCircle, CheckCircle, XCircle, Mail, ChevronRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function TermsOfServicePage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      icon: CheckCircle,
      content: [
        'By accessing or using Damday Village services, you agree to be bound by these Terms of Service.',
        'If you do not agree to these terms, you must not use our services.',
        'We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of modified terms.',
        'You must be at least 18 years old to use our services or have parental consent.',
      ],
    },
    {
      title: 'User Accounts',
      icon: FileText,
      content: [
        'You are responsible for maintaining the confidentiality of your account credentials.',
        'You agree to provide accurate, current, and complete information during registration.',
        'You are responsible for all activities that occur under your account.',
        'We reserve the right to suspend or terminate accounts that violate these terms.',
        'One person or entity may not maintain more than one account.',
      ],
    },
    {
      title: 'Marketplace Terms',
      icon: Scale,
      content: [
        'All products listed in our marketplace are subject to availability.',
        'Prices are displayed in Indian Rupees (INR) and are subject to change without notice.',
        'We reserve the right to refuse or cancel any order for any reason.',
        'Product descriptions and images are provided for general information only.',
        'Returns and refunds are subject to our separate Return Policy.',
      ],
    },
    {
      title: 'Homestay Bookings',
      icon: FileText,
      content: [
        'Homestay bookings are subject to availability and confirmation.',
        'Cancellation policies vary by homestay and will be clearly stated at booking time.',
        'Guests must respect local customs, culture, and property rules.',
        'Additional charges may apply for damages or violation of homestay policies.',
        'We are not liable for disputes between guests and homestay hosts.',
      ],
    },
    {
      title: 'Carbon Credits & Blockchain',
      icon: CheckCircle,
      content: [
        'Carbon credit transactions are recorded on the DamChain blockchain and are immutable.',
        'You are responsible for understanding blockchain technology and its implications.',
        'We do not guarantee the future value or tradability of carbon credits.',
        'Blockchain transactions cannot be reversed once confirmed.',
        'You are responsible for securing your blockchain wallet and private keys.',
      ],
    },
    {
      title: 'Prohibited Activities',
      icon: XCircle,
      content: [
        'Using our services for any illegal purpose or in violation of applicable laws.',
        'Attempting to gain unauthorized access to our systems or other users\' accounts.',
        'Transmitting viruses, malware, or any other malicious code.',
        'Harassing, threatening, or defaming other users or our staff.',
        'Engaging in fraudulent activities or misrepresenting your identity.',
        'Scraping, data mining, or automated use of our services without permission.',
      ],
    },
  ]

  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
                <Scale className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Last Updated: December 2024</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                Terms of Service
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                Please read these terms carefully before using Damday Village services. 
                These terms constitute a legally binding agreement between you and Damday Village.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Introduction */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Agreement to Terms</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  These Terms of Service (&quot;Terms&quot;) govern your access to and use of Damday Village&apos;s website, 
                  marketplace, homestay booking system, carbon credit trading platform, and all related services 
                  (collectively, the &quot;Services&quot;).
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Damday Village is India&apos;s first smart carbon-free village, integrating sustainable development, 
                  carbon neutrality, and cultural preservation through blockchain technology. By using our Services, 
                  you agree to comply with and be bound by these Terms.
                </p>
              </div>

              {/* Main Sections */}
              {sections.map((section, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-blue-700 rounded-lg flex items-center justify-center mr-4">
                      <section.icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
                  </div>
                  
                  <ul className="space-y-3">
                    {section.content.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-blue-600 mr-3 mt-1">•</span>
                        <span className="text-gray-600 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Intellectual Property */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Intellectual Property Rights</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  All content on our website, including text, graphics, logos, images, and software, is the property 
                  of Damday Village or its content suppliers and is protected by intellectual property laws.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">•</span>
                    <span className="text-gray-600">You may not reproduce, distribute, or create derivative works without our written permission.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">•</span>
                    <span className="text-gray-600">The DamChain blockchain technology and associated trademarks are proprietary.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">•</span>
                    <span className="text-gray-600">User-generated content remains your property, but you grant us a license to use it.</span>
                  </li>
                </ul>
              </div>

              {/* Limitation of Liability */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                <div className="flex items-start mb-4">
                  <AlertCircle className="w-8 h-8 text-orange-500 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      To the maximum extent permitted by law, Damday Village shall not be liable for any indirect, 
                      incidental, special, consequential, or punitive damages arising from your use of our Services.
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-3 mt-1">•</span>
                        <span className="text-gray-600">We are not responsible for losses due to blockchain network issues or cryptocurrency volatility.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-3 mt-1">•</span>
                        <span className="text-gray-600">We do not guarantee uninterrupted or error-free service.</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-3 mt-1">•</span>
                        <span className="text-gray-600">Our total liability shall not exceed the amount you paid us in the past 12 months.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Dispute Resolution */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Dispute Resolution</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Any disputes arising from these Terms or your use of our Services shall be resolved through:
                </p>
                <ol className="space-y-3 mb-4 list-decimal list-inside">
                  <li className="text-gray-600 leading-relaxed">
                    <strong>Informal Resolution:</strong> Contact us first to resolve the dispute informally.
                  </li>
                  <li className="text-gray-600 leading-relaxed">
                    <strong>Mediation:</strong> If informal resolution fails, disputes will be submitted to mediation.
                  </li>
                  <li className="text-gray-600 leading-relaxed">
                    <strong>Arbitration:</strong> Unresolved disputes shall be settled by binding arbitration under Indian law.
                  </li>
                </ol>
                <p className="text-gray-600 leading-relaxed">
                  These Terms shall be governed by the laws of India, and the courts of Uttarakhand shall have 
                  exclusive jurisdiction.
                </p>
              </div>

              {/* Changes to Terms */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to Terms</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We reserve the right to modify these Terms at any time. When we make changes:
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">•</span>
                    <span className="text-gray-600">We will update the &quot;Last Updated&quot; date at the top of this page.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">•</span>
                    <span className="text-gray-600">For material changes, we will notify you via email or website notice.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">•</span>
                    <span className="text-gray-600">Your continued use of our Services after changes constitutes acceptance.</span>
                  </li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  We encourage you to review these Terms periodically to stay informed about our practices.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-xl shadow-lg p-8 text-white text-center">
                <Mail className="w-16 h-16 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">Questions About These Terms?</h2>
                <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                  If you have any questions or concerns about our Terms of Service, please contact our legal team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="mailto:legal@damdayvillage.com">
                    <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 shadow-xl">
                      <Mail className="w-5 h-5 mr-2" />
                      Contact Legal Team
                    </Button>
                  </a>
                  <Link href="/">
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                      Back to Home
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  )
}
