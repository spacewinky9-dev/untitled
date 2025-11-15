'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2 } from 'lucide-react'

interface Variant {
  id: string
  name: string
  value: string
  price: number
  stock: number
}

export default function ProductVariants() {
  const [variants, setVariants] = useState<Variant[]>([])

  const addVariant = () => {
    setVariants([...variants, {
      id: Date.now().toString(),
      name: '',
      value: '',
      price: 0,
      stock: 0
    }])
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">Product Variants</h3>
        <Button onClick={addVariant} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </div>
      {variants.map((variant, idx) => (
        <div key={variant.id} className="grid grid-cols-5 gap-2 p-3 border rounded">
          <Input placeholder="Name (e.g. Size)" />
          <Input placeholder="Value (e.g. Large)" />
          <Input type="number" placeholder="Price" />
          <Input type="number" placeholder="Stock" />
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
