import Image from 'next/image'

interface Leader {
  name: string
  title: string
  imageUrl: string
  description: string
}

export default function LeadershipSection() {
  const leaders: Leader[] = [
    {
      name: 'Shri Narendra Modi',
      title: 'Hon\'ble Prime Minister of India',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/7/78/Narendra_Modi_official_portrait_2024_%28cropped%29.jpg',
      description: 'Leading India\'s vision for sustainable development and carbon neutrality.',
    },
    {
      name: 'Shri Pushkar Singh Dhami',
      title: 'Hon\'ble Chief Minister of Uttarakhand',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Pushkar_Singh_Dhami.jpg',
      description: 'Championing Devbhumi\'s journey towards environmental conservation and rural development.',
    },
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Leadership & Vision
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Under the visionary leadership of our national and state leaders, 
            Damday Village is pioneering sustainable development in the Himalayas
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {leaders.map((leader) => (
            <div
              key={leader.name}
              className="bg-gradient-to-br from-orange-50 to-green-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-orange-100"
            >
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-40 h-40 mb-4 rounded-full overflow-hidden ring-4 ring-orange-200 shadow-lg">
                    <Image
                      src={leader.imageUrl}
                      alt={leader.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 160px"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-sm font-medium text-orange-600 mb-3">
                    {leader.title}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {leader.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-green-600 text-white rounded-full shadow-md">
            <span className="text-sm font-medium">
              🇮🇳 Empowering Rural India through Digital Innovation
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
