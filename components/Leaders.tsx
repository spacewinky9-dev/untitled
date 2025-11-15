import Image from 'next/image'
import { Card } from '@/components/ui/card'

interface Leader {
  name: string
  position: string
  image: string
  description?: string | null
}

export default function Leaders({ leaders }: { leaders: Leader[] }) {
  return (
    <section className="py-16 bg-gradient-to-r from-orange-50 to-green-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          हमारे मार्गदर्शक / Our Leaders
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {leaders.map((leader, idx) => (
            <Card key={idx} className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64 bg-gradient-to-br from-orange-100 to-green-100">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{leader.name}</h3>
                <p className="text-orange-600 font-semibold mb-3">{leader.position}</p>
                {leader.description && (
                  <p className="text-sm text-gray-600">{leader.description}</p>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
