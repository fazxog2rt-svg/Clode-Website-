'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Badge } from '@/components/ui/badge'

const levels = [
  { level: 1, name: 'New Sister', icon: '🌱', color: 'from-green-400 to-emerald-500', current: false },
  { level: 2, name: 'Hijrah Starter', icon: '🌸', color: 'from-pink-400 to-rose-500', current: false },
  { level: 3, name: 'Consistent Muslimah', icon: '⭐', color: 'from-amber-400 to-yellow-500', current: true },
  { level: 4, name: 'Knowledge Seeker', icon: '📚', color: 'from-blue-400 to-cyan-500', current: false },
  { level: 5, name: 'Quran Lover', icon: '💚', color: 'from-teal-400 to-emerald-600', current: false },
  { level: 6, name: 'Future Hafidzah', icon: '🌟', color: 'from-purple-400 to-violet-600', current: false },
  { level: 7, name: 'Inspiring Muslimah', icon: '👑', color: 'from-gold-400 to-amber-600', current: false },
]

const achievements = [
  { icon: '🔥', title: '7 Hari Streak', desc: 'Konsisten 7 hari berturut-turut' },
  { icon: '📖', title: 'Khatam Juz 30', desc: 'Menyelesaikan hafalan Juz 30' },
  { icon: '🌟', title: 'Top Contributor', desc: 'Berkontribusi di komunitas' },
  { icon: '💪', title: 'Shalat Sempurna', desc: 'Shalat 5 waktu selama 30 hari' },
  { icon: '📿', title: 'Dzikir Master', desc: 'Dzikir 1000 kali dalam sehari' },
  { icon: '🤲', title: 'Sedekah Rutin', desc: 'Sedekah 30 hari berturut-turut' },
]

export function GamificationSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 bg-muted/20" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4">Sistem Gamifikasi</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ibadah Makin Semangat dengan{' '}
            <span className="text-gradient">Level & Reward</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Naiki level, raih badge, dan bangun streak yang membuktikan konsistensi hijrah kamu
          </p>
        </motion.div>

        {/* Levels */}
        <div className="mb-16">
          <h3 className="text-lg font-bold text-foreground text-center mb-8">Perjalanan Level Muslimah</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {levels.map((level, index) => (
              <motion.div
                key={level.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`relative flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border transition-all duration-300 ${
                  level.current
                    ? 'border-teal-500 bg-teal-50 dark:bg-teal-950/30 shadow-lg shadow-teal-500/20 scale-105'
                    : 'border-border bg-card hover:border-teal-300 hover:shadow-md'
                }`}
              >
                {level.current && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                    <Badge className="text-xs px-2 py-0.5 whitespace-nowrap">Kamu di sini</Badge>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center text-2xl shadow-md`}>
                  {level.icon}
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground font-medium">Level {level.level}</div>
                  <div className="text-sm font-bold text-foreground whitespace-nowrap">{level.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h3 className="text-lg font-bold text-foreground text-center mb-8">Achievement Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.07 }}
                className="bg-card border border-border rounded-2xl p-4 text-center hover:shadow-lg hover:border-teal-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <div className="text-sm font-bold text-foreground mb-1">{achievement.title}</div>
                <div className="text-xs text-muted-foreground leading-snug">{achievement.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
