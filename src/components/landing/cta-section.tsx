'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CTASection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-gradient-to-br from-teal-950 via-slate-900 to-emerald-950" />
      <div className="absolute inset-0 islamic-pattern opacity-10" />

      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-teal-500/10 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-teal-300" />
            <span className="text-teal-300 text-sm font-medium">Gratis untuk memulai</span>
          </div>

          <p className="text-amber-300 text-2xl font-arabic mb-4 arabic-text">
            وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
          </p>
          <p className="text-slate-400 text-sm mb-8 italic">"Dan barangsiapa bertakwa kepada Allah, niscaya Dia akan membukakan jalan keluar baginya." — QS. At-Talaq: 2</p>

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Mulai Perjalanan Hijrah{' '}
            <span className="bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">
              Kamu Hari Ini
            </span>
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Bergabung dengan 50,000+ Muslimah yang sudah memulai perjalanan menjadi
            lebih baik setiap harinya. Gratis, tanpa kartu kredit.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="xl" className="w-full sm:w-auto gap-2 shadow-xl shadow-teal-900/50">
                <Sparkles className="w-5 h-5" />
                Mulai Hijrah Gratis
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="glass" size="xl" className="w-full sm:w-auto">
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </div>

          <p className="text-slate-500 text-sm mt-6">
            Tidak ada kartu kredit • Gratis selamanya untuk fitur dasar • Upgrade kapan saja
          </p>
        </motion.div>
      </div>
    </section>
  )
}
