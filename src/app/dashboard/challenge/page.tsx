'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Users, Flame, CheckCircle2, Star, Crown, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth-context'
import {
  enrollChallenge as firestoreEnrollChallenge,
  markChallengeDay as firestoreMarkChallengeDay,
  getChallenges,
  ChallengeProgress,
} from '@/lib/db'

interface Challenge {
  id: number
  title: string
  icon: string
  desc: string
  difficulty: string
  participants: number
  color: string
  days: number
  reward: string
}

const challenges: Challenge[] = [
  { id: 1, title: '30 Hari Shalat Tahajud', icon: '🌙', desc: 'Bangun setiap malam untuk tahajud minimal 2 rakaat', difficulty: 'Menengah', participants: 2341, color: 'from-indigo-500 to-purple-600', days: 30, reward: 'Badge Qiyamul Lail' },
  { id: 2, title: 'Dzikir Pagi & Petang', icon: '🌅', desc: 'Konsisten membaca dzikir pagi petang setiap hari', difficulty: 'Pemula', participants: 5621, color: 'from-amber-400 to-orange-500', days: 30, reward: 'Badge Dzakirin' },
  { id: 3, title: 'Khatam Quran 30 Hari', icon: '📖', desc: 'Baca 1 juz per hari selama sebulan penuh', difficulty: 'Menengah', participants: 3210, color: 'from-teal-400 to-emerald-600', days: 30, reward: 'Badge Hafidzah Pemula' },
  { id: 4, title: 'Sedekah Setiap Hari', icon: '💝', desc: 'Sisihkan sedekah setiap hari meskipun sedikit', difficulty: 'Pemula', participants: 4102, color: 'from-pink-400 to-rose-500', days: 30, reward: 'Badge Dermawan' },
  { id: 5, title: 'Puasa Sunnah Senin-Kamis', icon: '⭐', desc: 'Puasa sunnah setiap Senin dan Kamis', difficulty: 'Menengah', participants: 1876, color: 'from-yellow-400 to-amber-500', days: 30, reward: 'Badge Shiyam Sunnah' },
  { id: 6, title: 'Shalat Dhuha 7 Hari', icon: '☀️', desc: 'Shalat dhuha minimal 2 rakaat setiap pagi', difficulty: 'Pemula', participants: 6234, color: 'from-orange-400 to-red-500', days: 7, reward: 'Badge Awwabiin' },
]

const leaderboard = [
  { rank: 1, name: 'Ummu Salamah', points: 9850, streak: 28, initials: 'US' },
  { rank: 2, name: 'Fatimah Az-Z.', points: 9210, streak: 25, initials: 'FA' },
  { rank: 3, name: 'Khadijah M.', points: 8760, streak: 22, initials: 'KM' },
  { rank: 4, name: 'Zainab A.', points: 8120, streak: 20, initials: 'ZA' },
  { rank: 5, name: 'Maryam S.', points: 7890, streak: 18, initials: 'MS' },
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getTodayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function getTodayDate() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function ChallengePage() {
  const { user } = useAuth()

  // Local state (used as fallback when not logged in)
  const [enrolled, setEnrolled] = useState<number[]>([])
  const [completions, setCompletions] = useState<Record<string, boolean>>({})
  const [celebrated, setCelebrated] = useState<number | null>(null)

  // Firestore data
  const [firestoreData, setFirestoreData] = useState<ChallengeProgress[]>([])
  const [loadingFirestore, setLoadingFirestore] = useState(false)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  // Load from Firestore when logged in, localStorage otherwise
  const loadFirestoreData = useCallback(async () => {
    if (!user) return
    setLoadingFirestore(true)
    try {
      const data = await getChallenges(user.uid)
      setFirestoreData(data)
      // Sync enrolled IDs from Firestore
      setEnrolled(data.filter(d => d.enrolled).map(d => d.challengeId))
    } catch (err) {
      console.error('Failed to load challenges:', err)
    } finally {
      setLoadingFirestore(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadFirestoreData()
    } else {
      // localStorage fallback
      if (typeof window !== 'undefined') {
        const e = localStorage.getItem('challenge_enrolled')
        const c = localStorage.getItem('challenge_completions')
        if (e) setEnrolled(JSON.parse(e))
        if (c) setCompletions(JSON.parse(c))
      }
    }
  }, [user, loadFirestoreData])

  // ── localStorage helpers (used only when NOT logged in) ──────────────────────

  function saveEnrolledLocal(next: number[]) {
    setEnrolled(next)
    if (typeof window !== 'undefined') localStorage.setItem('challenge_enrolled', JSON.stringify(next))
  }

  function saveCompletionsLocal(next: Record<string, boolean>) {
    setCompletions(next)
    if (typeof window !== 'undefined') localStorage.setItem('challenge_completions', JSON.stringify(next))
  }

  // ── Actions ──────────────────────────────────────────────────────────────────

  async function handleEnrollChallenge(challenge: Challenge) {
    if (enrolled.includes(challenge.id)) return

    if (user) {
      setActionLoading(challenge.id)
      try {
        await firestoreEnrollChallenge(user.uid, challenge.id, challenge.title)
        await loadFirestoreData()
      } catch (err) {
        console.error('Failed to enroll challenge:', err)
      } finally {
        setActionLoading(null)
      }
    } else {
      saveEnrolledLocal([...enrolled, challenge.id])
    }
  }

  async function markToday(challengeId: number) {
    if (user) {
      setActionLoading(challengeId)
      try {
        const todayDate = getTodayDate()
        await firestoreMarkChallengeDay(user.uid, challengeId, todayDate, true)
        await loadFirestoreData()
        setCelebrated(challengeId)
        setTimeout(() => setCelebrated(null), 1500)
      } catch (err) {
        console.error('Failed to mark challenge day:', err)
      } finally {
        setActionLoading(null)
      }
    } else {
      const key = `${challengeId}_${getTodayKey()}`
      const next = { ...completions, [key]: true }
      saveCompletionsLocal(next)
      setCelebrated(challengeId)
      setTimeout(() => setCelebrated(null), 1500)
    }
  }

  // ── Derived helpers ───────────────────────────────────────────────────────────

  // Get completions for a challenge — from Firestore data or localStorage
  function getCompletionsForChallenge(challengeId: number): Record<string, boolean> {
    if (user) {
      const entry = firestoreData.find(d => d.challengeId === challengeId)
      return entry?.completions || {}
    }
    // localStorage completions are stored with legacy key: `{id}_{yyyy-m-d}`
    const result: Record<string, boolean> = {}
    Object.keys(completions).forEach(k => {
      if (k.startsWith(`${challengeId}_`)) {
        result[k] = completions[k]
      }
    })
    return result
  }

  function getStreakCount(challengeId: number): number {
    const today = new Date()
    let streak = 0

    if (user) {
      const entry = firestoreData.find(d => d.challengeId === challengeId)
      const done = entry?.completions || {}
      for (let i = 0; i < 30; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() - i)
        const yyyy = d.getFullYear()
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const dd = String(d.getDate()).padStart(2, '0')
        const dateKey = `${yyyy}-${mm}-${dd}`
        if (done[dateKey]) streak++
        else if (i > 0) break
      }
    } else {
      for (let i = 0; i < 30; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() - i)
        const key = `${challengeId}_${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        if (completions[key]) streak++
        else if (i > 0) break
      }
    }
    return streak
  }

  function getMonthCompletions(challengeId: number): boolean[] {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const totalDays = getDaysInMonth(year, month)

    if (user) {
      const entry = firestoreData.find(d => d.challengeId === challengeId)
      const done = entry?.completions || {}
      return Array.from({ length: totalDays }, (_, i) => {
        const mm = String(month + 1).padStart(2, '0')
        const dd = String(i + 1).padStart(2, '0')
        return !!done[`${year}-${mm}-${dd}`]
      })
    }

    return Array.from({ length: totalDays }, (_, i) => {
      const key = `${challengeId}_${year}-${month}-${i + 1}`
      return !!completions[key]
    })
  }

  function getProgress(challengeId: number, totalDays: number): number {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    let done = 0

    if (user) {
      const entry = firestoreData.find(d => d.challengeId === challengeId)
      const c = entry?.completions || {}
      for (let i = 1; i <= totalDays; i++) {
        const mm = String(month + 1).padStart(2, '0')
        const dd = String(i).padStart(2, '0')
        if (c[`${year}-${mm}-${dd}`]) done++
      }
    } else {
      for (let i = 1; i <= totalDays; i++) {
        if (completions[`${challengeId}_${year}-${month}-${i}`]) done++
      }
    }
    return Math.round((done / totalDays) * 100)
  }

  function isDoneToday(challengeId: number): boolean {
    if (user) {
      const entry = firestoreData.find(d => d.challengeId === challengeId)
      const done = entry?.completions || {}
      return !!done[getTodayDate()]
    }
    return !!completions[`${challengeId}_${getTodayKey()}`]
  }

  const totalParticipants = challenges.reduce((s, c) => s + c.participants, 0)

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 max-w-7xl">
      {/* Header */}
      <motion.div variants={itemVariants} className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-6 overflow-hidden">
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-6 h-6 text-amber-300" />
            <h1 className="text-2xl font-bold text-white">Challenge Islami</h1>
          </div>
          <p className="text-indigo-200 text-sm mb-4">Tantang dirimu, tingkatkan ibadah, raih reward!</p>
          <div className="flex gap-4 flex-wrap">
            <div className="bg-white/15 rounded-2xl px-4 py-2 text-center">
              <div className="text-xl font-bold text-white">{enrolled.length}</div>
              <div className="text-indigo-200 text-xs">Challenge Aktif</div>
            </div>
            <div className="bg-white/15 rounded-2xl px-4 py-2 text-center">
              <div className="text-xl font-bold text-white">{(totalParticipants / 1000).toFixed(1)}K</div>
              <div className="text-indigo-200 text-xs">Peserta Total</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="all">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">Semua Challenge</TabsTrigger>
            <TabsTrigger value="mine">Challenge Saya ({enrolled.length})</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          {/* All Challenges */}
          <TabsContent value="all">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {challenges.map((c) => {
                const isEnrolled = enrolled.includes(c.id)
                const progress = isEnrolled ? getProgress(c.id, c.days) : 0
                const isLoading = actionLoading === c.id
                return (
                  <motion.div key={c.id} whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <Card className="overflow-hidden h-full flex flex-col">
                      <div className={`h-2 bg-gradient-to-r ${c.color}`} />
                      <CardContent className="p-5 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <span className="text-3xl">{c.icon}</span>
                          <Badge
                            className={c.difficulty === 'Pemula'
                              ? 'bg-emerald-100 text-emerald-700 border-0'
                              : 'bg-amber-100 text-amber-700 border-0'}
                          >
                            {c.difficulty}
                          </Badge>
                        </div>
                        <h3 className="font-bold text-foreground mb-1">{c.title}</h3>
                        <p className="text-xs text-muted-foreground mb-3 flex-1">{c.desc}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {c.participants.toLocaleString()}</span>
                          <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> {c.days} Hari</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-amber-600 mb-3">
                          <Trophy className="w-3.5 h-3.5" />
                          <span>{c.reward}</span>
                        </div>
                        {isEnrolled ? (
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-teal-600 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Sedang Berjalan</span>
                              <span className="text-muted-foreground">{progress}%</span>
                            </div>
                            <Progress value={progress} />
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            className="w-full"
                            disabled={isLoading || loadingFirestore}
                            onClick={() => handleEnrollChallenge(c)}
                          >
                            {isLoading ? 'Mendaftar...' : 'Ikut Challenge'}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </TabsContent>

          {/* My Challenges */}
          <TabsContent value="mine">
            <div className="mt-4 space-y-6">
              {loadingFirestore ? (
                <Card>
                  <CardContent className="p-10 text-center">
                    <p className="text-muted-foreground text-sm">Memuat challenge...</p>
                  </CardContent>
                </Card>
              ) : enrolled.length === 0 ? (
                <Card>
                  <CardContent className="p-10 text-center">
                    <div className="text-5xl mb-4">🎯</div>
                    <h3 className="font-bold text-foreground mb-1">Belum ada challenge aktif</h3>
                    <p className="text-muted-foreground text-sm">Yuk pilih challenge di tab "Semua Challenge"!</p>
                  </CardContent>
                </Card>
              ) : (
                enrolled.map((id) => {
                  const c = challenges.find(ch => ch.id === id)!
                  const monthDone = getMonthCompletions(id)
                  const streak = getStreakCount(id)
                  const progress = getProgress(id, c.days)
                  const doneToday = isDoneToday(id)
                  const today = new Date()
                  const isLoading = actionLoading === id

                  return (
                    <Card key={id} className="overflow-hidden">
                      <div className={`h-1.5 bg-gradient-to-r ${c.color}`} />
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{c.icon}</span>
                            <div>
                              <h3 className="font-bold text-foreground">{c.title}</h3>
                              <p className="text-xs text-muted-foreground">{c.reward}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-orange-500 font-bold">
                              <Flame className="w-4 h-4" />
                              <span>{streak} hari</span>
                            </div>
                            <p className="text-xs text-muted-foreground">streak</p>
                          </div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-muted-foreground mb-2">
                            {today.toLocaleString('id-ID', { month: 'long', year: 'numeric' })}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {monthDone.map((done, dayIdx) => {
                              const isToday = dayIdx + 1 === today.getDate()
                              return (
                                <motion.div
                                  key={dayIdx}
                                  animate={done ? { scale: [1, 1.3, 1] } : {}}
                                  transition={{ duration: 0.3 }}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all
                                    ${done ? 'bg-emerald-500 text-white' : isToday ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-400' : 'bg-muted text-muted-foreground'}`}
                                >
                                  {dayIdx + 1}
                                </motion.div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-muted-foreground">Progress {c.days} hari</span>
                          <span className="font-semibold text-foreground">{progress}%</span>
                        </div>
                        <Progress value={progress} className="mb-4" />

                        {/* Mark today button */}
                        <AnimatePresence>
                          {celebrated === id && (
                            <motion.div
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1.1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              className="text-center text-2xl mb-2"
                            >
                              🎉 MasyaAllah! Kamu keren!
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {doneToday ? (
                          <Button size="sm" variant="outline" className="w-full text-emerald-600 border-emerald-300" disabled>
                            <CheckCircle2 className="w-4 h-4 mr-1" /> Sudah Ditandai Hari Ini ✓
                          </Button>
                        ) : (
                          <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              className="w-full bg-emerald-600 hover:bg-emerald-700"
                              disabled={isLoading}
                              onClick={() => markToday(id)}
                            >
                              {isLoading ? 'Menyimpan...' : 'Tandai Hari Ini ✓'}
                            </Button>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent value="leaderboard">
            <div className="mt-4 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-500" /> Top Muslimah Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-3">
                  {leaderboard.map((lbUser) => (
                    <motion.div
                      key={lbUser.rank}
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-4 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                        ${lbUser.rank === 1 ? 'bg-amber-400 text-white' : lbUser.rank === 2 ? 'bg-slate-300 text-slate-700' : lbUser.rank === 3 ? 'bg-orange-300 text-white' : 'bg-muted text-muted-foreground'}`}>
                        {lbUser.rank === 1 ? '👑' : lbUser.rank}
                      </div>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {lbUser.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{lbUser.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-500" /> {lbUser.streak} hari streak
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">{lbUser.points.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">poin</p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Current user */}
                  <div className="border-t border-dashed border-border pt-3">
                    <div className="flex items-center gap-4 p-3 rounded-xl bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800">
                      <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">6</div>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        AN
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-teal-700">Kamu (Aisyah N.)</p>
                        <div className="mt-1">
                          <div className="flex items-center justify-between text-xs mb-0.5">
                            <span className="text-muted-foreground">ke rank 5</span>
                            <span className="text-teal-600">6,450/7,890 poin</span>
                          </div>
                          <Progress value={Math.round(6450 / 7890 * 100)} className="h-1.5" />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-teal-700">6,450</p>
                        <p className="text-xs text-muted-foreground">poin</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-5 h-5 text-teal-600" />
                    <h3 className="font-semibold text-foreground">Cara Mendapat Poin</h3>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Tandai hari selesai = +50 poin</div>
                    <div className="flex items-center gap-2"><Flame className="w-4 h-4 text-orange-500" /> Bonus streak 7 hari = +200 poin</div>
                    <div className="flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500" /> Selesaikan challenge = +500 poin</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  )
}
