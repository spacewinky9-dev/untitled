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
  console.log('\n🎉 Seed completed successfully!')
  console.log('\nℹ️  Login credentials:')
  console.log('   Email: admin@damdayvillage.com')
  console.log('   Password: admin123')
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
