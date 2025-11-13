import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || '',
        price: parseFloat(data.price),
        compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : null,
        cost: data.cost ? parseFloat(data.cost) : null,
        categoryId: data.categoryId,
        sku: data.sku,
        quantity: parseInt(data.quantity) || 0,
        trackInventory: data.trackInventory !== false,
        weight: data.weight ? parseFloat(data.weight) : null,
        featured: data.featured || false,
        active: data.active !== false,
      }
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session || session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Soft delete by setting active to false
    const product = await prisma.product.update({
      where: { id: params.id },
      data: { active: false }
    })

    return NextResponse.json(product)
  } catch (error: any) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete product' },
      { status: 500 }
    )
  }
}
