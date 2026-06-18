'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const benefits = [
  'Hijrah Tracker untuk 7 ibadah harian',
  'Akses 500+ konten islami',
  'Bergabung komunitas 50K+ Muslimah',
  'AI Muslimah Companion 24/7',
  'Quran Memorization Tracker',
  'Jurnal pribadi yang aman & privat',
]

export default function RegisterPage() {
  const router = useRouter()
  const { signInWithGoogle, user, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Redirect to dashboard when user is authenticated (handles mobile redirect return)
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) { setStep(2); return }
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-teal-950 via-slate-900 to-emerald-950 flex-col items-center justify-center p-12">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl"
        />

        <div className="relative z-10 max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-4xl mx-auto mb-6 shadow-2xl text-center">
              🌸
            </div>
            <h2 className="text-3xl font-bold text-white mb-4 text-center">Mulai Hijrah Kamu</h2>
            <p className="text-slate-300 text-center mb-8 leading-relaxed">
              Bergabung dengan Muslimah Journey dan mulai perjalanan
              menjadi Muslimah yang lebih baik hari ini.
            </p>
          </motion.div>

          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-teal-500/20 border border-teal-500/40 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-teal-400" />
                </div>
                <span className="text-slate-300 text-sm">{benefit}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">💚</span>
              <span className="text-white font-semibold text-sm">100% Gratis untuk Memulai</span>
            </div>
            <p className="text-slate-400 text-xs">Tidak ada kartu kredit. Upgrade kapan saja.</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="flex items-center gap-2 mb-8 w-fit">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center">
              <span className="text-white text-lg">🌙</span>
            </div>
            <div>
              <span className="font-bold text-lg text-foreground">Muslimah</span>
              <span className="text-teal-600 font-bold text-lg"> Journey</span>
            </div>
          </Link>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {step === 1 ? 'Buat Akun Gratis' : 'Lengkapi Profil'}
            </h1>
            <p className="text-muted-foreground">
              Sudah punya akun?{' '}
              <Link href="/auth/login" className="text-teal-600 font-semibold hover:underline">Masuk di sini</Link>
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex gap-2 mb-8">
            {[1, 2].map(s => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-teal-600' : 'bg-muted'}`} />
            ))}
          </div>

          {/* Google */}
          <button onClick={async () => { const ok = await signInWithGoogle(); if (ok) router.push('/dashboard') }} className="w-full flex items-center justify-center gap-3 border border-border rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-all duration-200 mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Daftar dengan Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">atau daftar dengan email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Nama Lengkap</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Nama kamu" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder="muslimah@email.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="pl-10" required />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type={showPassword ? 'text' : 'password'} placeholder="Min. 8 karakter" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} className="pl-10 pr-10" required minLength={8} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Konfirmasi Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="password" placeholder="Ulangi password" value={form.confirmPassword} onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))} className="pl-10" required />
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={form.agreeTerms}
                    onChange={e => setForm(p => ({ ...p, agreeTerms: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 accent-teal-600"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    Saya setuju dengan{' '}
                    <Link href="/terms" className="text-teal-600 hover:underline">Syarat & Ketentuan</Link>
                    {' '}dan{' '}
                    <Link href="/privacy" className="text-teal-600 hover:underline">Kebijakan Privasi</Link>
                  </label>
                </div>
              </>
            )}

            <Button type="submit" className="w-full gap-2" size="lg" disabled={isLoading}>
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Membuat akun...</>
              ) : step === 1 ? (
                <>Lanjutkan <ArrowRight className="w-4 h-4" /></>
              ) : (
                <>Buat Akun Sekarang <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
