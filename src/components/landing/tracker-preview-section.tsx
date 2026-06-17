'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { CheckCircle2, Circle, Flame, Trophy, Star } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const habits = [
  { id: 1, icon: '🕌', label: 'Shalat 5 Waktu', completed: 4, total: 5, streak: 14 },
  { id: 2, icon: '📖', label: 'Tilawah Qur\'an', completed: 3, total: 5, streak: 7, unit: 'halaman' },
  { id: 3, icon: '📿', label: 'Dzikir Pagi & Petang', completed: 2, total: 2, streak: 21 },
  { id: 4, icon: '💝', label: 'Sedekah', completed: 1, total: 1, streak: 5 },
  { id: 5, icon: '🌙', label: 'Puasa Sunnah', completed: 0, total: 1, streak: 3 },
  { id: 6, icon: '🧕', label: 'Menjaga Hijab', completed: 1, total: 1, streak: 30 },
  { id: 7, icon: '💫', label: 'Menjaga Akhlak', completed: 1, total: 1, streak: 12 },
]

const badges = [
  { icon: '🔥', label: '30 Hari Streak', earned: true },
  { icon: '📿', label: 'Dzikir Master', earned: true },
  { icon: '🏆', label: 'Konsisten', earned: true },
  { icon: '⭐', label: 'Bintang Bulan', earned: false },
  { icon: '🌟', label: 'Super Muslimah', earned: false },
]

export function TrackerPreviewSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [checkedHabits, setCheckedHabits] = useState<number[]>([1, 2, 3, 4, 6, 7])

  const toggleHabit = (id: number) => {
    setCheckedHabits(prev =>
      prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    )
  }

  const totalCompleted = checkedHabits.length
  const totalHabits = habits.length
  const overallProgress = Math.round((totalCompleted / totalHabits) * 100)

  return (
    <section id="tracker" className="py-24 bg-muted/30" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4">Hijrah Tracker</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pantau Ibadah Harianmu{' '}
              <span className="text-gradient">dengan Mudah</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Track 7 ibadah harian kamu, lihat streak konsistensi, dan raih achievement
              yang memotivasi. Visualisasi progress yang indah dan mudah dipahami.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Flame, label: 'Streak Terpanjang', value: '30 Hari', color: 'text-orange-500' },
                { icon: Trophy, label: 'Badge Diraih', value: '12 Badge', color: 'text-amber-500' },
                { icon: Star, label: 'Skor Minggu Ini', value: '94/100', color: 'text-teal-500' },
                { icon: CheckCircle2, label: 'Total Ibadah', value: '1,247', color: 'text-emerald-500' },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-card border border-border rounded-2xl p-4">
                  <Icon className={`w-6 h-6 ${color} mb-2`} />
                  <div className="text-xl font-bold text-foreground">{value}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>

            {/* Badges preview */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-3">Achievement Badges</p>
              <div className="flex gap-3 flex-wrap">
                {badges.map(({ icon, label, earned }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                      earned
                        ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-950/30 dark:border-teal-800 dark:text-teal-400'
                        : 'bg-muted border-border text-muted-foreground opacity-50'
                    }`}
                  >
                    <span className={earned ? '' : 'grayscale'}>{icon}</span>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: Interactive Tracker */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-card border border-border rounded-3xl p-6 shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-foreground">Tracker Ibadah</h3>
                  <p className="text-sm text-muted-foreground">Selasa, 17 Juni 2025</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-teal-600">{overallProgress}%</div>
                  <div className="text-xs text-muted-foreground">Selesai</div>
                </div>
              </div>

              {/* Overall Progress */}
              <div className="mb-6">
                <Progress value={overallProgress} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1">{totalCompleted} dari {totalHabits} ibadah selesai</p>
              </div>

              {/* Habit list */}
              <div className="space-y-3">
                {habits.map((habit) => {
                  const isChecked = checkedHabits.includes(habit.id)
                  const progress = habit.completed / habit.total * 100
                  return (
                    <motion.div
                      key={habit.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => toggleHabit(habit.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        isChecked
                          ? 'bg-teal-50 border border-teal-200 dark:bg-teal-950/20 dark:border-teal-800'
                          : 'bg-muted/50 border border-transparent hover:border-border'
                      }`}
                    >
                      <div className="text-xl w-8 text-center">{habit.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-medium truncate ${isChecked ? 'text-teal-700 dark:text-teal-400' : 'text-foreground'}`}>
                            {habit.label}
                          </span>
                          <div className="flex items-center gap-1 ml-2 shrink-0">
                            <Flame className="w-3 h-3 text-orange-400" />
                            <span className="text-xs text-muted-foreground">{habit.streak}</span>
                          </div>
                        </div>
                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isChecked ? 'bg-gradient-to-r from-teal-500 to-emerald-400' : 'bg-muted-foreground/20'}`}
                            style={{ width: `${isChecked ? 100 : progress}%` }}
                          />
                        </div>
                      </div>
                      <div className={`shrink-0 ${isChecked ? 'text-teal-500' : 'text-muted-foreground/40'}`}>
                        {isChecked ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-semibold text-foreground">14 Hari Berturut-turut!</span>
                </div>
                <span className="text-xs text-muted-foreground">Klik untuk centang ✓</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
