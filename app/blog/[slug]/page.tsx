import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug, published: true },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  if (!post) {
    notFound()
  }

  // Safely parse categories and tags
  let categories: string[] = []
  let tags: string[] = []
  
  try {
    if (post.categories) {
      const parsed = JSON.parse(post.categories as string)
      categories = Array.isArray(parsed) ? parsed : []
    }
  } catch {
    categories = []
  }
  
  try {
    if (post.tags) {
      const parsed = JSON.parse(post.tags as string)
      tags = Array.isArray(parsed) ? parsed : []
    }
  } catch {
    tags = []
  }

  // Get related posts
  const relatedPosts = await prisma.post.findMany({
    where: {
      published: true,
      id: { not: post.id },
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-yellow-500 to-green-600 py-16">
          <div className="container mx-auto px-4">
            <Link href="/blog" className="inline-flex items-center text-white hover:text-white/90 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Link>
            
            {categories.length > 0 && (
              <div className="flex gap-2 mb-4">
                {categories.map((cat: string) => (
                  <span
                    key={cat}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="text-xl text-white/90 max-w-3xl">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-6 mt-6 text-white/90">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(post.createdAt), 'MMMM dd, yyyy')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <article className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-8">
              <div className="prose prose-lg max-w-none">
                {post.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-8 pt-8 border-t">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-gray-500" />
                    {tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Author Info */}
            <div className="bg-gradient-to-br from-orange-50 to-green-50 rounded-xl p-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {post.author.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Written by {post.author.name}</h3>
                  <p className="text-gray-600 text-sm">Damday Village Team</p>
                </div>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedPosts.map((related) => {
                    const relatedCategories = related.categories ? JSON.parse(related.categories as string) : []
                    return (
                      <Link key={related.id} href={`/blog/${related.slug}`}>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                          <div className="p-6">
                            {relatedCategories.length > 0 && (
                              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                {relatedCategories[0]}
                              </span>
                            )}
                            <h3 className="font-bold text-lg mt-3 mb-2 text-gray-900 line-clamp-2">
                              {related.title}
                            </h3>
                            {related.excerpt && (
                              <p className="text-gray-600 text-sm line-clamp-2">{related.excerpt}</p>
                            )}
                            <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                              <Calendar className="w-4 h-4" />
                              <span>{format(new Date(related.createdAt), 'MMM dd, yyyy')}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
