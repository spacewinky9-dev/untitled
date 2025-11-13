import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@damdayvillage.com' },
    update: {},
    create: {
      email: 'admin@damdayvillage.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  })

  console.log('✅ Admin user created:', admin.email)

  // Create some test users
  const testUser = await prisma.user.upsert({
    where: { email: 'user@damdayvillage.com' },
    update: {},
    create: {
      email: 'user@damdayvillage.com',
      name: 'Test User',
      password: await bcrypt.hash('user123', 10),
      role: 'USER',
    },
  })

  console.log('✅ Test user created:', testUser.email)

  // Create initial settings
  await prisma.settings.upsert({
    where: { key: 'site_name' },
    update: {},
    create: {
      key: 'site_name',
      value: 'Damday Village Smart Village',
    },
  })

  await prisma.settings.upsert({
    where: { key: 'site_description' },
    update: {},
    create: {
      key: 'site_description',
      value: 'Smart Carbon-Free Village in the Himalayan Devbhumi region',
    },
  })

  console.log('✅ Settings created')

  // Create product categories sequentially to avoid timeout
  const categoriesData = [
    {
      name: 'Organic Vegetables',
      slug: 'vegetables',
      description: 'Fresh organic vegetables from Damday Village farms',
      image: '/images/categories/vegetables.jpg',
    },
    {
      name: 'Fresh Fruits',
      slug: 'fruits',
      description: 'Seasonal fruits grown in the Himalayan climate',
      image: '/images/categories/fruits.jpg',
    },
    {
      name: 'Grains & Pulses',
      slug: 'grains-pulses',
      description: 'Traditional Himalayan grains and pulses',
      image: '/images/categories/grains.jpg',
    },
    {
      name: 'Dairy Products',
      slug: 'dairy',
      description: 'Pure dairy products from local cattle',
      image: '/images/categories/dairy.jpg',
    },
    {
      name: 'Honey & Preserves',
      slug: 'honey-preserves',
      description: 'Natural honey and traditional preserves',
      image: '/images/categories/honey.jpg',
    },
    {
      name: 'Herbs & Spices',
      slug: 'herbs-spices',
      description: 'Organic herbs and spices from the mountains',
      image: '/images/categories/herbs.jpg',
    },
  ]

  const categories = []
  for (const catData of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: {},
      create: {
        ...catData,
        active: true,
      },
    })
    categories.push(category)
  }

  console.log(`✅ Created ${categories.length} categories`)

  // Create 22+ organic products from Damday Village
  const products = [
    // Vegetables (7 products)
    {
      name: 'Organic Tomatoes',
      slug: 'organic-tomatoes',
      description: 'Fresh organic tomatoes grown in the Himalayan foothills. Rich in flavor and nutrients.',
      price: 80,
      compareAtPrice: 100,
      cost: 50,
      categoryId: categories[0].id, // vegetables
      sku: 'VEG-TOM-001',
      quantity: 50,
      images: JSON.stringify(['/images/products/tomatoes.jpg']),
      weight: 0.5,
      featured: true,
    },
    {
      name: 'Mountain Potatoes',
      slug: 'mountain-potatoes',
      description: 'Organically grown potatoes from high-altitude farms. Perfect for all dishes.',
      price: 40,
      compareAtPrice: 50,
      cost: 25,
      categoryId: categories[0].id,
      sku: 'VEG-POT-002',
      quantity: 100,
      images: JSON.stringify(['/images/products/potatoes.jpg']),
      weight: 1.0,
      featured: false,
    },
    {
      name: 'Fresh Spinach',
      slug: 'fresh-spinach',
      description: 'Iron-rich organic spinach, freshly harvested from village farms.',
      price: 30,
      compareAtPrice: 40,
      cost: 15,
      categoryId: categories[0].id,
      sku: 'VEG-SPI-003',
      quantity: 30,
      images: JSON.stringify(['/images/products/spinach.jpg']),
      weight: 0.25,
      featured: false,
    },
    {
      name: 'Organic Cabbage',
      slug: 'organic-cabbage',
      description: 'Crunchy organic cabbage, perfect for salads and cooking.',
      price: 35,
      cost: 20,
      categoryId: categories[0].id,
      sku: 'VEG-CAB-004',
      quantity: 40,
      images: JSON.stringify(['/images/products/cabbage.jpg']),
      weight: 0.8,
      featured: false,
    },
    {
      name: 'Mountain Carrots',
      slug: 'mountain-carrots',
      description: 'Sweet and nutritious carrots from high-altitude organic farms.',
      price: 45,
      compareAtPrice: 60,
      cost: 30,
      categoryId: categories[0].id,
      sku: 'VEG-CAR-005',
      quantity: 60,
      images: JSON.stringify(['/images/products/carrots.jpg']),
      weight: 0.5,
      featured: true,
    },
    {
      name: 'Organic Cauliflower',
      slug: 'organic-cauliflower',
      description: 'Fresh organic cauliflower, grown without chemicals or pesticides.',
      price: 50,
      cost: 30,
      categoryId: categories[0].id,
      sku: 'VEG-CAU-006',
      quantity: 25,
      images: JSON.stringify(['/images/products/cauliflower.jpg']),
      weight: 0.6,
      featured: false,
    },
    {
      name: 'Green Peas',
      slug: 'green-peas',
      description: 'Sweet green peas, freshly picked from village gardens.',
      price: 70,
      compareAtPrice: 85,
      cost: 45,
      categoryId: categories[0].id,
      sku: 'VEG-PEA-007',
      quantity: 35,
      images: JSON.stringify(['/images/products/peas.jpg']),
      weight: 0.5,
      featured: false,
    },

    // Fruits (5 products)
    {
      name: 'Himalayan Apples',
      slug: 'himalayan-apples',
      description: 'Crisp and sweet apples from high-altitude orchards. Premium quality fruit.',
      price: 150,
      compareAtPrice: 180,
      cost: 100,
      categoryId: categories[1].id, // fruits
      sku: 'FRU-APP-001',
      quantity: 80,
      images: JSON.stringify(['/images/products/apples.jpg']),
      weight: 1.0,
      featured: true,
    },
    {
      name: 'Mountain Plums',
      slug: 'mountain-plums',
      description: 'Juicy plums grown in the pristine Himalayan environment.',
      price: 120,
      cost: 80,
      categoryId: categories[1].id,
      sku: 'FRU-PLU-002',
      quantity: 40,
      images: JSON.stringify(['/images/products/plums.jpg']),
      weight: 0.5,
      featured: false,
    },
    {
      name: 'Organic Pears',
      slug: 'organic-pears',
      description: 'Sweet and succulent pears from Damday orchards.',
      price: 130,
      compareAtPrice: 150,
      cost: 85,
      categoryId: categories[1].id,
      sku: 'FRU-PEA-003',
      quantity: 50,
      images: JSON.stringify(['/images/products/pears.jpg']),
      weight: 0.75,
      featured: false,
    },
    {
      name: 'Wild Berries',
      slug: 'wild-berries',
      description: 'Hand-picked wild berries from the mountain forests.',
      price: 200,
      compareAtPrice: 250,
      cost: 120,
      categoryId: categories[1].id,
      sku: 'FRU-BER-004',
      quantity: 20,
      images: JSON.stringify(['/images/products/berries.jpg']),
      weight: 0.25,
      featured: true,
    },
    {
      name: 'Fresh Peaches',
      slug: 'fresh-peaches',
      description: 'Sweet peaches from village orchards, ripened naturally.',
      price: 140,
      cost: 90,
      categoryId: categories[1].id,
      sku: 'FRU-PEACH-005',
      quantity: 30,
      images: JSON.stringify(['/images/products/peaches.jpg']),
      weight: 0.6,
      featured: false,
    },

    // Grains & Pulses (4 products)
    {
      name: 'Himalayan Red Rice',
      slug: 'himalayan-red-rice',
      description: 'Nutritious red rice variety, traditionally grown in mountain terraces.',
      price: 120,
      compareAtPrice: 140,
      cost: 80,
      categoryId: categories[2].id, // grains-pulses
      sku: 'GRA-RIC-001',
      quantity: 100,
      images: JSON.stringify(['/images/products/red-rice.jpg']),
      weight: 1.0,
      featured: true,
    },
    {
      name: 'Organic Wheat',
      slug: 'organic-wheat',
      description: 'Stone-ground organic wheat from local farms.',
      price: 60,
      cost: 40,
      categoryId: categories[2].id,
      sku: 'GRA-WHE-002',
      quantity: 150,
      images: JSON.stringify(['/images/products/wheat.jpg']),
      weight: 1.0,
      featured: false,
    },
    {
      name: 'Black Lentils (Urad Dal)',
      slug: 'black-lentils',
      description: 'Premium quality black lentils, organically grown.',
      price: 100,
      compareAtPrice: 120,
      cost: 70,
      categoryId: categories[2].id,
      sku: 'GRA-LEN-003',
      quantity: 80,
      images: JSON.stringify(['/images/products/lentils.jpg']),
      weight: 1.0,
      featured: false,
    },
    {
      name: 'Himalayan Barley',
      slug: 'himalayan-barley',
      description: 'Traditional barley variety, perfect for making traditional dishes.',
      price: 80,
      cost: 50,
      categoryId: categories[2].id,
      sku: 'GRA-BAR-004',
      quantity: 70,
      images: JSON.stringify(['/images/products/barley.jpg']),
      weight: 1.0,
      featured: false,
    },

    // Dairy Products (3 products)
    {
      name: 'Fresh Cow Milk',
      slug: 'fresh-cow-milk',
      description: 'Pure cow milk from grass-fed local cattle. Delivered fresh daily.',
      price: 60,
      cost: 35,
      categoryId: categories[3].id, // dairy
      sku: 'DAI-MIL-001',
      quantity: 50,
      images: JSON.stringify(['/images/products/milk.jpg']),
      weight: 1.0,
      featured: true,
    },
    {
      name: 'Himalayan Ghee',
      slug: 'himalayan-ghee',
      description: 'Traditional ghee made from pure cow milk. Rich in nutrients.',
      price: 500,
      compareAtPrice: 600,
      cost: 350,
      categoryId: categories[3].id,
      sku: 'DAI-GHE-002',
      quantity: 40,
      images: JSON.stringify(['/images/products/ghee.jpg']),
      weight: 0.5,
      featured: true,
    },
    {
      name: 'Village Paneer',
      slug: 'village-paneer',
      description: 'Fresh homemade paneer (cottage cheese) from local milk.',
      price: 180,
      compareAtPrice: 220,
      cost: 120,
      categoryId: categories[3].id,
      sku: 'DAI-PAN-003',
      quantity: 30,
      images: JSON.stringify(['/images/products/paneer.jpg']),
      weight: 0.25,
      featured: false,
    },

    // Honey & Preserves (3 products)
    {
      name: 'Pure Mountain Honey',
      slug: 'pure-mountain-honey',
      description: 'Raw, unprocessed honey from Himalayan wildflowers. Pure and natural.',
      price: 400,
      compareAtPrice: 500,
      cost: 250,
      categoryId: categories[4].id, // honey-preserves
      sku: 'HON-HNY-001',
      quantity: 60,
      images: JSON.stringify(['/images/products/honey.jpg']),
      weight: 0.5,
      featured: true,
    },
    {
      name: 'Mango Pickle',
      slug: 'mango-pickle',
      description: 'Traditional mango pickle made with organic ingredients and spices.',
      price: 150,
      cost: 90,
      categoryId: categories[4].id,
      sku: 'HON-PIC-002',
      quantity: 45,
      images: JSON.stringify(['/images/products/pickle.jpg']),
      weight: 0.3,
      featured: false,
    },
    {
      name: 'Mixed Fruit Jam',
      slug: 'mixed-fruit-jam',
      description: 'Homemade jam from fresh Himalayan fruits with minimal sugar.',
      price: 180,
      compareAtPrice: 220,
      cost: 110,
      categoryId: categories[4].id,
      sku: 'HON-JAM-003',
      quantity: 35,
      images: JSON.stringify(['/images/products/jam.jpg']),
      weight: 0.25,
      featured: false,
    },

    // Herbs & Spices (4 products)
    {
      name: 'Organic Turmeric Powder',
      slug: 'organic-turmeric',
      description: 'Pure turmeric powder from organically grown turmeric roots.',
      price: 200,
      compareAtPrice: 250,
      cost: 130,
      categoryId: categories[5].id, // herbs-spices
      sku: 'HER-TUR-001',
      quantity: 70,
      images: JSON.stringify(['/images/products/turmeric.jpg']),
      weight: 0.2,
      featured: true,
    },
    {
      name: 'Himalayan Rock Salt',
      slug: 'himalayan-rock-salt',
      description: 'Natural pink salt from the Himalayan mountains. Rich in minerals.',
      price: 100,
      cost: 60,
      categoryId: categories[5].id,
      sku: 'HER-SAL-002',
      quantity: 100,
      images: JSON.stringify(['/images/products/salt.jpg']),
      weight: 0.5,
      featured: false,
    },
    {
      name: 'Dried Mint Leaves',
      slug: 'dried-mint',
      description: 'Sun-dried mint leaves, perfect for tea and cooking.',
      price: 80,
      compareAtPrice: 100,
      cost: 50,
      categoryId: categories[5].id,
      sku: 'HER-MIN-003',
      quantity: 50,
      images: JSON.stringify(['/images/products/mint.jpg']),
      weight: 0.1,
      featured: false,
    },
    {
      name: 'Organic Ginger',
      slug: 'organic-ginger',
      description: 'Fresh organic ginger root, known for its medicinal properties.',
      price: 120,
      cost: 75,
      categoryId: categories[5].id,
      sku: 'HER-GIN-004',
      quantity: 40,
      images: JSON.stringify(['/images/products/ginger.jpg']),
      weight: 0.25,
      featured: false,
    },
  ]

  let createdCount = 0
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
    createdCount++
  }

  console.log(`✅ Created ${createdCount} organic products across ${categories.length} categories`)

  console.log('\n🎉 Seed completed successfully!')
  console.log('\nℹ️  Login credentials:')
  console.log('   Email: admin@damdayvillage.com')
  console.log('   Password: admin123')
  console.log('\n📦 Marketplace Data:')
  console.log(`   Categories: ${categories.length}`)
  console.log(`   Products: ${createdCount}`)
  console.log('   Total inventory value: ₹' + products.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString())
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
