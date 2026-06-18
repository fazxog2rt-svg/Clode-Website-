'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, RefreshCw, Compass, Plus, RotateCcw, Clock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface PrayerTimings {
  Fajr: string
  Dhuhr: string
  Asr: string
  Maghrib: string
  Isha: string
}

interface HijriDate {
  date: string
  format: string
  day: string
  weekday: { en: string; ar: string }
  month: { number: number; en: string; ar: string }
  year: string
}

interface ApiData {
  timings: PrayerTimings
  date: {
    readable: string
    hijri: HijriDate
  }
  meta: {
    qiblaDirection: number
    timezone: string
    latitude: number
    longitude: number
  }
}

const PRAYER_NAMES: { key: keyof PrayerTimings; id: string; en: string; icon: string }[] = [
  { key: 'Fajr', id: 'Subuh', en: 'Fajr', icon: '🌙' },
  { key: 'Dhuhr', id: 'Dzuhur', en: 'Dhuhr', icon: '☀️' },
  { key: 'Asr', id: 'Ashar', en: 'Asr', icon: '🌤️' },
  { key: 'Maghrib', id: 'Maghrib', en: 'Maghrib', icon: '🌅' },
  { key: 'Isha', id: 'Isya', en: 'Isha', icon: '🌙' },
]

function parseTime(timeStr: string): Date {
  const [hours, minutes] = timeStr.replace(/\s*(AM|PM)/i, '').split(':').map(Number)
  const now = new Date()
  const result = new Date(now)
  result.setHours(hours, minutes, 0, 0)
  return result
}

function findNextPrayer(timings: PrayerTimings): string {
  const now = new Date()
  for (const prayer of PRAYER_NAMES) {
    const prayerTime = parseTime(timings[prayer.key])
    if (prayerTime > now) return prayer.key
  }
  return 'Fajr'
}

function formatTime(timeStr: string): string {
  return timeStr.replace(/\s*(AM|PM)/i, '').substring(0, 5)
}

export default function PrayerPage() {
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [apiData, setApiData] = useState<ApiData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [permissionState, setPermissionState] = useState<'idle' | 'denied'>('idle')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [tasbihCount, setTasbihCount] = useState(0)
  const TASBIH_TARGET = 33

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchPrayerTimes = useCallback(async (lat: number, lon: number) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=11`
      )
      if (!res.ok) throw new Error('Failed to fetch prayer times')
      const json = await res.json()
      setApiData(json.data)
    } catch (e) {
      setError('Gagal mengambil jadwal shalat. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }, [])

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation tidak didukung browser ini.')
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setLocation({ lat: latitude, lon: longitude })
        fetchPrayerTimes(latitude, longitude)
      },
      () => {
        setPermissionState('denied')
        setLoading(false)
        setError('Izin lokasi ditolak.')
      }
    )
  }

  const nextPrayer = apiData ? findNextPrayer(apiData.timings) : null

  const timeDisplay = currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateDisplay = currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-950 via-teal-900 to-emerald-900 p-4 md:p-8 relative overflow-hidden">
      {/* Islamic geometric background */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <polygon points="30,0 60,15 60,45 30,60 0,45 0,15" fill="none" stroke="white" strokeWidth="1"/>
              <polygon points="30,10 50,20 50,40 30,50 10,40 10,20" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic)"/>
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Jadwal Shalat</h1>
          <p className="text-teal-300">Waktu shalat berdasarkan lokasi Anda</p>
        </motion.div>

        {/* Current Time Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-white/10 border-white/20 backdrop-blur-md mb-6">
            <CardContent className="p-6 text-center">
              <div className="text-5xl font-bold text-white mb-1 font-mono">{timeDisplay}</div>
              <div className="text-teal-300 text-sm">{dateDisplay}</div>
              {apiData && (
                <div className="text-teal-200 text-sm mt-1">
                  {apiData.date.hijri.day} {apiData.date.hijri.month.ar} {apiData.date.hijri.year} H
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Location Button */}
        {!location && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <Card className="bg-white/10 border-white/20 backdrop-blur-md">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-teal-300" />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">Izinkan Akses Lokasi</h3>
                <p className="text-teal-300 text-sm mb-4">Kami memerlukan lokasi Anda untuk menampilkan jadwal shalat yang akurat</p>
                <Button onClick={requestLocation} className="bg-teal-500 hover:bg-teal-400 text-white">
                  <MapPin className="w-4 h-4 mr-2" />
                  Deteksi Lokasi
                </Button>
                {permissionState === 'denied' && (
                  <p className="text-red-400 text-sm mt-2">Izin lokasi ditolak. Aktifkan di pengaturan browser.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-white/10 rounded-2xl animate-pulse" />
            ))}
          </motion.div>
        )}

        {/* Error State */}
        {error && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <Card className="bg-red-500/20 border-red-400/30">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-300">{error}</p>
                <Button size="sm" onClick={requestLocation} className="ml-auto bg-red-500/30 hover:bg-red-500/50 text-white border-0">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Prayer Times */}
        {apiData && !loading && (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3 mb-6">
              {PRAYER_NAMES.map((prayer, i) => {
                const isNext = nextPrayer === prayer.key
                return (
                  <motion.div
                    key={prayer.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Card className={`border transition-all ${isNext ? 'bg-teal-500/30 border-teal-400/50 shadow-lg shadow-teal-500/20' : 'bg-white/10 border-white/20 backdrop-blur-md'}`}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isNext && (
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-400"></span>
                            </span>
                          )}
                          <span className="text-xl">{prayer.icon}</span>
                          <div>
                            <div className="font-semibold text-white">{prayer.id}</div>
                            <div className="text-teal-300 text-xs">{prayer.en}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {isNext && <Badge className="bg-teal-500/50 text-teal-100 border-teal-400/30 text-xs">Selanjutnya</Badge>}
                          <div className="text-white font-mono text-lg font-semibold">
                            {formatTime(apiData.timings[prayer.key])}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Bottom Row: Qibla + Tasbih */}
        {apiData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Qibla Direction */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="bg-white/10 border-white/20 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Compass className="w-5 h-5 text-teal-400" />
                    Arah Kiblat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="relative w-24 h-24">
                      <div className="w-24 h-24 rounded-full border-2 border-teal-400/30 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: apiData.meta.qiblaDirection }}
                          transition={{ duration: 1, type: 'spring' }}
                          className="w-1 h-10 bg-gradient-to-b from-teal-400 to-transparent rounded-full origin-bottom"
                          style={{ transformOrigin: 'bottom center', position: 'absolute', bottom: '50%', left: '50%', marginLeft: '-2px' }}
                        />
                        <div className="w-2 h-2 bg-teal-400 rounded-full z-10" />
                      </div>
                    </div>
                    <div className="ml-4 text-center">
                      <div className="text-3xl font-bold text-white">{Math.round(apiData.meta.qiblaDirection)}°</div>
                      <div className="text-teal-300 text-sm">dari Utara</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tasbih Counter */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card className="bg-white/10 border-white/20 backdrop-blur-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-teal-400" />
                    Tasbih Digital
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-1">
                      {tasbihCount % TASBIH_TARGET === 0 && tasbihCount > 0 ? TASBIH_TARGET : tasbihCount % TASBIH_TARGET}
                      <span className="text-teal-400 text-lg">/{TASBIH_TARGET}</span>
                    </div>
                    <div className="text-teal-300 text-sm mb-3">Putaran: {Math.floor(tasbihCount / TASBIH_TARGET)}</div>
                    <div className="flex gap-2 justify-center">
                      <Button
                        onClick={() => setTasbihCount(c => c + 1)}
                        className="bg-teal-500 hover:bg-teal-400 text-white px-8"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Tasbih
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setTasbihCount(0)}
                        className="border-teal-400/30 text-teal-300 hover:bg-teal-500/20"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
