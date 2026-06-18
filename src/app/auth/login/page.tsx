'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const router = useRouter()
  const { signInWithGoogle } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-teal-950 via-slate-900 to-teal-900 flex-col items-center justify-center p-12">
        <div className="absolute inset-0 islamic-pattern opacity-20" />

        {/* Animated orbs */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 right-20 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 left-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"
        />

        <div className="relative z-10 text-center max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl">
              🌙
            </div>
            <p className="text-amber-300 text-2xl font-arabic mb-4 arabic-text">
              السَّلَامُ عَلَيْكُمْ
            </p>
            <h2 className="text-3xl font-bold text-white mb-4">Selamat Datang Kembali</h2>
            <p className="text-slate-300 leading-relaxed">
              Lanjutkan perjalanan hijrah kamu. Konsistensi kecil setiap hari
              adalah kunci istiqomah yang sesungguhnya.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5"
          >
            <p className="text-teal-300 text-xs font-semibold uppercase tracking-wider mb-3">Ayat Motivasi</p>
            <p className="text-amber-300 text-lg font-arabic arabic-text leading-relaxed mb-2">
              إِنَّ مَعَ الْعُسْرِ يُسْرًا
            </p>
            <p className="text-slate-300 text-sm italic">
              "Sesungguhnya bersama kesulitan ada kemudahan." — QS. Al-Insyirah: 6
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { value: '50K+', label: 'Muslimah' },
              { value: '98%', label: 'Puas' },
              { value: '4.9⭐', label: 'Rating' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-white/5 rounded-xl p-3">
                <div className="text-white font-bold text-lg">{value}</div>
                <div className="text-slate-400 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 group w-fit">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center shadow-md">
              <span className="text-white text-lg">🌙</span>
            </div>
            <div>
              <span className="font-bold text-lg text-foreground">Muslimah</span>
              <span className="text-teal-600 font-bold text-lg"> Journey</span>
            </div>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">Masuk ke Akunmu</h1>
            <p className="text-muted-foreground">Belum punya akun?{' '}
              <Link href="/auth/register" className="text-teal-600 font-semibold hover:underline">Daftar gratis</Link>
            </p>
          </div>

          {/* Google Login */}
          <button onClick={async () => { await signInWithGoogle(); router.push('/dashboard') }} className="w-full flex items-center justify-center gap-3 border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-all duration-200 mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Lanjutkan dengan Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">atau masuk dengan email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="muslimah@email.com"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-teal-600 hover:underline">
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full gap-2" size="lg" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk ke Akun
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            Dengan masuk, kamu menyetujui{' '}
            <Link href="/terms" className="text-teal-600 hover:underline">Syarat & Ketentuan</Link>{' '}
            dan{' '}
            <Link href="/privacy" className="text-teal-600 hover:underline">Kebijakan Privasi</Link> kami.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
