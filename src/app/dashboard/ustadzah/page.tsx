'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, ChevronUp, Heart, Send, X, MessageCircleQuestion, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

interface QA {
  id: number
  q: string
  category: string
  a: string
  answered_by: string
  date: string
  likes: number
}

const qaData: QA[] = [
  { id: 1, q: 'Bolehkah shalat menggunakan mukena yang tipis?', category: 'Shalat', a: 'Mukena yang tipis (transparan) tidak sah untuk digunakan shalat karena tidak memenuhi syarat menutup aurat yang sempurna. Aurat wanita dalam shalat harus tertutup dengan pakaian yang tidak tipis dan tidak ketat.', answered_by: 'Ustadzah Hana F.', date: '2 hari lalu', likes: 234 },
  { id: 2, q: 'Apakah wanita haid boleh membaca Al-Quran dari HP?', category: 'Quran', a: 'Para ulama kontemporer mayoritas memperbolehkan wanita haid membaca Al-Quran melalui HP/aplikasi karena tidak menyentuh mushaf fisik. Namun sebaiknya tetap berhati-hati dan ada pula ulama yang berpendapat sebaiknya menghindarinya sebagai bentuk kehati-hatian (ihtiyath).', answered_by: 'Ustadzah Dr. Maryam', date: '3 hari lalu', likes: 456 },
  { id: 3, q: 'Bagaimana hukum memakai parfum saat keluar rumah bagi wanita?', category: 'Fiqih', a: 'Wanita dilarang memakai wewangian yang menyengat saat keluar rumah karena dapat menimbulkan fitnah. Rasulullah SAW bersabda bahwa wanita yang memakai wewangian lalu melewati kaum laki-laki agar mereka mencium baunya, maka dia adalah penzina. Boleh memakai parfum ringan untuk suami di rumah.', answered_by: 'Ustadzah Siti A.', date: '5 hari lalu', likes: 321 },
  { id: 4, q: 'Apakah boleh shalat di atas sajadah bergambar makhluk hidup?', category: 'Shalat', a: 'Makruh shalat di atas sajadah yang terdapat gambar makhluk bernyawa karena bisa mengganggu kekhusyukan. Sebaiknya gunakan sajadah polos atau bermotif geometris/kaligrafi.', answered_by: 'Ustadzah Hana F.', date: '1 minggu lalu', likes: 178 },
  { id: 5, q: 'Bagaimana cara menghitung nisab zakat emas?', category: 'Zakat', a: 'Nisab zakat emas adalah 85 gram emas murni. Jika emas yang dimiliki sudah mencapai 85 gram DAN sudah dimiliki selama 1 tahun penuh (haul), maka wajib mengeluarkan zakat sebesar 2.5% dari total emas tersebut.', answered_by: 'Ustadzah Dr. Maryam', date: '1 minggu lalu', likes: 267 },
  { id: 6, q: 'Bolehkah wanita shalat berjamaah di masjid?', category: 'Shalat', a: 'Boleh bahkan mendapat pahala berjamaah, namun shalat di rumah lebih utama bagi wanita. Rasulullah SAW tidak melarang wanita ke masjid tetapi menegaskan bahwa rumah mereka lebih baik. Jika ingin ke masjid, hendaknya berpakaian menutup aurat sempurna dan tidak memakai wewangian.', answered_by: 'Ustadzah Zainab M.', date: '2 minggu lalu', likes: 389 },
  { id: 7, q: 'Apakah wanita boleh menjadi imam shalat?', category: 'Shalat', a: 'Wanita boleh menjadi imam bagi jamaah wanita saja. Tidak diperbolehkan bagi wanita untuk menjadi imam bagi jamaah laki-laki. Ini adalah pendapat jumhur (mayoritas) ulama berdasarkan dalil-dalil yang ada.', answered_by: 'Ustadzah Hana F.', date: '2 minggu lalu', likes: 145 },
  { id: 8, q: 'Bagaimana adab berpakaian muslimah di rumah?', category: 'Akhlak', a: 'Di dalam rumah, wanita tidak wajib berhijab selama hanya bersama mahramnya. Namun tetap dianjurkan berpakaian yang sopan dan rapi, terutama ketika menerima tamu atau berinteraksi dengan orang lain. Menjaga penampilan yang baik di rumah juga merupakan bentuk menghormati keluarga.', answered_by: 'Ustadzah Siti A.', date: '3 minggu lalu', likes: 298 },
  { id: 9, q: 'Apakah boleh berpuasa sunnah tanpa izin suami?', category: 'Fiqih', a: 'Wanita yang sudah menikah tidak boleh berpuasa sunnah kecuali dengan izin suami. Hal ini berdasarkan hadits Nabi SAW. Namun jika suami sedang bepergian atau tidak ada di rumah, boleh berpuasa sunnah tanpa izin.', answered_by: 'Ustadzah Dr. Maryam', date: '3 minggu lalu', likes: 412 },
  { id: 10, q: 'Bagaimana hukum mewarnai rambut bagi muslimah?', category: 'Fiqih', a: 'Mewarnai rambut diperbolehkan dengan syarat: tidak menggunakan warna hitam (kecuali dalam kondisi tertentu), warna cat tidak menghalangi air wudhu (bersifat permeable), dan tidak dalam keadaan ihram. Disarankan memilih cat rambut yang tidak menghalangi air saat berwudhu.', answered_by: 'Ustadzah Hana F.', date: '1 bulan lalu', likes: 567 },
  { id: 11, q: 'Apa hukum mengikuti kajian online saat haid?', category: 'Quran', a: 'Boleh dan sangat dianjurkan! Wanita haid tetap boleh mengikuti kajian ilmu, mendengarkan Al-Quran, berdoa, dan beristighfar. Yang dilarang adalah: shalat, puasa, thawaf, beri\'tikaf, dan menyentuh/membawa mushaf fisik. Menuntut ilmu tidak terhalangi oleh haid.', answered_by: 'Ustadzah Zainab M.', date: '1 bulan lalu', likes: 334 },
  { id: 12, q: 'Bolehkah muslimah bekerja di luar rumah?', category: 'Akhlak', a: 'Muslimah boleh bekerja di luar rumah dengan beberapa syarat: mendapat izin suami (bagi yang menikah), pekerjaan halal, menjaga aurat dan adab, tidak menelantarkan kewajiban utama di rumah, dan pekerjaan tidak bercampur baur bebas dengan laki-laki non-mahram. Islam tidak melarang wanita bekerja selama kondisi-kondisi ini terpenuhi.', answered_by: 'Ustadzah Siti A.', date: '1 bulan lalu', likes: 489 },
]

const ustadzahs = [
  { name: 'Ustadzah Hana Fauziyah', emoji: '🧕', specialization: 'Fiqih Wanita', answers: '1,234', responseRate: 98 },
  { name: 'Ustadzah Dr. Maryam', emoji: '📚', specialization: 'Aqidah & Tafsir', answers: '876', responseRate: 95 },
  { name: 'Ustadzah Siti Aisyah', emoji: '🌹', specialization: 'Adab & Akhlak', answers: '654', responseRate: 97 },
]

const categories = ['Semua', 'Shalat', 'Fiqih', 'Quran', 'Zakat', 'Akhlak']
const PAGE_SIZE = 4

const categoryColors: Record<string, string> = {
  Shalat: 'bg-teal-100 text-teal-700',
  Fiqih: 'bg-indigo-100 text-indigo-700',
  Quran: 'bg-emerald-100 text-emerald-700',
  Zakat: 'bg-amber-100 text-amber-700',
  Akhlak: 'bg-pink-100 text-pink-700',
}

export default function UstadzahPage() {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)
  const [liked, setLiked] = useState<Set<number>>(new Set())
  const [showModal, setShowModal] = useState(false)
  const [modalCategory, setModalCategory] = useState('Shalat')
  const [question, setQuestion] = useState('')
  const [askerName, setAskerName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filtered = qaData.filter(item => {
    const matchCat = activeCategory === 'Semua' || item.category === activeCategory
    const matchSearch = !search || item.q.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function toggleLike(id: number) {
    setLiked(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function submitQuestion() {
    if (!question.trim()) return
    setSubmitted(true)
    setTimeout(() => {
      setShowModal(false)
      setSubmitted(false)
      setQuestion('')
      setAskerName('')
    }, 2500)
  }

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
      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background rounded-3xl p-6 w-full max-w-md shadow-2xl"
            >
              {submitted ? (
                <div className="text-center py-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="text-5xl mb-4"
                  >
                    ✅
                  </motion.div>
                  <h3 className="font-bold text-foreground text-lg mb-2">JazakAllahu Khairan!</h3>
                  <p className="text-muted-foreground text-sm">Pertanyaan kamu sudah diterima! Ustadzah akan menjawab dalam 1-3 hari</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-foreground">Kirim Pertanyaan</h3>
                    <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Kategori</label>
                      <select
                        value={modalCategory}
                        onChange={e => setModalCategory(e.target.value)}
                        className="w-full rounded-xl border border-border bg-background text-foreground text-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        {categories.filter(c => c !== 'Semua').map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm font-medium text-foreground">Pertanyaanmu</label>
                        <span className={`text-xs ${question.length > 450 ? 'text-red-500' : 'text-muted-foreground'}`}>
                          {question.length}/500
                        </span>
                      </div>
                      <textarea
                        value={question}
                        onChange={e => { if (e.target.value.length <= 500) setQuestion(e.target.value) }}
                        placeholder="Tuliskan pertanyaanmu dengan jelas dan sopan..."
                        rows={4}
                        className="w-full rounded-xl border border-border bg-background text-foreground text-sm px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Nama <span className="text-muted-foreground">(opsional)</span></label>
                      <Input
                        value={askerName}
                        onChange={e => setAskerName(e.target.value)}
                        placeholder="Anonim jika dikosongkan"
                      />
                    </div>

                    <Button
                      onClick={submitQuestion}
                      disabled={!question.trim()}
                      className="w-full bg-teal-700 hover:bg-teal-800"
                    >
                      <Send className="w-4 h-4 mr-2" /> Kirim Pertanyaan
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div variants={itemVariants} className="relative bg-gradient-to-br from-teal-700 via-emerald-600 to-teal-800 rounded-3xl p-6 overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">🧕</div>
            <div>
              <h1 className="text-2xl font-bold text-white">Tanya Ustadzah</h1>
              <p className="text-teal-200 text-sm">Konsultasi fiqih & agama dengan para ahlinya</p>
            </div>
          </div>
          <Button
            variant="glass"
            onClick={() => setShowModal(true)}
            className="shrink-0"
          >
            <MessageCircleQuestion className="w-4 h-4 mr-2" />
            Kirim Pertanyaan
          </Button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Q&A Section */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari pertanyaan..."
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setVisibleCount(PAGE_SIZE) }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all
                  ${activeCategory === cat
                    ? 'bg-teal-700 text-white shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Q&A Cards */}
          <div className="space-y-3">
            {filtered.slice(0, visibleCount).map((item) => {
              const isExpanded = expanded === item.id
              const isLiked = liked.has(item.id)
              const color = categoryColors[item.category] || 'bg-teal-100 text-teal-700'

              return (
                <motion.div
                  key={item.id}
                  layout
                  whileHover={{ y: -2 }}
                  className="border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-card"
                >
                  <button
                    onClick={() => setExpanded(isExpanded ? null : item.id)}
                    className="w-full text-left p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 ${color}`}>
                        {item.category}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground text-sm leading-relaxed">{item.q}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.answered_by} • {item.date}</p>
                      </div>
                      <div className="shrink-0 text-muted-foreground">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-4">
                          <Separator className="mb-4" />
                          <div className="flex items-start gap-2 mb-3">
                            <div className="w-1 h-full bg-teal-500 rounded-full self-stretch min-h-[60px]" />
                            <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">Dijawab oleh <span className="font-semibold text-teal-700">{item.answered_by}</span></p>
                            <button
                              onClick={() => toggleLike(item.id)}
                              className={`flex items-center gap-1.5 text-xs font-medium transition-colors
                                ${isLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-400'}`}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
                              {item.likes + (isLiked ? 1 : 0)}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {/* Load More */}
          {visibleCount < filtered.length && (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
              >
                Lihat Lebih Banyak ({filtered.length - visibleCount} lagi)
              </Button>
            </div>
          )}

          {filtered.length === 0 && (
            <Card>
              <CardContent className="p-10 text-center">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-muted-foreground">Tidak ada pertanyaan yang sesuai.</p>
              </CardContent>
            </Card>
          )}
        </motion.div>

        {/* Ustadzah Panel */}
        <motion.div variants={itemVariants} className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tim Ustadzah Kami</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              {ustadzahs.map((u, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center text-xl shrink-0">
                    {u.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground mb-1.5">{u.specialization}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 text-teal-500" /> {u.answers} jawaban
                      </span>
                      <span className="text-emerald-600 font-medium">{u.responseRate}% respon</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800">
            <CardContent className="p-5">
              <h3 className="font-semibold text-teal-800 dark:text-teal-300 mb-2 text-sm">📌 Cara Bertanya</h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>✅ Tulis pertanyaan dengan jelas dan sopan</li>
                <li>✅ Pilih kategori yang sesuai</li>
                <li>✅ Satu pertanyaan per pengiriman</li>
                <li>✅ Jawaban dalam 1-3 hari kerja</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="font-semibold text-foreground mb-3 text-sm">Statistik Q&A</h3>
              <div className="space-y-2">
                {[
                  { label: 'Total Pertanyaan', value: '2,847' },
                  { label: 'Terjawab', value: '2,731' },
                  { label: 'Rata-rata Respon', value: '1.2 hari' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className="text-xs font-semibold text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
