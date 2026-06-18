'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Bookmark, BookmarkCheck, Search, ZoomIn, ZoomOut, Loader2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

// ─── Types ───────────────────────────────────────────────────────────────────
interface Ayah {
  number: number
  numberInSurah: number
  text: string
  translation: string
}

interface Surah {
  number: number
  name: string
  englishName: string
  numberOfAyahs: number
  revelationType: string
}

interface ApiSurahEdition {
  number: number
  name: string
  englishName: string
  numberOfAyahs: number
  revelationType: string
  ayahs: { number: number; numberInSurah: number; text: string }[]
}

// ─── Hardcoded surah list (first 20) ─────────────────────────────────────────
const SURAHS: Surah[] = [
  { number: 1, name: 'الفاتحة', englishName: 'Al-Fatihah', numberOfAyahs: 7, revelationType: 'Meccan' },
  { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', numberOfAyahs: 286, revelationType: 'Medinan' },
  { number: 3, name: 'آل عمران', englishName: 'Ali Imran', numberOfAyahs: 200, revelationType: 'Medinan' },
  { number: 4, name: 'النساء', englishName: 'An-Nisa', numberOfAyahs: 176, revelationType: 'Medinan' },
  { number: 5, name: 'المائدة', englishName: 'Al-Maidah', numberOfAyahs: 120, revelationType: 'Medinan' },
  { number: 6, name: 'الأنعام', englishName: 'Al-Anam', numberOfAyahs: 165, revelationType: 'Meccan' },
  { number: 7, name: 'الأعراف', englishName: 'Al-Araf', numberOfAyahs: 206, revelationType: 'Meccan' },
  { number: 8, name: 'الأنفال', englishName: 'Al-Anfal', numberOfAyahs: 75, revelationType: 'Medinan' },
  { number: 9, name: 'التوبة', englishName: 'At-Tawbah', numberOfAyahs: 129, revelationType: 'Medinan' },
  { number: 10, name: 'يونس', englishName: 'Yunus', numberOfAyahs: 109, revelationType: 'Meccan' },
  { number: 11, name: 'هود', englishName: 'Hud', numberOfAyahs: 123, revelationType: 'Meccan' },
  { number: 12, name: 'يوسف', englishName: 'Yusuf', numberOfAyahs: 111, revelationType: 'Meccan' },
  { number: 13, name: 'الرعد', englishName: 'Ar-Rad', numberOfAyahs: 43, revelationType: 'Medinan' },
  { number: 14, name: 'إبراهيم', englishName: 'Ibrahim', numberOfAyahs: 52, revelationType: 'Meccan' },
  { number: 15, name: 'الحجر', englishName: 'Al-Hijr', numberOfAyahs: 99, revelationType: 'Meccan' },
  { number: 16, name: 'النحل', englishName: 'An-Nahl', numberOfAyahs: 128, revelationType: 'Meccan' },
  { number: 17, name: 'الإسراء', englishName: 'Al-Isra', numberOfAyahs: 111, revelationType: 'Meccan' },
  { number: 18, name: 'الكهف', englishName: 'Al-Kahf', numberOfAyahs: 110, revelationType: 'Meccan' },
  { number: 19, name: 'مريم', englishName: 'Maryam', numberOfAyahs: 98, revelationType: 'Meccan' },
  { number: 20, name: 'طه', englishName: 'Taha', numberOfAyahs: 135, revelationType: 'Meccan' },
]

const FONT_SIZES = { small: 'text-2xl', medium: 'text-3xl', large: 'text-4xl' }
type FontSize = keyof typeof FONT_SIZES

// ─── Component ───────────────────────────────────────────────────────────────
export default function QuranReaderPage() {
  const [selectedSurah, setSelectedSurah] = useState<Surah>(SURAHS[0])
  const [ayahs, setAyahs] = useState<Ayah[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [bookmarks, setBookmarks] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [fontSize, setFontSize] = useState<FontSize>('medium')
  const [sidebarSearch, setSidebarSearch] = useState('')

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('quran-bookmarks')
    if (saved) setBookmarks(JSON.parse(saved))
  }, [])

  const saveBookmarks = (bm: string[]) => {
    setBookmarks(bm)
    localStorage.setItem('quran-bookmarks', JSON.stringify(bm))
  }

  const toggleBookmark = (key: string) => {
    const updated = bookmarks.includes(key)
      ? bookmarks.filter(b => b !== key)
      : [...bookmarks, key]
    saveBookmarks(updated)
  }

  const fetchSurah = useCallback(async (surah: Surah) => {
    setLoading(true)
    setError(null)
    setAyahs([])
    try {
      const res = await fetch(
        `https://api.alquran.cloud/v1/surah/${surah.number}/editions/quran-uthmani,id.indonesian`
      )
      if (!res.ok) throw new Error('Gagal mengambil data surah')
      const json = await res.json()
      const editions: ApiSurahEdition[] = json.data
      const arabicEdition = editions[0]
      const indonesianEdition = editions[1]
      const combined: Ayah[] = arabicEdition.ayahs.map((ayah, i) => ({
        number: ayah.number,
        numberInSurah: ayah.numberInSurah,
        text: ayah.text,
        translation: indonesianEdition.ayahs[i]?.text || '',
      }))
      setAyahs(combined)
    } catch {
      setError('Gagal memuat surah. Periksa koneksi internet Anda.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSurah(SURAHS[0])
  }, [fetchSurah])

  const handleSelectSurah = (surah: Surah) => {
    setSelectedSurah(surah)
    fetchSurah(surah)
    setSearchQuery('')
  }

  const filteredAyahs = ayahs.filter(
    a =>
      !searchQuery ||
      a.text.includes(searchQuery) ||
      a.translation.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredSurahs = SURAHS.filter(
    s =>
      !sidebarSearch ||
      s.englishName.toLowerCase().includes(sidebarSearch.toLowerCase()) ||
      s.name.includes(sidebarSearch) ||
      String(s.number).includes(sidebarSearch)
  )

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-stone-950 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-72 md:flex-shrink-0 bg-white dark:bg-stone-900 border-r border-amber-100 dark:border-stone-800 flex flex-col">
        <div className="p-4 border-b border-amber-100 dark:border-stone-800">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-amber-900 dark:text-amber-100">Daftar Surah</h2>
          </div>
          <Input
            placeholder="Cari surah..."
            value={sidebarSearch}
            onChange={e => setSidebarSearch(e.target.value)}
            className="border-amber-200 dark:border-stone-700 text-sm"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredSurahs.map(surah => (
            <button
              key={surah.number}
              onClick={() => handleSelectSurah(surah)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors border-b border-amber-50 dark:border-stone-800/50 hover:bg-amber-50 dark:hover:bg-stone-800 ${
                selectedSurah.number === surah.number ? 'bg-amber-100 dark:bg-amber-900/30' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-xs font-bold text-amber-700 dark:text-amber-400">
                  {surah.number}
                </div>
                <div>
                  <div className="text-sm font-semibold text-stone-800 dark:text-stone-200">{surah.englishName}</div>
                  <div className="text-xs text-stone-500 dark:text-stone-400">{surah.numberOfAyahs} ayat</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-arabic text-amber-700 dark:text-amber-400">{surah.name}</div>
                {selectedSurah.number === surah.number && <ChevronRight className="w-3 h-3 text-amber-500 ml-auto" />}
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="bg-white dark:bg-stone-900 border-b border-amber-100 dark:border-stone-800 px-4 md:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-100">Al-Quran Digital</h1>
              <p className="text-amber-600 dark:text-amber-400 text-sm arabic-text" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <Input
                  placeholder="Cari ayat..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 border-amber-200 dark:border-stone-700 w-48"
                />
              </div>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setFontSize(s => s === 'small' ? 'medium' : s === 'medium' ? 'large' : 'small')}
                className="border-amber-200 dark:border-stone-700"
                title="Ukuran font"
              >
                {fontSize === 'large' ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Surah header */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-4 md:px-8 py-6 text-center text-white">
          <div className="text-4xl font-bold mb-1" dir="rtl">{selectedSurah.name}</div>
          <div className="text-amber-100 text-lg">{selectedSurah.englishName}</div>
          <div className="flex justify-center gap-4 mt-2">
            <Badge className="bg-amber-700/50 text-amber-100 border-0">{selectedSurah.numberOfAyahs} Ayat</Badge>
            <Badge className="bg-amber-700/50 text-amber-100 border-0">{selectedSurah.revelationType}</Badge>
          </div>
          {selectedSurah.number !== 9 && (
            <div className="text-xl mt-3 text-amber-100" dir="rtl">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
          )}
        </div>

        {/* Ayahs */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {loading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-amber-500 animate-spin mr-3" />
              <span className="text-amber-700 dark:text-amber-400">Memuat surah...</span>
            </div>
          )}

          {error && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-6 text-center">
                <p className="text-red-600 dark:text-red-400 mb-3">{error}</p>
                <Button onClick={() => fetchSurah(selectedSurah)} variant="outline" className="border-red-300">
                  Coba Lagi
                </Button>
              </CardContent>
            </Card>
          )}

          <AnimatePresence mode="wait">
            {!loading && !error && (
              <motion.div
                key={selectedSurah.number}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6 max-w-3xl mx-auto"
              >
                {filteredAyahs.map((ayah, i) => {
                  const bmKey = `${selectedSurah.number}:${ayah.numberInSurah}`
                  const isBookmarked = bookmarks.includes(bmKey)
                  return (
                    <motion.div
                      key={ayah.number}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.04, 0.5) }}
                    >
                      <Card className="border-amber-100 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          {/* Verse number + bookmark */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold shadow">
                              {ayah.numberInSurah}
                            </div>
                            <button
                              onClick={() => toggleBookmark(bmKey)}
                              className={`transition-colors ${isBookmarked ? 'text-amber-500' : 'text-stone-300 hover:text-amber-400'}`}
                              aria-label={isBookmarked ? 'Hapus bookmark' : 'Tambah bookmark'}
                            >
                              {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                            </button>
                          </div>
                          {/* Arabic text */}
                          <p
                            className={`${FONT_SIZES[fontSize]} leading-loose font-serif text-right text-stone-800 dark:text-stone-100 mb-4`}
                            dir="rtl"
                            lang="ar"
                          >
                            {ayah.text}
                          </p>
                          {/* Translation */}
                          <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed border-t border-amber-50 dark:border-stone-800 pt-3">
                            {ayah.translation}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
                {filteredAyahs.length === 0 && searchQuery && (
                  <div className="text-center text-stone-400 py-12">
                    Tidak ada ayat yang cocok dengan pencarian &quot;{searchQuery}&quot;
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bookmark count */}
        {bookmarks.length > 0 && (
          <div className="border-t border-amber-100 dark:border-stone-800 bg-white dark:bg-stone-900 px-8 py-3 flex items-center gap-2">
            <BookmarkCheck className="w-4 h-4 text-amber-500" />
            <span className="text-sm text-stone-600 dark:text-stone-400">{bookmarks.length} ayat di-bookmark</span>
          </div>
        )}
      </main>
    </div>
  )
}
