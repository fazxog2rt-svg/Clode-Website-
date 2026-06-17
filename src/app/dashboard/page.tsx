'use client'

import { motion } from 'framer-motion'
import { TrendingUp, BookOpen, Users, Flame, Star, CheckCircle2, Circle, ArrowRight, Sparkles, Calendar, Trophy } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'

const stats = [
  { icon: Flame, label: 'Streak Aktif', value: '14 Hari', change: '+2 dari minggu lalu', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20' },
  { icon: CheckCircle2, label: 'Ibadah Hari Ini', value: '6/7', change: '86% selesai', color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/20' },
  { icon: Trophy, label: 'Total Badge', value: '12 Badge', change: '+3 bulan ini', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20' },
  { icon: Star, label: 'Level Kamu', value: 'Level 3', change: 'Consistent Muslimah', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/20' },
]

const todayHabits = [
  { icon: '🕌', label: 'Shalat 5 Waktu', completed: true, detail: '4/5 selesai' },
  { icon: '📖', label: 'Tilawah Qur\'an', completed: true, detail: '3 halaman' },
  { icon: '📿', label: 'Dzikir Pagi', completed: true, detail: 'Selesai' },
  { icon: '💝', label: 'Sedekah', completed: true, detail: 'Rp 5.000' },
  { icon: '🌙', label: 'Puasa Sunnah', completed: false, detail: 'Belum' },
  { icon: '🧕', label: 'Menjaga Hijab', completed: true, detail: 'Sempurna' },
  { icon: '💫', label: 'Menjaga Akhlak', completed: true, detail: 'Baik' },
]

const recentActivities = [
  { icon: '📖', text: 'Menyelesaikan artikel "Keutamaan Shalat Tahajjud"', time: '1 jam lalu', color: 'text-teal-600' },
  { icon: '💬', text: 'Berkomentar di forum diskusi Aqidah', time: '3 jam lalu', color: 'text-blue-600' },
  { icon: '🏆', text: 'Meraih badge "7 Hari Streak"', time: 'Kemarin', color: 'text-amber-600' },
  { icon: '🤝', text: 'Terhubung dengan Sahabat Hijrah baru', time: '2 hari lalu', color: 'text-purple-600' },
]

const upcomingEvents = [
  { title: 'Kajian Fiqih Wanita', time: 'Hari ini, 20:00', type: 'Online', attendees: 124 },
  { title: 'Workshop Tahsin', time: 'Sabtu, 09:00', type: 'Offline', attendees: 38 },
  { title: 'Webinar Parenting Islami', time: 'Ahad, 14:00', type: 'Online', attendees: 289 },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function DashboardPage() {
  const completedCount = todayHabits.filter(h => h.completed).length
  const progress = Math.round((completedCount / todayHabits.length) * 100)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-7xl"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="relative bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-700 rounded-3xl p-6 overflow-hidden"
      >
        <div className="absolute inset-0 islamic-pattern opacity-10" />
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-teal-200 text-sm mb-1">Assalamu'alaikum 🌙</p>
            <h1 className="text-2xl font-bold text-white mb-1">Aisyah Nurfadillah</h1>
            <div className="flex items-center gap-2">
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">⭐ Consistent Muslimah</Badge>
              <Badge className="bg-amber-500/30 text-amber-200 border-amber-400/30">🔥 14 Hari Streak</Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-teal-200 text-sm mb-2">Progress Hari Ini</p>
            <div className="text-4xl font-bold text-white">{progress}%</div>
            <p className="text-teal-200 text-xs">{completedCount}/{todayHabits.length} ibadah selesai</p>
          </div>
        </div>

        {/* Daily verse */}
        <div className="relative z-10 mt-4 bg-white/10 rounded-2xl p-4 border border-white/20">
          <p className="text-teal-200 text-xs font-semibold mb-1">✨ Ayat Hari Ini</p>
          <p className="text-amber-200 font-arabic arabic-text text-lg leading-relaxed">وَاللَّهُ يُحِبُّ الصَّابِرِينَ</p>
          <p className="text-white/80 text-xs italic mt-1">"Dan Allah mencintai orang-orang yang sabar." — QS. Ali Imran: 146</p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, change, color, bg }) => (
          <Card key={label} className="card-hover">
            <CardContent className="p-5">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div className="text-2xl font-bold text-foreground mb-0.5">{value}</div>
              <div className="text-sm font-medium text-foreground mb-1">{label}</div>
              <div className="text-xs text-muted-foreground">{change}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Habit Tracker */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Tracker Ibadah Hari Ini</CardTitle>
                <Link href="/dashboard/tracker">
                  <Button variant="ghost" size="sm" className="gap-1 text-teal-600">
                    Lihat Detail <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
              <Progress value={progress} className="mt-2" />
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {todayHabits.map((habit) => (
                  <div
                    key={habit.label}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      habit.completed
                        ? 'bg-teal-50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800'
                        : 'bg-muted/50 border border-transparent'
                    }`}
                  >
                    <span className="text-xl">{habit.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${habit.completed ? 'text-teal-700 dark:text-teal-400' : 'text-foreground'}`}>
                        {habit.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{habit.detail}</p>
                    </div>
                    {habit.completed
                      ? <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                      : <Circle className="w-5 h-5 text-muted-foreground/40 shrink-0" />
                    }
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right column */}
        <div className="space-y-4">
          {/* AI Companion quick */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">AI Muslimah Companion</p>
                    <p className="text-xs text-muted-foreground">Siap membantu kamu</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                  "MasyaAllah, streak 14 harimu luar biasa! Bagaimana kalau hari ini kita coba tambahkan shalat dhuha?"
                </p>
                <Link href="/dashboard/ai">
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">Chat Sekarang</Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-bold">Kajian Mendatang</CardTitle>
                  <Link href="/dashboard/events">
                    <Button variant="ghost" size="sm" className="text-xs text-teal-600 h-7 px-2">Semua</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.title} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.time}</p>
                    </div>
                    <Badge variant={event.type === 'Online' ? 'emerald' : 'default'} className="text-xs shrink-0">{event.type}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 py-2 border-b border-border last:border-0">
                  <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-lg shrink-0">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{activity.text}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
