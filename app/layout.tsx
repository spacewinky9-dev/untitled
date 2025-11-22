import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import CartDrawer from '@/components/cart/CartDrawer'

export const metadata: Metadata = {
  title: 'Damday Village - Smart Carbon-Free Village',
  description: 'Smart Carbon-Free Village in the Himalayan Devbhumi region',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <CartDrawer />
        </Providers>
      </body>
    </html>
  )
}
