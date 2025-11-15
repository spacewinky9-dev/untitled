import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AdminSidebar from '@/components/admin/Sidebar'
import BlogActions from '@/components/admin/BlogActions'

export default async function AdminBlogPage() {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
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

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.published).length,
    draft: posts.filter(p => !p.published).length,
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
              <p className="text-gray-600 mt-2">Manage blog posts and articles</p>
            </div>
            <Link href="/admin/blog/new">
              <Button>Create New Post</Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-gray-600 text-sm">Total Posts</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
              <div className="text-green-700 text-sm">Published</div>
              <div className="text-2xl font-bold text-green-700">{stats.published}</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg shadow border border-yellow-200">
              <div className="text-yellow-700 text-sm">Drafts</div>
              <div className="text-2xl font-bold text-yellow-700">{stats.draft}</div>
            </div>
          </div>

          {/* Posts Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categories
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {posts.map((post) => {
                    // Safely parse categories
                    let categories: string[] = []
                    try {
                      if (post.categories) {
                        const parsed = JSON.parse(post.categories as string)
                        categories = Array.isArray(parsed) ? parsed : []
                      }
                    } catch {
                      categories = []
                    }
                    
                    return (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{post.title}</div>
                          {post.excerpt && (
                            <div className="text-sm text-gray-500 line-clamp-1">{post.excerpt}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{post.author.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {categories.slice(0, 2).map((cat: string) => (
                              <span key={cat} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                {cat}
                              </span>
                            ))}
                            {categories.length > 2 && (
                              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                +{categories.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {post.published ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Published
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(new Date(post.createdAt), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-900 mr-4">
                            View
                          </Link>
                          <Link href={`/admin/blog/${post.id}`} className="text-orange-600 hover:text-orange-900">
                            Edit
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                  {posts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center justify-center">
                          <p className="mb-4">No blog posts yet</p>
                          <Link href="/admin/blog/new">
                            <Button>Create Your First Post</Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
