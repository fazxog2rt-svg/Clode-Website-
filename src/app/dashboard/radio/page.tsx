'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipBack, SkipForward, Volume2, Clock, Radio, Users, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

interface Station {
  id: number
  name: string
  type: string
  icon: string
  desc: string
  genre: string
  listeners: number
}

interface Track {
  title: string
  surah: string
  duration: string
}

const stations: Station[] = [
  { id: 1, name: 'Murottal Syeikh Mishary', type: 'murottal', icon: '📿', desc: 'Bacaan merdu Syeikh Mishary Rashid Al-Afasy', genre: 'Murottal', listeners: 1234 },
  { id: 2, name: 'Kajian Pagi Muslimah', type: 'kajian', icon: '🌅', desc: 'Kajian ringan untuk memulai hari dengan semangat', genre: 'Kajian', listeners: 892 },
  { id: 3, name: 'Murottal Syeikh Sudais', type: 'murottal', icon: '🕌', desc: 'Imam Masjidil Haram — bacaan yang menenangkan hati', genre: 'Murottal', listeners: 2103 },
  { id: 4, name: 'Nasyid Islami', type: 'nasyid', icon: '🎵', desc: 'Lagu-lagu islami yang menginspirasi', genre: 'Nasyid', listeners: 654 },
  { id: 5, name: 'Kajian Fiqih Wanita', type: 'kajian', icon: '📚', desc: 'Pembahasan fiqih khusus wanita sehari-hari', genre: 'Kajian', listeners: 445 },
  { id: 6, name: 'Murotal Quran 30 Juz', type: 'murottal', icon: '💚', desc: 'Tilawah lengkap 30 juz untuk menemani aktivitas', genre: 'Murottal', listeners: 3210 },
  { id: 7, name: 'Ceramah Motivasi Hijrah', type: 'ceramah', icon: '⭐', desc: 'Kisah-kisah inspiratif perjalanan hijrah Muslimah', genre: 'Ceramah', listeners: 1567 },
  { id: 8, name: 'Doa & Dzikir Harian', type: 'dzikir', icon: '🤲', desc: 'Dzikir pagi petang dan doa-doa pilihan', genre: 'Dzikir', listeners: 987 },
]

const nowPlayingTracks: Track[] = [
  { title: 'Surah Al-Fatihah', surah: 'Al-Fatihah', duration: '01:23' },
  { title: 'Surah Al-Baqarah (1-20)', surah: 'Al-Baqarah', duration: '08:45' },
  { title: 'Kajian: Adab Muslimah', surah: 'Episode 12', duration: '45:30' },
  { title: 'Surah Ar-Rahman', surah: 'Ar-Rahman', duration: '07:12' },
]

const filterTabs = ['Semua', 'Murottal', 'Kajian', 'Nasyid', 'Dzikir']
const timerOptions = [15, 30, 60]

const genreGradients: Record<string, string> = {
  murottal: 'from-teal-500 to-emerald-600',
  kajian: 'from-blue-500 to-indigo-600',
  nasyid: 'from-pink-500 to-rose-600',
  ceramah: 'from-amber-500 to-orange-600',
  dzikir: 'from-purple-500 to-indigo-600',
}

export default function RadioPage() {
  const [activeFilter, setActiveFilter] = useState('Semua')
  const [currentStation, setCurrentStation] = useState<Station>(stations[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0)
  const [progress, setProgress] = useState(23)
  const [volume, setVolume] = useState(75)
  const [sleepTimer, setSleepTimer] = useState<number | null>(null)
  const [recentlyPlayed, setRecentlyPlayed] = useState<Station[]>([stations[2], stations[5]])
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isPlaying) {
      progressRef.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            nextTrack()
            return 0
          }
          return p + 0.2
        })
      }, 200)
    } else {
      if (progressRef.current) clearInterval(progressRef.current)
    }
    return () => {
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [isPlaying, currentTrackIdx])

  function selectStation(s: Station) {
    if (s.id !== currentStation.id) {
      setCurrentStation(s)
      setProgress(0)
      setCurrentTrackIdx(0)
      setRecentlyPlayed(prev => [currentStation, ...prev.filter(r => r.id !== currentStation.id)].slice(0, 4))
    }
    setIsPlaying(true)
  }

  function nextTrack() {
    setCurrentTrackIdx(i => (i + 1) % nowPlayingTracks.length)
    setProgress(0)
  }

  function prevTrack() {
    setCurrentTrackIdx(i => (i - 1 + nowPlayingTracks.length) % nowPlayingTracks.length)
    setProgress(0)
  }

  const filteredStations = activeFilter === 'Semua'
    ? stations
    : stations.filter(s => s.genre === activeFilter || s.type === activeFilter.toLowerCase())

  const currentTrack = nowPlayingTracks[currentTrackIdx]
  const gradient = genreGradients[currentStation.type] || 'from-teal-500 to-emerald-600'

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
      <motion.div variants={itemVariants} className="relative bg-gradient-to-br from-slate-800 via-teal-900 to-emerald-900 rounded-3xl p-6 overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute left-1/2 -bottom-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/30 border border-teal-500/40 flex items-center justify-center">
            <Radio className="w-6 h-6 text-teal-300" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Muslimah Radio</h1>
            <p className="text-teal-300 text-sm">Murottal, Kajian & Nasyid Islami</p>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Station List — 3 cols */}
        <motion.div variants={itemVariants} className="lg:col-span-3 space-y-4">
          {/* Filter Tabs */}
          <div className="flex gap-2 flex-wrap">
            {filterTabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all
                  ${activeFilter === tab
                    ? 'bg-teal-700 text-white shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Station Cards */}
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filteredStations.map((station) => {
                const isActive = station.id === currentStation.id
                return (
                  <motion.button
                    key={station.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    whileHover={{ x: 4 }}
                    onClick={() => selectStation(station)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left
                      ${isActive
                        ? 'bg-teal-700 text-white shadow-lg shadow-teal-700/30'
                        : 'bg-card border border-border hover:border-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/20'
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0
                      ${isActive ? 'bg-white/20' : 'bg-muted'}`}>
                      {station.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold text-sm truncate ${isActive ? 'text-white' : 'text-foreground'}`}>
                          {station.name}
                        </p>
                        {isActive && isPlaying && (
                          <span className="flex gap-0.5 shrink-0">
                            {[1, 2, 3].map(i => (
                              <motion.span
                                key={i}
                                animate={{ scaleY: [0.4, 1, 0.4] }}
                                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                                className="w-0.5 h-3 bg-white rounded-full inline-block"
                              />
                            ))}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs truncate ${isActive ? 'text-teal-200' : 'text-muted-foreground'}`}>
                        {station.desc}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge className={isActive ? 'bg-white/20 text-white border-0' : ''} variant={isActive ? 'outline' : 'secondary'}>
                        {station.genre}
                      </Badge>
                      <p className={`text-xs mt-1 ${isActive ? 'text-teal-200' : 'text-muted-foreground'}`}>
                        <Users className="w-3 h-3 inline mr-0.5" />{station.listeners.toLocaleString()}
                      </p>
                    </div>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Now Playing + Controls — 2 cols */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          {/* Now Playing Panel */}
          <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 text-white overflow-hidden">
            <CardContent className="p-6">
              {/* Album Art */}
              <div className="flex justify-center mb-5">
                <motion.div
                  animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className={`w-32 h-32 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-5xl shadow-2xl`}
                >
                  {currentStation.icon}
                </motion.div>
              </div>

              {/* Station + Track Info */}
              <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-xs font-semibold">Sedang Diputar Live</span>
                </div>
                <h3 className="font-bold text-white text-lg truncate">{currentStation.name}</h3>
                <p className="text-slate-400 text-sm">{currentTrack.title}</p>
                <p className="text-slate-500 text-xs">{currentTrack.surah} • {currentTrack.duration}</p>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                  <span>{Math.floor(progress / 100 * 60).toString().padStart(2, '0')}:{Math.floor((progress / 100 * 60 % 1) * 60).toString().padStart(2, '0')}</span>
                  <span>{currentTrack.duration}</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mb-5">
                <button onClick={prevTrack} className="text-slate-400 hover:text-white transition-colors">
                  <SkipBack className="w-6 h-6" />
                </button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-xl`}
                >
                  {isPlaying
                    ? <Pause className="w-6 h-6 text-white" />
                    : <Play className="w-6 h-6 text-white ml-1" />
                  }
                </motion.button>
                <button onClick={nextTrack} className="text-slate-400 hover:text-white transition-colors">
                  <SkipForward className="w-6 h-6" />
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center gap-3">
                <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="flex-1 relative h-1.5 bg-slate-700 rounded-full">
                  <div
                    className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${volume}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={e => setVolume(Number(e.target.value))}
                    className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
                  />
                </div>
                <span className="text-xs text-slate-400 w-6 text-right">{volume}</span>
              </div>

              {/* Listener Count */}
              <div className="flex justify-center mt-4">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> {currentStation.listeners.toLocaleString()} sedang mendengarkan
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Sleep Timer */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-teal-600" />
                <h3 className="font-semibold text-foreground text-sm">Sleep Timer</h3>
                {sleepTimer !== null && (
                  <Badge variant="emerald" className="text-xs">{sleepTimer} mnt</Badge>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {timerOptions.map(min => (
                  <button
                    key={min}
                    onClick={() => setSleepTimer(sleepTimer === min ? null : min)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all
                      ${sleepTimer === min
                        ? 'bg-teal-700 text-white'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                  >
                    {min} mnt
                  </button>
                ))}
                <button
                  onClick={() => setSleepTimer(null)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all
                    ${sleepTimer === null
                      ? 'bg-slate-700 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                >
                  Off
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Recently Played */}
          {recentlyPlayed.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Baru Diputar</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {recentlyPlayed.map(s => (
                  <button
                    key={s.id}
                    onClick={() => selectStation(s)}
                    className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted/60 transition-colors text-left"
                  >
                    <span className="text-xl">{s.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.genre}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </motion.div>
  )
}
