'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Sparkles, TrendingUp, BookOpen, Users, Sun, BookMarked,
  PenLine, Calendar, ShoppingBag, UserCheck
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    icon: Sparkles,
    title: 'AI Muslimah Companion',
    description: 'Asisten AI yang memberikan motivasi islami harian, pengingat ibadah, saran kebiasaan, dan panduan hijrah personal.',
    color: 'from-purple-500 to-pink-500',
    badge: 'AI Powered',
    badgeVariant: 'purple' as const,
    items: ['Motivasi harian', 'Reminder ibadah', 'Panduan hijrah'],
  },
  {
    icon: TrendingUp,
    title: 'Hijrah Tracker',
    description: 'Pantau progress shalat, tilawah, dzikir, sedekah, puasa sunnah, dan akhlak dengan visualisasi yang indah.',
    color: 'from-teal-500 to-emerald-600',
    badge: 'Favorit',
    badgeVariant: 'emerald' as const,
    items: ['7 ibadah harian', 'Streak & badges', 'Statistik detail'],
  },
  {
    icon: BookOpen,
    title: 'Learning Center',
    description: 'Ribuan artikel, video, podcast, dan e-book islami yang dikurasi oleh ustadzah berpengalaman.',
    color: 'from-blue-500 to-cyan-500',
    badge: '500+ Konten',
    badgeVariant: 'default' as const,
    items: ['Aqidah & Fiqih', 'Tahsin & Tahfidz', 'Parenting Islami'],
  },
  {
    icon: Users,
    title: 'Muslimah Community',
    description: 'Bergabung dengan ribuan Muslimah yang saling mendukung. Berbagi cerita, diskusi, dan tumbuh bersama.',
    color: 'from-rose-500 to-pink-600',
    badge: '50K+ Anggota',
    badgeVariant: 'pink' as const,
    items: ['Forum diskusi', 'Berbagi cerita', 'Support groups'],
  },
  {
    icon: Sun,
    title: 'Daily Islamic Boost',
    description: 'Ayat Al-Quran, hadits, doa, dan motivasi islami setiap hari untuk mengisi ruhiyah kamu.',
    color: 'from-amber-500 to-orange-500',
    badge: 'Harian',
    badgeVariant: 'gold' as const,
    items: ['Ayat & hadits', 'Doa harian', 'Motivasi hijrah'],
  },
  {
    icon: BookMarked,
    title: 'Quran Memorization',
    description: 'Sistem tracker hafalan Quran dengan jadwal murajaah otomatis, statistik, dan pencapaian.',
    color: 'from-green-500 to-teal-500',
    badge: 'Tahfidz',
    badgeVariant: 'emerald' as const,
    items: ['Target hafalan', 'Jadwal murajaah', 'Dashboard progress'],
  },
  {
    icon: PenLine,
    title: 'Muslimah Journal',
    description: 'Jurnal pribadi yang aman dan privat. Mood tracker, catatan syukur, dan refleksi harian.',
    color: 'from-violet-500 to-purple-600',
    badge: 'Privat',
    badgeVariant: 'purple' as const,
    items: ['Mood tracker', 'Jurnal syukur', 'Refleksi diri'],
  },
  {
    icon: Calendar,
    title: 'Event & Kajian',
    description: 'Temukan kajian online dan offline, webinar, dan workshop islami di seluruh Indonesia.',
    color: 'from-sky-500 to-blue-600',
    badge: 'Live Events',
    badgeVariant: 'default' as const,
    items: ['Kajian online', 'Workshop', 'Registrasi mudah'],
  },
  {
    icon: ShoppingBag,
    title: 'Muslimah Marketplace',
    description: 'Belanja hijab, abaya, buku islami, dan aksesoris Muslimah dari seller terpercaya.',
    color: 'from-pink-500 to-rose-600',
    badge: 'Terpercaya',
    badgeVariant: 'pink' as const,
    items: ['Hijab & Abaya', 'Buku islami', 'Aksesoris'],
  },
  {
    icon: UserCheck,
    title: 'Sahabat Hijrah',
    description: 'Temukan sahabat hijrah yang sesuai dengan minat, tujuan, dan semangat yang sama.',
    color: 'from-teal-400 to-cyan-500',
    badge: 'Matching',
    badgeVariant: 'emerald' as const,
    items: ['Smart matching', 'Chat privat', 'Goals serupa'],
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" className="py-24 bg-background" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 px-4 py-1.5">10 Fitur Unggulan</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Semua yang Kamu Butuhkan{' '}
            <span className="text-gradient">dalam Satu Platform</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dari tracker ibadah hingga komunitas Muslimah, semua fitur dirancang
            khusus untuk mendukung perjalanan hijrah kamu.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isWide = index < 2
            return (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                className={`group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-teal-500/5 transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                  isWide ? 'xl:col-span-2' : 'xl:col-span-1'
                } ${index === 2 ? 'xl:col-span-1' : ''}`}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Badge */}
                <Badge variant={feature.badgeVariant} className="mb-3 text-xs">
                  {feature.badge}
                </Badge>

                {/* Content */}
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{feature.description}</p>

                {/* Items */}
                <ul className="space-y-1.5">
                  {feature.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Hover arrow */}
                <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-muted flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-teal-50 dark:group-hover:bg-teal-950/30">
                  <svg className="w-4 h-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
