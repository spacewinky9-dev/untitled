'use client'

import { AlertTriangle, Package } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface Product {
  id: string
  name: string
  stock: number
  minStock: number
}

export default function InventoryAlerts({ products }: { products: Product[] }) {
  const lowStock = products.filter(p => p.stock <= p.minStock)

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-yellow-600" />
        Low Stock Alerts
      </h3>
      {lowStock.length === 0 ? (
        <p className="text-sm text-gray-500">No low stock items</p>
      ) : (
        <div className="space-y-2">
          {lowStock.map(product => (
            <div key={product.id} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="text-sm">{product.name}</span>
              </div>
              <span className="text-sm font-bold text-red-600">
                {product.stock} left
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
