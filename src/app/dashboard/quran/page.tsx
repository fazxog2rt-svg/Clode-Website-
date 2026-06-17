'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookMarked, Target, CheckCircle2, Circle, Flame, TrendingUp, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const juzList = Array.from({ length: 30 }, (_, i) => ({
  number: 30 - i,
  name: `Juz ${30 - i}`,
  memorized: 30 - i === 30 ? true : 30 - i >= 28 ? true : false,
  inProgress: 30 - i === 27,
  percentage: 30 - i === 30 ? 100 : 30 - i === 29 ? 100 : 30 - i === 28 ? 100 : 30 - i === 27 ? 65 : 0,
}))

const revisionSchedule = [
  { day: 'Senin', juz: 'Juz 30', status: 'done', date: '16 Jun' },
  { day: 'Selasa', juz: 'Juz 29', status: 'today', date: '17 Jun' },
  { day: 'Rabu', juz: 'Juz 28', status: 'upcoming', date: '18 Jun' },
  { day: 'Kamis', juz: 'Juz 27 (65%)', status: 'upcoming', date: '19 Jun' },
  { day: 'Jumat', juz: 'Juz 30 (Ulangan)', status: 'upcoming', date: '20 Jun' },
  { day: 'Sabtu', juz: 'Free Revision', status: 'upcoming', date: '21 Jun' },
  { day: 'Ahad', juz: 'Self Evaluation', status: 'upcoming', date: '22 Jun' },
]

export default function QuranTrackerPage() {
  const [showAddGoal, setShowAddGoal] = useState(false)
  const memorizedCount = juzList.filter(j => j.memorized).length
  const totalProgress = Math.round((memorizedCount / 30) * 100)

  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Quran Memorization Tracker</h1>
          <p className="text-muted-foreground">Pantau progress hafalan dan jadwal muraja'ah Al-Quran kamu</p>
        </div>
        <Button onClick={() => setShowAddGoal(!showAddGoal)} className="gap-2">
          <Target className="w-4 h-4" /> Set Target Hafalan
        </Button>
      </motion.div>

      {/* Hero stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative bg-gradient-to-br from-teal-700 via-emerald-600 to-teal-800 rounded-3xl p-6 overflow-hidden"
      >
        <div className="absolute inset-0 islamic-pattern opacity-10" />
        <div className="relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            {[
              { icon: BookMarked, label: 'Juz Hafal', value: `${memorizedCount}/30`, color: 'text-teal-200' },
              { icon: TrendingUp, label: 'Total Progress', value: `${totalProgress}%`, color: 'text-emerald-200' },
              { icon: Flame, label: 'Streak Muraja\'ah', value: '14 Hari', color: 'text-amber-300' },
              { icon: Target, label: 'Target Selesai', value: 'Des 2025', color: 'text-pink-300' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="text-center">
                <Icon className={`w-6 h-6 ${color} mx-auto mb-1`} />
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-teal-200 text-xs">{label}</div>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between text-sm text-teal-200 mb-2">
              <span>Progress Hafalan Total</span>
              <span className="font-bold text-white">{totalProgress}%</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${totalProgress}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full"
              />
            </div>
            <p className="text-teal-200 text-xs mt-1">{memorizedCount} juz hafal dari 30 juz</p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Juz Grid */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Peta Hafalan Al-Quran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {juzList.reverse().map((juz, index) => (
                  <motion.div
                    key={juz.number}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                    className={`
                      aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer
                      transition-all duration-200 hover:scale-105 text-xs font-semibold
                      ${juz.memorized
                        ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/30'
                        : juz.inProgress
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-400/30'
                          : 'bg-muted text-muted-foreground hover:bg-teal-50 dark:hover:bg-teal-950/20'
                      }
                    `}
                  >
                    <span className="text-xs opacity-70">Juz</span>
                    <span className="text-base font-bold">{juz.number}</span>
                    {juz.memorized && <CheckCircle2 className="w-3 h-3 mt-0.5" />}
                    {juz.inProgress && <span className="text-xs opacity-80">{juz.percentage}%</span>}
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-4 mt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-gradient-to-br from-teal-500 to-emerald-600" /> Hafal</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-gradient-to-br from-amber-400 to-orange-500" /> Sedang Hafal</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-muted" /> Belum</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revision Schedule */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Jadwal Muraja'ah Minggu Ini</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {revisionSchedule.map(({ day, juz, status, date }) => (
                <div
                  key={day}
                  className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                    status === 'today'
                      ? 'bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800'
                      : status === 'done'
                        ? 'bg-muted'
                        : 'hover:bg-muted/50'
                  }`}
                >
                  <div className={`shrink-0 ${status === 'done' ? 'text-teal-500' : status === 'today' ? 'text-teal-600' : 'text-muted-foreground/30'}`}>
                    {status === 'done' ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${status === 'today' ? 'text-teal-700 dark:text-teal-400' : 'text-foreground'}`}>{juz}</p>
                    <p className="text-xs text-muted-foreground">{day}</p>
                  </div>
                  {status === 'today' && <Badge className="text-xs shrink-0">Hari ini</Badge>}
                  {status !== 'today' && <span className="text-xs text-muted-foreground shrink-0">{date}</span>}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Ayat Hafalan Hari Ini</p>
              <p className="text-amber-500 font-arabic arabic-text text-lg leading-relaxed mb-2">
                قُلْ هُوَ اللَّهُ أَحَدٌ
              </p>
              <p className="text-xs text-muted-foreground italic">QS. Al-Ikhlas: 1 — Muraja'ah Juz 30</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
