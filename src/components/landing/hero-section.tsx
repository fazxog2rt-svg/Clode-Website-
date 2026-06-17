'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Star, Users, BookOpen, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

const stats = [
  { icon: Users, value: '50K+', label: 'Muslimah' },
  { icon: BookOpen, value: '500+', label: 'Materi' },
  { icon: Star, value: '4.9', label: 'Rating' },
  { icon: Heart, value: '98%', label: 'Puas' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal-950 via-slate-900 to-teal-900" />

      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Islamic geometric pattern */}
      <div className="absolute inset-0 islamic-pattern opacity-20" />

      {/* Stars/particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/60 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
          transition={{
            duration: 3 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 rounded-full px-4 py-2 mb-6"
            >
              <span className="text-xs">✨</span>
              <span className="text-teal-300 text-xs font-medium">Platform Islami Premium #1 Indonesia</span>
            </motion.div>

            {/* Arabic */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-amber-400 text-xl font-arabic mb-3 arabic-text"
            >
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </motion.p>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
            >
              Berhijrah Tidak{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
                  Harus Sendiri
                </span>
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-teal-400 to-emerald-400"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                />
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Temukan ilmu, sahabat, dan motivasi untuk menjadi Muslimah yang lebih baik setiap hari.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
            >
              <Link href="/auth/register">
                <Button size="xl" className="w-full sm:w-auto gap-2 text-base shadow-xl shadow-teal-900/50">
                  Mulai Hijrah
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="#community">
                <Button variant="glass" size="xl" className="w-full sm:w-auto text-base">
                  Gabung Komunitas
                </Button>
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center gap-4 justify-center lg:justify-start"
            >
              <div className="flex -space-x-2">
                {['🧕', '🧕', '🧕', '🧕', '🧕'].map((emoji, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 border-2 border-teal-900 flex items-center justify-center text-sm"
                  >
                    {emoji}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-400 text-xs">50,000+ Muslimah bergabung</p>
              </div>
            </motion.div>
          </div>

          {/* Right - Illustration/Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main card */}
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-2xl">
                    🧕
                  </div>
                  <div>
                    <p className="text-white font-semibold">Assalamu'alaikum, Aisyah!</p>
                    <p className="text-slate-400 text-sm">Semangat berhijrah hari ini 💚</p>
                  </div>
                  <div className="ml-auto bg-amber-500/20 border border-amber-500/30 rounded-xl px-3 py-1">
                    <span className="text-amber-400 text-xs font-medium">🔥 7 Hari Streak</span>
                  </div>
                </div>

                {/* Daily verse */}
                <div className="bg-teal-900/40 border border-teal-500/20 rounded-2xl p-4 mb-4">
                  <p className="text-teal-300 text-xs font-medium mb-2">✨ Ayat Hari Ini</p>
                  <p className="text-amber-300 text-lg font-arabic arabic-text leading-relaxed mb-2">
                    وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
                  </p>
                  <p className="text-slate-300 text-xs italic">
                    "Dan barangsiapa bertakwa kepada Allah, niscaya Dia akan membukakan jalan keluar baginya."
                    <span className="text-slate-500"> (QS. At-Talaq: 2)</span>
                  </p>
                </div>

                {/* Progress */}
                <div>
                  <p className="text-slate-300 text-xs font-medium mb-3">Progress Ibadah Hari Ini</p>
                  <div className="space-y-2.5">
                    {[
                      { label: '🕌 Shalat 5 Waktu', value: 80, done: '4/5' },
                      { label: '📖 Tilawah Qur\'an', value: 60, done: '3/5 hlm' },
                      { label: '📿 Dzikir Pagi', value: 100, done: 'Selesai ✓' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-300">{item.label}</span>
                          <span className="text-teal-400">{item.done}</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -top-6 -right-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="text-white text-xs font-semibold">Consistent Muslimah</p>
                    <p className="text-slate-400 text-xs">Level 3 tercapai!</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                className="absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">👥</span>
                  <div>
                    <p className="text-white text-xs font-semibold">Komunitas Aktif</p>
                    <p className="text-teal-400 text-xs">+128 anggota baru</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center hover:bg-white/10 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 flex items-center justify-center mx-auto mb-2">
                <Icon className="w-5 h-5 text-teal-400" />
              </div>
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-slate-400 text-xs">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 80L1440 80L1440 40C1440 40 1200 0 720 0C240 0 0 40 0 40L0 80Z" className="fill-background" />
        </svg>
      </div>
    </section>
  )
}
