'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, CheckCircle2, Circle, BookOpen, Heart, Star, Clock, MapPin, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// ─── Countdown to next Ramadhan ───────────────────────────────────────────────
function getNextRamadhanDate(): Date {
  // Approximate Ramadhan 1447H = ~March 1, 2026
  // Approximate Ramadhan 1448H = ~February 18, 2027
  const candidates = [
    new Date('2026-03-01'),
    new Date('2027-02-18'),
    new Date('2028-02-08'),
  ]
  const now = new Date()
  for (const d of candidates) {
    if (d > now) return d
  }
  return candidates[candidates.length - 1]
}

function getCountdown(target: Date): { days: number; hours: number; minutes: number; seconds: number } {
  const diff = Math.max(0, target.getTime() - new Date().getTime())
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  return { days, hours, minutes, seconds }
}

// ─── Amalan checklist items ───────────────────────────────────────────────────
const CHECKLIST_ITEMS = [
  { id: 'sahur', label: 'Sahur', icon: '🌙' },
  { id: 'subuh', label: 'Shalat Subuh', icon: '🕌' },
  { id: 'quran', label: 'Baca Quran', icon: '📖' },
  { id: 'dzuhur', label: 'Shalat Dzuhur', icon: '☀️' },
  { id: 'ashar', label: 'Shalat Ashar', icon: '🌤️' },
  { id: 'maghrib', label: 'Shalat Maghrib + Buka', icon: '🌅' },
  { id: 'isya', label: 'Shalat Isya', icon: '🌃' },
  { id: 'tarawih', label: 'Shalat Tarawih', icon: '✨' },
  { id: 'witir', label: 'Witir', icon: '⭐' },
  { id: 'sedekah', label: 'Sedekah hari ini', icon: '💝' },
]

// ─── Tips ─────────────────────────────────────────────────────────────────────
const TIPS = [
  { title: 'Perbanyak Sedekah', desc: 'Rasulullah SAW adalah orang yang paling dermawan, terutama di bulan Ramadhan.', icon: '💝' },
  { title: 'Tadarus Al-Quran', desc: 'Jadikan Ramadhan sebagai bulan Al-Quran. Target khatam minimal sekali.', icon: '📖' },
  { title: "I'tikaf 10 Hari Terakhir", desc: "Manfaatkan 10 hari terakhir Ramadhan untuk i'tikaf mencari Lailatul Qadar.", icon: '🕌' },
  { title: 'Lailatul Qadar', desc: 'Carilah Lailatul Qadar di malam-malam ganjil pada 10 hari terakhir Ramadhan.', icon: '⭐' },
]

// ─── Doa & Niat ───────────────────────────────────────────────────────────────
const DOA_BUKA = {
  arabic: 'اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ',
  latin: "Allahumma laka shumtu wa bika aamantu wa 'alaa rizqika aftartu",
  terjemahan: 'Ya Allah, karena-Mu aku berpuasa, kepada-Mu aku beriman, dan dengan rezeki-Mu aku berbuka.',
}

const NIAT_PUASA = {
  arabic: 'نَوَيْتُ صَوْمَ غَدٍ عَنْ أَدَاءِ فَرْضِ شَهْرِ رَمَضَانَ هَذِهِ السَّنَةِ لِلَّهِ تَعَالَى',
  latin: "Nawaitu shauma ghadin 'an adaa'i fardhi syahri ramadhana haadzihis sanati lillaahi ta'aalaa",
  terjemahan: 'Saya niat berpuasa esok hari untuk menunaikan kewajiban bulan Ramadhan tahun ini karena Allah Ta\'ala.',
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function RamadhanPage() {
  const ramadhanDate = getNextRamadhanDate()
  const [countdown, setCountdown] = useState(getCountdown(ramadhanDate))
  const [juzDone, setJuzDone] = useState<number[]>([])
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})
  const [todayKey] = useState(() => new Date().toISOString().split('T')[0])
  const [imsakiyah, setImsakiyah] = useState<{ sahur: string; iftar: string } | null>(null)
  const [locationLoading, setLocationLoading] = useState(false)

  // Load data from localStorage
  useEffect(() => {
    const savedJuz = localStorage.getItem('ramadhan-juz')
    if (savedJuz) setJuzDone(JSON.parse(savedJuz))

    const savedChecklist = localStorage.getItem(`ramadhan-checklist-${todayKey}`)
    if (savedChecklist) setChecklist(JSON.parse(savedChecklist))
  }, [todayKey])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => setCountdown(getCountdown(ramadhanDate)), 1000)
    return () => clearInterval(timer)
  }, [ramadhanDate])

  const toggleJuz = (juz: number) => {
    const updated = juzDone.includes(juz) ? juzDone.filter(j => j !== juz) : [...juzDone, juz]
    setJuzDone(updated)
    localStorage.setItem('ramadhan-juz', JSON.stringify(updated))
  }

  const toggleChecklist = (id: string) => {
    const updated = { ...checklist, [id]: !checklist[id] }
    setChecklist(updated)
    localStorage.setItem(`ramadhan-checklist-${todayKey}`, JSON.stringify(updated))
  }

  const fetchImsakiyah = useCallback(() => {
    if (!navigator.geolocation) {
      setImsakiyah({ sahur: '04:35', iftar: '17:58' })
      return
    }
    setLocationLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://api.aladhan.com/v1/timings?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&method=11`
          )
          const json = await res.json()
          const { Fajr, Maghrib } = json.data.timings
          const fmt = (t: string) => t.replace(/\s*(AM|PM)/i, '').substring(0, 5)
          setImsakiyah({ sahur: fmt(Fajr), iftar: fmt(Maghrib) })
        } catch {
          setImsakiyah({ sahur: '04:35', iftar: '17:58' })
        } finally {
          setLocationLoading(false)
        }
      },
      () => {
        setImsakiyah({ sahur: '04:35', iftar: '17:58' })
        setLocationLoading(false)
      }
    )
  }, [])

  const completedCount = CHECKLIST_ITEMS.filter(item => checklist[item.id]).length
  const juzProgress = (juzDone.length / 30) * 100

  const isRamadhanSoon = countdown.days <= 30

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-amber-900 p-4 md:p-8 relative overflow-hidden">
      {/* Crescent moon decoration */}
      <div className="absolute top-6 right-8 opacity-10">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M90 60C90 76.5685 76.5685 90 60 90C43.4315 90 30 76.5685 30 60C30 43.4315 43.4315 30 60 30C52 38 48 48 48 60C48 72 52 82 60 90C76.5685 90 90 76.5685 90 60Z" fill="white"/>
          <circle cx="85" cy="35" r="5" fill="white"/>
          <circle cx="95" cy="25" r="3" fill="white"/>
          <circle cx="75" cy="20" r="4" fill="white"/>
        </svg>
      </div>
      <div className="absolute bottom-20 left-6 opacity-5">
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <path d="M60 40C60 51 51 60 40 60C29 60 20 51 20 40C20 29 29 20 40 20C34 26 32 32 32 40C32 48 34 54 40 60C51 60 60 51 60 40Z" fill="white"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-4xl font-bold text-amber-100 mb-1">Ramadhan</h1>
          <p className="text-amber-400">مَرْحَبًا يَا رَمَضَان</p>
        </motion.div>

        {/* Countdown Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-amber-600/30 to-orange-600/30 border-amber-500/30 backdrop-blur-md">
            <CardHeader className="pb-2 text-center">
              <CardTitle className="text-amber-100 flex items-center justify-center gap-2">
                <Moon className="w-5 h-5" />
                {isRamadhanSoon ? 'Ramadhan Sebentar Lagi!' : 'Hitung Mundur Ramadhan'}
              </CardTitle>
              <CardDescription className="text-amber-400">
                ~{ramadhanDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3 text-center">
                {[
                  { value: countdown.days, label: 'Hari' },
                  { value: countdown.hours, label: 'Jam' },
                  { value: countdown.minutes, label: 'Menit' },
                  { value: countdown.seconds, label: 'Detik' },
                ].map(({ value, label }) => (
                  <div key={label} className="bg-amber-900/40 rounded-2xl p-3">
                    <motion.div
                      key={value}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl md:text-4xl font-bold text-white font-mono"
                    >
                      {String(value).padStart(2, '0')}
                    </motion.div>
                    <div className="text-amber-400 text-xs mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Imsakiyah */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="bg-white/10 border-amber-500/20 backdrop-blur-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Imsakiyah Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              {imsakiyah ? (
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-indigo-900/40 rounded-2xl p-4">
                    <Moon className="w-6 h-6 text-indigo-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold font-mono text-white">{imsakiyah.sahur}</div>
                    <div className="text-indigo-300 text-sm">Imsak / Sahur</div>
                  </div>
                  <div className="bg-orange-900/40 rounded-2xl p-4">
                    <Sun className="w-6 h-6 text-orange-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold font-mono text-white">{imsakiyah.iftar}</div>
                    <div className="text-orange-300 text-sm">Buka Puasa / Maghrib</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-amber-400 text-sm mb-3">
                    {locationLoading ? 'Mengambil data...' : 'Izinkan lokasi atau gunakan waktu default Jakarta'}
                  </p>
                  <Button
                    onClick={fetchImsakiyah}
                    disabled={locationLoading}
                    className="bg-amber-500 hover:bg-amber-400 text-white"
                  >
                    {locationLoading ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4 mr-2" />
                    )}
                    {locationLoading ? 'Memuat...' : 'Dapatkan Waktu Shalat'}
                  </Button>
                  <button
                    onClick={() => setImsakiyah({ sahur: '04:35', iftar: '17:58' })}
                    className="block mt-2 mx-auto text-xs text-amber-500 underline"
                  >
                    Gunakan waktu default Jakarta
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Khatam Tracker */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="bg-white/10 border-amber-500/20 backdrop-blur-md h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-amber-100 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  Khatam Tracker
                </CardTitle>
                <CardDescription className="text-amber-400">
                  {juzDone.length}/30 Juz — {Math.round(juzProgress)}% selesai
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Progress value={juzProgress} className="h-2" />
                <div className="grid grid-cols-6 gap-1.5">
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(juz => (
                    <button
                      key={juz}
                      onClick={() => toggleJuz(juz)}
                      className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                        juzDone.includes(juz)
                          ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                          : 'bg-amber-900/30 text-amber-400 hover:bg-amber-800/40'
                      }`}
                    >
                      {juz}
                    </button>
                  ))}
                </div>
                {juzDone.length === 30 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center py-2">
                    <Badge className="bg-amber-500 text-white text-base px-4 py-1">🎉 Alhamdulillah Khatam!</Badge>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Daily Checklist */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="bg-white/10 border-amber-500/20 backdrop-blur-md h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-amber-100 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-amber-400" />
                  Amalan Harian
                </CardTitle>
                <CardDescription className="text-amber-400">
                  {completedCount}/{CHECKLIST_ITEMS.length} selesai hari ini
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={(completedCount / CHECKLIST_ITEMS.length) * 100} className="h-2 mb-3" />
                <div className="space-y-1">
                  {CHECKLIST_ITEMS.map(item => (
                    <button
                      key={item.id}
                      onClick={() => toggleChecklist(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all text-left ${
                        checklist[item.id]
                          ? 'bg-amber-500/20 text-amber-200'
                          : 'bg-amber-900/20 text-amber-400 hover:bg-amber-800/30'
                      }`}
                    >
                      {checklist[item.id] ? (
                        <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-amber-700 flex-shrink-0" />
                      )}
                      <span className="text-sm">{item.icon} {item.label}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Doa Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: 'Doa Buka Puasa', data: DOA_BUKA, icon: '🌅' },
            { title: 'Niat Puasa', data: NIAT_PUASA, icon: '🌙' },
          ].map(({ title, data, icon }) => (
            <motion.div key={title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-white/10 border-amber-500/20 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-amber-100 text-base">{icon} {title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-2xl text-amber-100 font-serif text-right leading-loose" dir="rtl" lang="ar">
                    {data.arabic}
                  </p>
                  <Separator className="bg-amber-700/30" />
                  <p className="text-amber-300 text-sm italic">{data.latin}</p>
                  <p className="text-amber-200 text-sm">{data.terjemahan}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tips */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h3 className="text-amber-200 font-semibold mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            Tips Ramadhan
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TIPS.map((tip, i) => (
              <motion.div key={tip.title} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.07 }}>
                <Card className="bg-white/10 border-amber-500/20 backdrop-blur-md hover:bg-white/15 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <span className="text-2xl flex-shrink-0">{tip.icon}</span>
                      <div>
                        <div className="font-semibold text-amber-100 text-sm mb-1">{tip.title}</div>
                        <p className="text-amber-400 text-xs leading-relaxed">{tip.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
