'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DailyBoostSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 bg-gradient-to-br from-teal-950 via-slate-900 to-teal-900 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 islamic-pattern opacity-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 rounded-full px-4 py-2 mb-4">
            <span className="text-teal-300 text-sm font-medium">☀️ Daily Islamic Boost</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Isi Ruhiyah Kamu Setiap Hari
          </h2>
          <p className="text-slate-300 text-lg max-w-xl mx-auto">
            Mulai hari dengan penuh berkah bersama ayat, hadits, dan motivasi pilihan
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Quran Verse */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📖</span>
              <div>
                <p className="text-teal-400 text-xs font-semibold uppercase tracking-wider">Ayat Al-Quran</p>
                <p className="text-slate-400 text-xs">QS. Al-Baqarah: 286</p>
              </div>
            </div>
            <p className="text-amber-300 text-xl font-arabic arabic-text leading-relaxed mb-3">
              لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا
            </p>
            <p className="text-slate-300 text-sm italic leading-relaxed">
              "Allah tidak membebani seseorang melainkan sesuai dengan kesanggupannya."
            </p>
          </motion.div>

          {/* Hadith */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌹</span>
              <div>
                <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">Hadits Harian</p>
                <p className="text-slate-400 text-xs">HR. Bukhari & Muslim</p>
              </div>
            </div>
            <p className="text-amber-300 text-base font-arabic arabic-text leading-relaxed mb-3">
              إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ
            </p>
            <p className="text-slate-300 text-sm italic leading-relaxed">
              "Sesungguhnya setiap amal perbuatan tergantung pada niatnya. Dan setiap orang akan mendapat balasan sesuai niatnya."
            </p>
          </motion.div>

          {/* Dua */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🤲</span>
              <div>
                <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Doa Hari Ini</p>
                <p className="text-slate-400 text-xs">Doa Pagi Hari</p>
              </div>
            </div>
            <p className="text-amber-300 text-base font-arabic arabic-text leading-relaxed mb-3">
              اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا
            </p>
            <p className="text-slate-300 text-sm italic leading-relaxed">
              "Ya Allah, dengan rahmat-Mu kami memasuki waktu pagi, dan dengan rahmat-Mu kami memasuki waktu petang."
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <Button variant="glass" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh Konten Harian
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
