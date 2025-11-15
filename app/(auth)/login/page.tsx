'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, LogIn } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Please try again.')
        setLoading(false)
      } else if (result?.ok) {
        // Success - redirect to dashboard
        router.push('/dashboard')
        router.refresh()
      } else {
        setError('An unexpected error occurred. Please try again.')
        setLoading(false)
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Connection failed. Please check your internet and try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-orange-900 to-emerald-900 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-green-500/10" />
      <div className="absolute inset-0 backdrop-blur-3xl" />
      
      <Card className="w-full max-w-md relative z-10 bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardHeader className="space-y-1 text-center pb-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl shadow-orange-500/50 animate-pulse">
              🇮🇳
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
          <p className="text-base text-white/60">Login to your Damday Village account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-orange-500 focus:ring-orange-500/50"
              />
            </div>
            {error && (
              <div className="text-sm text-red-300 bg-red-500/20 backdrop-blur-sm p-4 rounded-lg border border-red-500/30">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-500 to-green-600 hover:from-orange-600 hover:to-green-700 text-white font-semibold py-6 rounded-xl shadow-lg shadow-orange-500/50 hover:shadow-xl transition-all" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </>
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-base">
            <p className="text-white/70">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-orange-400 hover:text-orange-300 font-semibold hover:underline transition-colors">
                Create Account
              </Link>
            </p>
          </div>
          <div className="mt-6 pt-6 border-t border-white/10">
            <Link href="/" className="flex items-center justify-center text-sm text-white/60 hover:text-white transition-colors">
              <span className="mr-2">←</span> Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
