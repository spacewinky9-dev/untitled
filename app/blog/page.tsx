import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { Calendar, User, Tag, ChevronRight } from 'lucide-react'
import Header from '@/components/Header'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  // Safely parse categories from all posts
  const categories = [...new Set(posts.flatMap(p => {
    if (!p.categories) return []
    try {
      const parsed = JSON.parse(p.categories as string)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }))]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-500 via-yellow-500 to-green-600 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Damday Village Blog & News
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Stories, updates, and insights from India&apos;s first smart carbon-free village
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="space-y-8">
                {posts.map((post) => {
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
                  
                  return (
                    <article
                      key={post.id}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="p-8">
                        {/* Categories */}
                        {categories.length > 0 && (
                          <div className="flex gap-2 mb-4">
                            {categories.map((cat: string) => (
                              <span
                                key={cat}
                                className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Title */}
                        <Link href={`/blog/${post.slug}`}>
                          <h2 className="text-3xl font-bold text-gray-900 mb-4 hover:text-orange-600 transition-colors">
                            {post.title}
                          </h2>
                        </Link>

                        {/* Excerpt */}
                        {post.excerpt && (
                          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{post.author.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{format(new Date(post.createdAt), 'MMM dd, yyyy')}</span>
                          </div>
                          {tags.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4" />
                              <span>{tags.slice(0, 3).join(', ')}</span>
                            </div>
                          )}
                        </div>

                        {/* Read More */}
                        <Link href={`/blog/${post.slug}`}>
                          <button className="flex items-center gap-2 text-orange-600 font-medium hover:text-orange-700 transition-colors">
                            Read More
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    </article>
                  )
                })}

                {posts.length === 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                    <p className="text-gray-500 text-lg">No blog posts published yet. Check back soon!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Categories */}
                {categories.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((cat: string) => (
                        <button
                          key={cat}
                          className="block w-full text-left px-4 py-2 rounded-lg hover:bg-orange-50 hover:text-orange-600 transition-colors text-gray-700"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Posts */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Posts</h3>
                  <div className="space-y-4">
                    {posts.slice(0, 5).map((post) => (
                      <Link key={post.id} href={`/blog/${post.slug}`}>
                        <div className="hover:bg-gray-50 p-2 rounded-lg transition-colors">
                          <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Newsletter CTA */}
                <div className="bg-gradient-to-br from-orange-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-3">Stay Updated</h3>
                  <p className="text-sm mb-4 text-white/90">
                    Get the latest news and updates from Damday Village delivered to your inbox.
                  </p>
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-4 py-2 rounded-lg text-gray-900 mb-3"
                  />
                  <button className="w-full bg-white text-orange-600 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
