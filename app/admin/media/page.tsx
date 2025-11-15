import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import AdminSidebar from '@/components/admin/Sidebar'
import { Image as ImageIcon, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function AdminMediaPage() {
  const session = await auth()

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
              <p className="text-gray-600 mt-2">Manage images and files</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Drag and drop files here or click to browse</p>
                  <Button>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Upload Files
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">No media files yet. Upload your first file!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
