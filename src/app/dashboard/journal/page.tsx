'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PenLine, Plus, Lock, Smile, Meh, Frown, Heart, Star, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const moods = [
  { icon: '😊', label: 'Senang', color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-950/20', border: 'border-yellow-200 dark:border-yellow-800' },
  { icon: '😌', label: 'Tenang', color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-950/20', border: 'border-teal-200 dark:border-teal-800' },
  { icon: '🤲', label: 'Bersyukur', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20', border: 'border-emerald-200 dark:border-emerald-800' },
  { icon: '😔', label: 'Sedih', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-200 dark:border-blue-800' },
  { icon: '😤', label: 'Frustasi', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/20', border: 'border-orange-200 dark:border-orange-800' },
  { icon: '🌸', label: 'Damai', color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/20', border: 'border-pink-200 dark:border-pink-800' },
]

const journalEntries = [
  {
    id: 1,
    date: 'Selasa, 17 Juni 2025',
    mood: '🤲',
    moodLabel: 'Bersyukur',
    title: 'Hari yang Penuh Berkah',
    preview: 'Alhamdulillah hari ini terasa ringan. Berhasil bangun untuk shalat Tahajjud dan dzikir pagi...',
    gratitude: ['Kesehatan yang diberikan Allah', 'Keluarga yang sayang', 'Rezeki yang cukup'],
    evaluation: 4,
  },
  {
    id: 2,
    date: 'Senin, 16 Juni 2025',
    mood: '😌',
    moodLabel: 'Tenang',
    title: 'Refleksi Perjalanan Hijrah',
    preview: 'Hari ini saya menghabiskan waktu untuk muhasabah diri. Banyak hal yang perlu diperbaiki...',
    gratitude: ['Dapat belajar ilmu baru', 'Sahabat yang mendukung'],
    evaluation: 3,
  },
  {
    id: 3,
    date: 'Ahad, 15 Juni 2025',
    mood: '😊',
    moodLabel: 'Senang',
    title: 'Pencapaian Kecil yang Berarti',
    preview: 'Alhamdulillah berhasil khatam membaca satu juz hari ini. Rasanya ada kepuasan tersendiri...',
    gratitude: ['Bisa tilawah 1 juz', 'Cuaca yang bagus', 'Masakan ibu yang enak'],
    evaluation: 5,
  },
]

export default function JournalPage() {
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [journalText, setJournalText] = useState('')
  const [gratitude, setGratitude] = useState(['', '', ''])
  const [evaluation, setEvaluation] = useState(0)

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Muslimah Journal</h1>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Lock className="w-3.5 h-3.5" />
            <span>Jurnal pribadi yang aman & privat — hanya kamu yang bisa membaca</span>
          </div>
        </div>
        <Button onClick={() => setShowNewEntry(!showNewEntry)} className="gap-2">
          <Plus className="w-4 h-4" /> Tulis Jurnal Hari Ini
        </Button>
      </motion.div>

      {/* New Entry Form */}
      <AnimatePresence>
        {showNewEntry && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="border-teal-200 dark:border-teal-800">
              <CardContent className="p-6 space-y-5">
                <div className="flex items-center gap-2">
                  <PenLine className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-foreground">Jurnal Baru — Selasa, 17 Juni 2025</h3>
                </div>

                {/* Mood */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Bagaimana perasaanmu hari ini?</p>
                  <div className="flex gap-2 flex-wrap">
                    {moods.map(mood => (
                      <button
                        key={mood.label}
                        onClick={() => setSelectedMood(mood.label)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                          selectedMood === mood.label
                            ? `${mood.bg} ${mood.border}`
                            : 'bg-muted border-transparent hover:border-border'
                        }`}
                      >
                        <span>{mood.icon}</span>
                        <span className={selectedMood === mood.label ? mood.color : 'text-muted-foreground'}>{mood.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Gratitude */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">3 Hal yang Aku Syukuri Hari Ini ✨</p>
                  <div className="space-y-2">
                    {gratitude.map((g, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <span className="text-teal-500 text-sm shrink-0">{i + 1}.</span>
                        <input
                          value={g}
                          onChange={e => setGratitude(prev => { const n = [...prev]; n[i] = e.target.value; return n })}
                          placeholder={`Rasa syukur ke-${i + 1}...`}
                          className="flex-1 px-3 py-2 rounded-xl bg-muted text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Journal Text */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Catatan Refleksi Harian</p>
                  <textarea
                    value={journalText}
                    onChange={e => setJournalText(e.target.value)}
                    placeholder="Tuliskan refleksi, pikiran, doa, dan perasaanmu hari ini... Ini adalah ruang pribadimu."
                    className="w-full h-36 resize-none rounded-xl bg-muted p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  />
                </div>

                {/* Self Evaluation */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-2">Evaluasi Diri Hari Ini</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(score => (
                      <button
                        key={score}
                        onClick={() => setEvaluation(score)}
                        className={`w-10 h-10 rounded-xl border text-lg transition-all ${
                          evaluation >= score
                            ? 'bg-amber-50 border-amber-300 dark:bg-amber-950/20 dark:border-amber-700'
                            : 'bg-muted border-transparent'
                        }`}
                      >
                        ⭐
                      </button>
                    ))}
                    {evaluation > 0 && <span className="ml-2 text-sm text-muted-foreground self-center">{evaluation}/5</span>}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1">Simpan Jurnal</Button>
                  <Button variant="outline" onClick={() => setShowNewEntry(false)}>Batal</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="entries">
        <TabsList>
          <TabsTrigger value="entries">📝 Entri Jurnal</TabsTrigger>
          <TabsTrigger value="mood">😊 Mood Tracker</TabsTrigger>
          <TabsTrigger value="gratitude">🌟 Syukur</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="mt-6 space-y-4">
          {journalEntries.map((entry, index) => (
            <motion.div key={entry.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
              <Card className="card-hover cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl">{entry.mood}</div>
                      <div>
                        <p className="text-xs text-muted-foreground">{entry.date}</p>
                        <Badge variant="emerald" className="text-xs mt-0.5">{entry.moodLabel}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < entry.evaluation ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} />
                      ))}
                    </div>
                  </div>
                  <h3 className="font-bold text-foreground mb-2">{entry.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{entry.preview}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {entry.gratitude.map((g, i) => (
                      <span key={i} className="flex items-center gap-1 text-xs text-teal-600 bg-teal-50 dark:bg-teal-950/20 rounded-full px-2.5 py-0.5">
                        <Heart className="w-2.5 h-2.5 fill-teal-500" /> {g}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="mood" className="mt-6">
          <Card>
            <CardHeader><CardTitle>Mood 7 Hari Terakhir</CardTitle></CardHeader>
            <CardContent>
              <div className="flex gap-3">
                {[
                  { day: 'Sen', mood: '😊' }, { day: 'Sel', mood: '🤲' }, { day: 'Rab', mood: '😌' },
                  { day: 'Kam', mood: '😔' }, { day: 'Jum', mood: '🌸' }, { day: 'Sab', mood: '😊' }, { day: 'Ahd', mood: '🤲' },
                ].map(({ day, mood }) => (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1.5 p-3 bg-muted rounded-2xl">
                    <span className="text-xs text-muted-foreground">{day}</span>
                    <span className="text-2xl">{mood}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gratitude" className="mt-6">
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🌟</div>
            <h3 className="font-bold text-foreground mb-2">Jurnal Syukur</h3>
            <p className="text-muted-foreground text-sm mb-4">Kumpulan hal-hal yang kamu syukuri setiap hari</p>
            <p className="text-xs text-muted-foreground">Mulai tulis jurnal untuk melihat koleksi syukur kamu</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
