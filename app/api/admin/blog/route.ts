import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// Force dynamic rendering for authentication
export const dynamic = 'force-dynamic'

// POST /api/admin/blog - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, slug, excerpt, content, categories, tags, published } = body

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if slug already exists
    const existing = await prisma.post.findUnique({
      where: { slug },
    })

    if (existing) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt || '',
        content,
        authorId: session.user.id,
        published: published || false,
        categories: categories && categories.length > 0 ? JSON.stringify(categories) : null,
        tags: tags && tags.length > 0 ? JSON.stringify(tags) : null,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      post,
      message: 'Post created successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/blog error:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

// GET /api/admin/blog - List all blog posts (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('GET /api/admin/blog error:', error)
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}
