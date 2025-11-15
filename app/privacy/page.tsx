import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, Lock, Eye, UserCheck, FileText, Mail, ChevronRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      icon: FileText,
      content: [
        'Personal Information: Name, email address, phone number, and physical address when you register or make a purchase.',
        'Payment Information: Payment details processed securely through our payment processors.',
        'Usage Data: Information about how you use our website, including IP address, browser type, and pages visited.',
        'Blockchain Data: Public blockchain transactions related to carbon credits and smart contracts.',
      ],
    },
    {
      title: 'How We Use Your Information',
      icon: UserCheck,
      content: [
        'To provide and maintain our services, including marketplace transactions and homestay bookings.',
        'To process your payments and fulfill orders for products and services.',
        'To communicate with you about your account, orders, and important updates.',
        'To improve our services and develop new features based on user feedback.',
        'To comply with legal obligations and protect against fraudulent activities.',
      ],
    },
    {
      title: 'Data Security',
      icon: Lock,
      content: [
        'We implement industry-standard security measures to protect your personal information.',
        'All sensitive data is encrypted using SSL/TLS protocols during transmission.',
        'Payment information is processed through PCI-DSS compliant payment processors.',
        'Blockchain transactions are secured through cryptographic protocols on DamChain.',
        'Regular security audits and updates to maintain the highest level of protection.',
      ],
    },
    {
      title: 'Data Sharing and Disclosure',
      icon: Eye,
      content: [
        'We do not sell your personal information to third parties.',
        'Service Providers: We may share data with trusted service providers for payment processing, hosting, and analytics.',
        'Legal Requirements: We may disclose information when required by law or to protect our rights.',
        'Blockchain: Transaction data on the blockchain is publicly visible as per blockchain technology standards.',
        'With Your Consent: We may share information with third parties when you explicitly give us permission.',
      ],
    },
  ]

  return (
    <>
      <Header />
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
                <Shield className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Last Updated: December 2024</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
                Privacy Policy
              </h1>
              
              <p className="text-xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                At Damday Village, we are committed to protecting your privacy and ensuring the security 
                of your personal information. This policy explains how we collect, use, and safeguard your data.
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
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Commitment to Privacy</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Damday Village (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting 
                  your personal data. This privacy policy will inform you about how we look after your personal data 
                  when you visit our website or use our services, and tell you about your privacy rights.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  By using our website and services, you agree to the collection and use of information in accordance 
                  with this policy. If you do not agree with this policy, please do not use our services.
                </p>
              </div>

              {/* Main Sections */}
              {sections.map((section, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mr-4">
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

              {/* Your Rights */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Privacy Rights</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">•</span>
                    <span className="text-gray-600 leading-relaxed">
                      <strong>Access:</strong> Request access to your personal data and receive a copy of it.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">•</span>
                    <span className="text-gray-600 leading-relaxed">
                      <strong>Correction:</strong> Request correction of inaccurate or incomplete personal data.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">•</span>
                    <span className="text-gray-600 leading-relaxed">
                      <strong>Deletion:</strong> Request deletion of your personal data in certain circumstances.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">•</span>
                    <span className="text-gray-600 leading-relaxed">
                      <strong>Object:</strong> Object to processing of your personal data in certain circumstances.
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">•</span>
                    <span className="text-gray-600 leading-relaxed">
                      <strong>Portability:</strong> Request transfer of your personal data to another service provider.
                    </span>
                  </li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  To exercise any of these rights, please contact us at privacy@damdayvillage.com
                </p>
              </div>

              {/* Cookies */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to improve your experience on our website. 
                  Cookies are small text files stored on your device that help us:
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">•</span>
                    <span className="text-gray-600">Remember your preferences and settings</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">•</span>
                    <span className="text-gray-600">Analyze website traffic and usage patterns</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-3 mt-1">•</span>
                    <span className="text-gray-600">Provide personalized content and recommendations</span>
                  </li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  You can control cookies through your browser settings. However, disabling cookies may limit 
                  some features of our website.
                </p>
              </div>

              {/* Contact */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl shadow-lg p-8 text-white text-center">
                <Mail className="w-16 h-16 mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-4">Questions About Privacy?</h2>
                <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                  If you have any questions or concerns about our privacy policy or how we handle your data, 
                  please don&apos;t hesitate to contact us.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a href="mailto:privacy@damdayvillage.com">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl">
                      <Mail className="w-5 h-5 mr-2" />
                      Contact Privacy Team
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
