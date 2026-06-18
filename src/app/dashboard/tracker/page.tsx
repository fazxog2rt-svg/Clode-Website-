'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Flame, Trophy, TrendingUp, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth-context'
import { saveTrackerEntry, getTrackerEntry, TrackerEntry } from '@/lib/db'

const habits = [
  { id: 1, icon: '🕌', label: 'Shalat 5 Waktu', desc: 'Subuh, Dzuhur, Ashar, Maghrib, Isya', target: 5, completed: 4, streak: 14 },
  { id: 2, icon: '📖', label: 'Tilawah Qur\'an', desc: '1 lembar minimum per hari', target: 1, completed: 1, streak: 7, unit: 'halaman' },
  { id: 3, icon: '📿', label: 'Dzikir Pagi & Petang', desc: 'Dzikir setelah shalat Subuh & Ashar', target: 2, completed: 2, streak: 21 },
  { id: 4, icon: '💝', label: 'Sedekah', desc: 'Minimal satu kebaikan per hari', target: 1, completed: 1, streak: 5 },
  { id: 5, icon: '🌙', label: 'Puasa Sunnah', desc: 'Senin/Kamis atau puasa lainnya', target: 1, completed: 0, streak: 3 },
  { id: 6, icon: '🧕', label: 'Menjaga Hijab', desc: 'Sempurna menutup aurat', target: 1, completed: 1, streak: 30 },
  { id: 7, icon: '💫', label: 'Menjaga Akhlak', desc: 'Menjauhi ghibah dan perbuatan buruk', target: 1, completed: 1, streak: 12 },
]

const weeklyData = [
  { day: 'Sen', score: 95, date: '9' },
  { day: 'Sel', score: 85, date: '10' },
  { day: 'Rab', score: 100, date: '11' },
  { day: 'Kam', score: 75, date: '12' },
  { day: 'Jum', score: 90, date: '13' },
  { day: 'Sab', score: 80, date: '14' },
  { day: 'Ahd', score: 86, date: '15' },
]

const monthlyStats = {
  avgCompletion: 88,
  bestStreak: 30,
  totalCompleted: 187,
  daysActive: 26,
}

// Habit ID → Firestore habits key mapping (used inline in save/load logic)
// subuh=Shalat, quran=Tilawah, dzikir=Dzikir, sedekah=Sedekah
// maghrib=Puasa Sunnah, isya=Hijab, dzuhur=Akhlak (repurposed fields)

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

const LS_KEY = 'tracker_habits'

function loadFromLocalStorage(): number[] {
  if (typeof window === 'undefined') return [1, 2, 3, 4, 6, 7]
  try {
    const stored = localStorage.getItem(LS_KEY)
    if (stored) return JSON.parse(stored) as number[]
  } catch {
    // ignore
  }
  return [1, 2, 3, 4, 6, 7]
}

function saveToLocalStorage(ids: number[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(ids))
  } catch {
    // ignore
  }
}

export default function TrackerPage() {
  const { user } = useAuth()
  const [checkedHabits, setCheckedHabits] = useState<number[]>([1, 2, 3, 4, 6, 7])
  const [activeWeekDay, setActiveWeekDay] = useState(6)
  const [loadingHabits, setLoadingHabits] = useState(false)
  const [savedIndicator, setSavedIndicator] = useState(false)

  const todayDate = getTodayDate()

  // Load habits on mount
  useEffect(() => {
    if (user) {
      setLoadingHabits(true)
      getTrackerEntry(user.uid, todayDate)
        .then((entry) => {
          if (entry?.habits) {
            const h = entry.habits
            // Reconstruct checked IDs from the stored booleans (reverse of save mapping)
            const checked: number[] = []
            if (h.subuh)   checked.push(1) // Shalat
            if (h.quran)   checked.push(2) // Tilawah
            if (h.dzikir)  checked.push(3) // Dzikir
            if (h.sedekah) checked.push(4) // Sedekah
            if (h.maghrib) checked.push(5) // Puasa Sunnah
            if (h.isya)    checked.push(6) // Menjaga Hijab
            if (h.dzuhur)  checked.push(7) // Menjaga Akhlak
            setCheckedHabits(checked)
          }
        })
        .catch((err) => console.error('Failed to load tracker entry:', err))
        .finally(() => setLoadingHabits(false))
    } else {
      setCheckedHabits(loadFromLocalStorage())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const showSavedIndicator = useCallback(() => {
    setSavedIndicator(true)
    setTimeout(() => setSavedIndicator(false), 2000)
  }, [])

  const toggleHabit = async (id: number) => {
    const updatedHabits = checkedHabits.includes(id)
      ? checkedHabits.filter((h) => h !== id)
      : [...checkedHabits, id]

    setCheckedHabits(updatedHabits)

    if (user) {
      // Build a fully-typed TrackerEntry.habits object
      const habitsObj: TrackerEntry['habits'] = {
        subuh:   updatedHabits.includes(1),
        dzuhur:  updatedHabits.includes(7), // Menjaga Akhlak
        ashar:   false,
        maghrib: updatedHabits.includes(5), // Puasa Sunnah
        isya:    updatedHabits.includes(6), // Menjaga Hijab
        quran:   updatedHabits.includes(2),
        dzikir:  updatedHabits.includes(3),
        sedekah: updatedHabits.includes(4),
      }
      try {
        await saveTrackerEntry(user.uid, {
          date: todayDate,
          habits: habitsObj,
          updatedAt: null,
        })
        showSavedIndicator()
      } catch (err) {
        console.error('Failed to save tracker entry:', err)
      }
    } else {
      saveToLocalStorage(updatedHabits)
    }
  }

  const overallProgress = Math.round((checkedHabits.length / habits.length) * 100)

  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Hijrah Tracker</h1>
          <p className="text-muted-foreground">Pantau dan bangun kebiasaan ibadah harian kamu</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-orange-500/10 text-orange-600 border-orange-200 dark:border-orange-800 px-3 py-1.5">
            <Flame className="w-3.5 h-3.5 mr-1" /> 14 Hari Streak
          </Badge>
          {savedIndicator && (
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-teal-600 font-medium bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800 rounded-full px-3 py-1.5"
            >
              Tersimpan ✓
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp, label: 'Progress Hari Ini', value: `${overallProgress}%`, sub: `${checkedHabits.length}/${habits.length} selesai`, color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/20' },
          { icon: Flame, label: 'Streak Aktif', value: '14 Hari', sub: 'Terpanjang: 30 hari', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20' },
          { icon: Trophy, label: 'Skor Bulan Ini', value: '88%', sub: 'Rata-rata harian', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
          { icon: Calendar, label: 'Hari Aktif', value: '26/30', sub: 'Bulan Juni', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/20' },
        ].map(({ icon: Icon, label, value, sub, color, bg }) => (
          <motion.div key={label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-5">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <div className="text-sm font-medium text-foreground">{label}</div>
                <div className="text-xs text-muted-foreground">{sub}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">📅 Harian</TabsTrigger>
          <TabsTrigger value="weekly">📊 Mingguan</TabsTrigger>
          <TabsTrigger value="monthly">📈 Bulanan</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-6">
          {/* Overall progress */}
          <Card className="mb-4">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-bold text-foreground">Progress Ibadah Hari Ini</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-3xl font-bold text-teal-600">{overallProgress}%</div>
              </div>
              <Progress value={overallProgress} className="h-3 mb-2" />
              <p className="text-xs text-muted-foreground">{checkedHabits.length} dari {habits.length} ibadah selesai</p>
            </CardContent>
          </Card>

          {loadingHabits ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="space-y-3">
              {habits.map((habit, index) => {
                const isChecked = checkedHabits.includes(habit.id)
                return (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.06 }}
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${isChecked ? 'border-teal-300 dark:border-teal-700' : ''}`}
                      onClick={() => toggleHabit(habit.id)}
                    >
                      <CardContent className={`p-4 ${isChecked ? 'bg-teal-50/50 dark:bg-teal-950/10' : ''}`}>
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{habit.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className={`font-semibold ${isChecked ? 'text-teal-700 dark:text-teal-400' : 'text-foreground'}`}>{habit.label}</p>
                              {isChecked && <Badge variant="emerald" className="text-xs">✓ Selesai</Badge>}
                            </div>
                            <p className="text-xs text-muted-foreground">{habit.desc}</p>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="text-right">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Flame className="w-3 h-3 text-orange-400" />
                                <span>{habit.streak} hari</span>
                              </div>
                            </div>
                            {isChecked
                              ? <CheckCircle2 className="w-7 h-7 text-teal-500" />
                              : <Circle className="w-7 h-7 text-muted-foreground/30" />
                            }
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="weekly" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mingguan: 9-15 Juni 2025</CardTitle>
                <div className="flex gap-1">
                  <button className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-teal-50 transition-colors">
                    <ChevronLeft className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center hover:bg-teal-50 transition-colors">
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 mb-6">
                {weeklyData.map((day, index) => (
                  <div
                    key={day.day}
                    onClick={() => setActiveWeekDay(index)}
                    className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl cursor-pointer transition-all ${
                      activeWeekDay === index ? 'bg-teal-600 text-white' : 'bg-muted hover:bg-teal-50 dark:hover:bg-teal-950/20'
                    }`}
                  >
                    <span className={`text-xs font-medium ${activeWeekDay === index ? 'text-teal-100' : 'text-muted-foreground'}`}>{day.day}</span>
                    <div className={`text-xl font-bold ${activeWeekDay === index ? 'text-white' : 'text-foreground'}`}>{day.date}</div>
                    <div className={`text-sm font-semibold ${activeWeekDay === index ? 'text-teal-100' : day.score >= 90 ? 'text-teal-600' : day.score >= 70 ? 'text-amber-500' : 'text-muted-foreground'}`}>
                      {day.score}%
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Rata-rata Mingguan', value: `${Math.round(weeklyData.reduce((a, b) => a + b.score, 0) / weeklyData.length)}%` },
                  { label: 'Hari Terbaik', value: 'Rabu 11' },
                  { label: 'Total Selesai', value: '42/49' },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center bg-muted rounded-xl p-3">
                    <div className="text-lg font-bold text-teal-600">{value}</div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Rata-rata Harian', value: `${monthlyStats.avgCompletion}%`, icon: '📊' },
              { label: 'Streak Terpanjang', value: `${monthlyStats.bestStreak} Hari`, icon: '🔥' },
              { label: 'Total Ibadah Selesai', value: monthlyStats.totalCompleted.toString(), icon: '✅' },
              { label: 'Hari Aktif', value: `${monthlyStats.daysActive}/30`, icon: '📅' },
            ].map(({ label, value, icon }) => (
              <Card key={label}>
                <CardContent className="p-5 text-center">
                  <div className="text-3xl mb-2">{icon}</div>
                  <div className="text-2xl font-bold text-teal-600">{value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardHeader><CardTitle>Kemajuan Per Ibadah (Juni 2025)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {habits.map((habit) => {
                const pct = Math.round(Math.random() * 30 + 70)
                return (
                  <div key={habit.id}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-foreground flex items-center gap-2"><span>{habit.icon}</span> {habit.label}</span>
                      <span className="text-sm font-bold text-teal-600">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
