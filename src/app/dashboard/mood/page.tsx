'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, BookOpen, Sparkles, Save, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/auth-context'
import { saveMoodEntry, getMoodHistory } from '@/lib/db'

type MoodKey = 'mantap' | 'baik' | 'biasa' | 'kurang' | 'berjuang'

interface MoodOption {
  key: MoodKey
  emoji: string
  label: string
  score: number
  message: string
  color: string
}

const moodOptions: MoodOption[] = [
  { key: 'mantap', emoji: '😌', label: 'Alhamdulillah, mantap', score: 5, message: 'MasyaAllah! Pertahankan semangat ini. Yuk tambah amalan sunnah hari ini!', color: 'bg-emerald-100 border-emerald-400 text-emerald-700' },
  { key: 'baik', emoji: '😊', label: 'Cukup baik', score: 4, message: 'Alhamdulillah. Konsistensi adalah kunci istiqomah.', color: 'bg-teal-100 border-teal-400 text-teal-700' },
  { key: 'biasa', emoji: '😐', label: 'Biasa saja', score: 3, message: 'Normal ya ukhti. Coba baca Al-Quran 5-10 menit untuk refresh hati.', color: 'bg-blue-100 border-blue-400 text-blue-700' },
  { key: 'kurang', emoji: '😔', label: 'Kurang bersemangat', score: 2, message: 'Hati yang lelah perlu istirahat. Yuk muhasabah sejenak.', color: 'bg-amber-100 border-amber-400 text-amber-700' },
  { key: 'berjuang', emoji: '😢', label: 'Sedang berjuang', score: 1, message: 'Innalillahi... Allah tidak membebani seseorang melebihi kesanggupannya. Kamu tidak sendirian.', color: 'bg-purple-100 border-purple-400 text-purple-700' },
]

const quotes = [
  { text: 'Sesungguhnya bersama kesulitan ada kemudahan', ref: 'QS Al-Insyirah: 6' },
  { text: 'Allah tidak membebani seseorang melainkan sesuai kesanggupannya', ref: 'QS Al-Baqarah: 286' },
  { text: 'Dan cukuplah Allah sebagai penolong', ref: 'QS An-Nisa: 132' },
  { text: 'Barang siapa bertakwa kepada Allah, maka Dia akan memberinya jalan keluar', ref: 'QS At-Talaq: 2' },
  { text: 'Sesungguhnya shalat mencegah dari perbuatan keji dan munkar', ref: 'QS Al-Ankabut: 45' },
  { text: 'Ingatlah, hanya dengan mengingat Allah hati menjadi tenteram', ref: 'QS Ar-Ra\'d: 28' },
  { text: 'Dan apabila hamba-hamba-Ku bertanya kepadamu tentang Aku, maka sesungguhnya Aku dekat', ref: 'QS Al-Baqarah: 186' },
  { text: 'Janganlah kamu berputus asa dari rahmat Allah', ref: 'QS Az-Zumar: 53' },
  { text: 'Dan Allah bersama orang-orang yang sabar', ref: 'QS Al-Baqarah: 153' },
  { text: 'Maka nikmat Tuhan kamu yang manakah yang kamu dustakan?', ref: 'QS Ar-Rahman: 13' },
]

const dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

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

function getLast7Days(): { key: string; label: string; isoDate: string }[] {
  const result = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    result.push({
      key: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
      label: dayLabels[d.getDay()],
      isoDate: `${yyyy}-${mm}-${dd}`,
    })
  }
  return result
}

function getDailyQuotes(count: number): typeof quotes {
  const d = new Date()
  const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate()
  const result = []
  let s = seed
  const used = new Set<number>()
  while (result.length < count) {
    s = (s * 1664525 + 1013904223) & 0xffffffff
    const idx = Math.abs(s) % quotes.length
    if (!used.has(idx)) {
      used.add(idx)
      result.push(quotes[idx])
    }
  }
  return result
}

export default function MoodPage() {
  const { user } = useAuth()
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null)
  const [moodNote, setMoodNote] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  // moodHistory: keyed by the legacy key (yyyy-m-d) for bar chart lookup
  const [moodHistory, setMoodHistory] = useState<Record<string, number>>({})
  const [muhasabah, setMuhasabah] = useState({ q1: '', q2: '', q3: '' })
  const [muhasabahSaved, setMuhasabahSaved] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)

  const dailyQuotes = getDailyQuotes(3)
  const last7Days = getLast7Days()

  // Load mood history from Firestore (logged in) or localStorage (fallback)
  useEffect(() => {
    if (user) {
      setHistoryLoading(true)
      getMoodHistory(user.uid, 7)
        .then((entries) => {
          const history: Record<string, number> = {}
          entries.forEach((entry) => {
            // Convert ISO date (yyyy-mm-dd) to legacy key (yyyy-m-d) for bar chart
            const parts = entry.date.split('-')
            if (parts.length === 3) {
              const legacyKey = `${parseInt(parts[0])}-${parseInt(parts[1]) - 1}-${parseInt(parts[2])}`
              history[legacyKey] = entry.score
            }
          })
          setMoodHistory(history)
        })
        .catch((err) => {
          console.error('Failed to load mood history:', err)
        })
        .finally(() => setHistoryLoading(false))
    } else {
      // localStorage fallback for non-logged-in users
      if (typeof window !== 'undefined') {
        const h = localStorage.getItem('mood_history')
        const m = localStorage.getItem('mood_muhasabah')
        const todaySaved = localStorage.getItem('mood_today_saved')
        if (h) setMoodHistory(JSON.parse(h))
        if (m) setMuhasabah(JSON.parse(m))
        if (todaySaved) {
          const { mood, note } = JSON.parse(todaySaved)
          setSelectedMood(mood)
          setMoodNote(note)
          setSaved(true)
        }
      }
    }
  }, [user])

  // Load muhasabah from localStorage always (no Firestore collection for it)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const m = localStorage.getItem('mood_muhasabah')
      if (m) setMuhasabah(JSON.parse(m))
    }
  }, [])

  async function saveMood() {
    if (!selectedMood) return
    const option = moodOptions.find(o => o.key === selectedMood)!
    setSaving(true)
    setSaveError(null)

    if (user) {
      try {
        const today = getTodayDate()
        await saveMoodEntry(user.uid, {
          date: today,
          score: option.score,
          label: option.label,
          note: moodNote,
          createdAt: null,
        })
        // Update local bar chart state using legacy key
        const legacyKey = getTodayKey()
        setMoodHistory(prev => ({ ...prev, [legacyKey]: option.score }))
        setSaved(true)
      } catch (err) {
        console.error('Failed to save mood entry:', err)
        setSaveError('Gagal menyimpan. Coba lagi.')
      }
    } else {
      // localStorage fallback
      const legacyKey = getTodayKey()
      const next = { ...moodHistory, [legacyKey]: option.score }
      setMoodHistory(next)
      setSaved(true)
      if (typeof window !== 'undefined') {
        localStorage.setItem('mood_history', JSON.stringify(next))
        localStorage.setItem('mood_today_saved', JSON.stringify({ mood: selectedMood, note: moodNote }))
      }
    }

    setSaving(false)
  }

  function saveMuhasabah() {
    if (typeof window !== 'undefined') localStorage.setItem('mood_muhasabah', JSON.stringify(muhasabah))
    setMuhasabahSaved(true)
    setTimeout(() => setMuhasabahSaved(false), 2500)
  }

  const selectedOption = moodOptions.find(o => o.key === selectedMood)

  const barColors = ['bg-red-400', 'bg-amber-400', 'bg-blue-400', 'bg-teal-400', 'bg-emerald-500']

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 max-w-4xl">
      {/* Header */}
      <motion.div variants={itemVariants} className="relative bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 rounded-3xl p-6 overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Spiritual Mood</h1>
            <p className="text-pink-200 text-sm">Check-in hati & ibadahmu hari ini</p>
          </div>
        </div>
      </motion.div>

      {/* Login notice */}
      {!user && (
        <motion.div variants={itemVariants}>
          <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
            Login untuk menyimpan riwayat mood
          </div>
        </motion.div>
      )}

      {/* Daily Check-in */}
      <motion.div variants={itemVariants}>
        <Card className="border-pink-100 dark:border-pink-900/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-foreground">Bagaimana kondisi iman & hatimu hari ini?</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-3 mb-5">
              {moodOptions.map((option) => (
                <motion.button
                  key={option.key}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  animate={selectedMood === option.key ? { scale: 1.12 } : { scale: 1 }}
                  onClick={() => { setSelectedMood(option.key); setSaved(false); setSaveError(null) }}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all min-w-[80px]
                    ${selectedMood === option.key
                      ? `${option.color} shadow-md ring-2 ring-offset-1 ring-pink-300`
                      : 'border-border bg-muted/30 hover:bg-muted/60'
                    }`}
                >
                  <span className="text-3xl">{option.emoji}</span>
                  <span className="text-xs font-medium text-center leading-tight">{option.label}</span>
                </motion.button>
              ))}
            </div>

            <AnimatePresence>
              {selectedOption && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <div className={`rounded-2xl p-4 border-2 ${selectedOption.color} mb-4`}>
                    <p className="text-sm font-medium leading-relaxed">{selectedOption.message}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {selectedMood && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Apa yang mempengaruhi hatimu hari ini? <span className="text-muted-foreground">(opsional)</span>
                </label>
                <textarea
                  value={moodNote}
                  onChange={e => setMoodNote(e.target.value)}
                  placeholder="Ceritakan sedikit tentang perasaanmu..."
                  rows={3}
                  className="w-full rounded-xl border border-border bg-background text-foreground text-sm px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
                />
                <div className="mt-3 flex items-center gap-3">
                  {!saved ? (
                    <Button onClick={saveMood} disabled={saving} className="bg-pink-600 hover:bg-pink-700">
                      <Save className="w-4 h-4 mr-1" /> {saving ? 'Menyimpan...' : 'Simpan Check-in'}
                    </Button>
                  ) : (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex items-center gap-2 text-emerald-600 font-semibold text-sm"
                    >
                      {user ? '✅ Check-in tersimpan! 💚' : '✅ Check-in tersimpan! JazakAllahu khairan.'}
                    </motion.div>
                  )}
                  {saveError && (
                    <span className="text-sm text-red-500">{saveError}</span>
                  )}
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Grafik Spiritual */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              Grafik Spiritual 7 Hari Terakhir
              {historyLoading && <span className="text-sm font-normal text-muted-foreground ml-2">Memuat...</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-end gap-3 h-32">
              {last7Days.map(({ key, label }) => {
                const score = moodHistory[key] || 0
                const heightPct = score > 0 ? (score / 5) * 100 : 8
                const colorClass = score > 0 ? barColors[score - 1] : 'bg-muted'
                return (
                  <div key={key} className="flex-1 flex flex-col items-center gap-1">
                    <div className="flex-1 flex items-end w-full">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className={`w-full rounded-t-lg ${colorClass} transition-all`}
                        style={{ minHeight: '8px' }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{label}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
              {[
                { color: 'bg-red-400', label: 'Berjuang' },
                { color: 'bg-amber-400', label: 'Kurang' },
                { color: 'bg-blue-400', label: 'Biasa' },
                { color: 'bg-teal-400', label: 'Baik' },
                { color: 'bg-emerald-500', label: 'Mantap' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-3 h-3 rounded-sm ${color}`} />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Inspirasi Harian */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-foreground">Inspirasi Harian</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {dailyQuotes.map((q, i) => {
            const gradients = [
              'from-pink-400 to-rose-500',
              'from-purple-400 to-indigo-500',
              'from-teal-400 to-emerald-500',
            ]
            return (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                className={`min-w-[260px] bg-gradient-to-br ${gradients[i]} rounded-2xl p-5 text-white flex-shrink-0`}
              >
                <p className="text-sm leading-relaxed font-medium mb-3 italic">"{q.text}"</p>
                <p className="text-xs text-white/70 font-semibold">— {q.ref}</p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <Separator />

      {/* Muhasabah Mingguan */}
      <motion.div variants={itemVariants}>
        <Card className="border-purple-100 dark:border-purple-900/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-500" />
              Muhasabah Mingguan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {[
              { key: 'q1' as const, label: 'Amalan apa yang paling konsisten kamu lakukan minggu ini?', placeholder: 'Misal: shalat tepat waktu, membaca Al-Quran...' },
              { key: 'q2' as const, label: 'Apa yang ingin kamu perbaiki minggu depan?', placeholder: 'Misal: lebih disiplin dzikir pagi, kurangi distraksi...' },
              { key: 'q3' as const, label: 'Satu hal yang paling kamu syukuri minggu ini?', placeholder: 'Misal: kesehatan, keluarga, kemudahan rezeki...' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
                <textarea
                  value={muhasabah[key]}
                  onChange={e => setMuhasabah(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  rows={2}
                  className="w-full rounded-xl border border-border bg-background text-foreground text-sm px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                />
              </div>
            ))}

            <div className="flex items-center gap-3">
              <Button onClick={saveMuhasabah} className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 mr-1" /> Simpan Muhasabah
              </Button>
              <AnimatePresence>
                {muhasabahSaved && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-emerald-600 font-semibold"
                  >
                    ✅ Tersimpan!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
