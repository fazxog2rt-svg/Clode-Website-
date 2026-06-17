'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, BookOpen, Video, Headphones, FileText, Star, Clock, Play, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

const categories = [
  { id: 'all', label: 'Semua', icon: '📚' },
  { id: 'aqidah', label: 'Aqidah', icon: '🌟' },
  { id: 'fiqih', label: 'Fiqih Wanita', icon: '📖' },
  { id: 'adab', label: 'Adab', icon: '🌸' },
  { id: 'parenting', label: 'Parenting', icon: '👶' },
  { id: 'nikah', label: 'Pernikahan', icon: '💍' },
  { id: 'tafsir', label: 'Tafsir', icon: '📿' },
  { id: 'tahfidz', label: 'Tahfidz', icon: '💚' },
]

const courses = [
  {
    id: 1,
    title: 'Fiqih Muslimah Lengkap',
    category: 'fiqih',
    type: 'video',
    instructor: 'Ustadzah Hana Fauziyah',
    rating: 4.9,
    students: 2847,
    duration: '12 jam',
    progress: 65,
    image: '📖',
    level: 'Pemula',
    color: 'from-teal-400 to-emerald-600',
    description: 'Panduan lengkap fiqih untuk Muslimah modern dari bersuci hingga ibadah sehari-hari.',
    lessons: 24,
  },
  {
    id: 2,
    title: 'Aqidah Islamiyah untuk Muslimah',
    category: 'aqidah',
    type: 'video',
    instructor: 'Ustadzah Dr. Maryam',
    rating: 4.8,
    students: 1923,
    duration: '8 jam',
    progress: 30,
    image: '🌟',
    level: 'Semua Level',
    color: 'from-amber-400 to-orange-500',
    description: 'Memahami aqidah Islam yang benar sebagai pondasi kehidupan Muslimah.',
    lessons: 18,
  },
  {
    id: 3,
    title: 'Adab Muslimah dalam Kehidupan',
    category: 'adab',
    type: 'article',
    instructor: 'Ustadzah Siti Aisyah',
    rating: 4.7,
    students: 3102,
    duration: '5 jam baca',
    progress: 0,
    image: '🌸',
    level: 'Pemula',
    color: 'from-pink-400 to-rose-500',
    description: 'Panduan adab dan akhlak mulia bagi Muslimah dalam berbagai situasi kehidupan.',
    lessons: 15,
  },
  {
    id: 4,
    title: 'Parenting Islami: Mendidik Generasi Qurani',
    category: 'parenting',
    type: 'podcast',
    instructor: 'Ustadzah Ummu Ibrahim',
    rating: 4.9,
    students: 1567,
    duration: '15 jam',
    progress: 80,
    image: '👶',
    level: 'Menengah',
    color: 'from-blue-400 to-cyan-500',
    description: 'Panduan mendidik anak sesuai Al-Quran dan Sunnah dari para pakar parenting islami.',
    lessons: 30,
  },
  {
    id: 5,
    title: 'Pernikahan Barokah: Membangun Rumah Tangga Islami',
    category: 'nikah',
    type: 'video',
    instructor: 'Ustadzah Zainab M.',
    rating: 4.8,
    students: 2234,
    duration: '10 jam',
    progress: 0,
    image: '💍',
    level: 'Semua Level',
    color: 'from-purple-400 to-violet-500',
    description: 'Mempersiapkan diri dan membangun rumah tangga yang sakinah, mawaddah, warahmah.',
    lessons: 20,
  },
  {
    id: 6,
    title: 'Tahsin Al-Quran: Memperbaiki Bacaan',
    category: 'tahfidz',
    type: 'video',
    instructor: 'Ustadzah Hafshah',
    rating: 5.0,
    students: 4521,
    duration: '20 jam',
    progress: 45,
    image: '💚',
    level: 'Semua Level',
    color: 'from-green-400 to-teal-500',
    description: 'Pelajari tajwid dan makhrajul huruf dengan bimbingan ustadzah hafizah berpengalaman.',
    lessons: 40,
  },
]

const typeIcons = {
  video: Video,
  article: FileText,
  podcast: Headphones,
  ebook: BookOpen,
}

export default function LearningPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = courses.filter(course => {
    const matchCategory = activeCategory === 'all' || course.category === activeCategory
    const matchSearch = course.title.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Learning Center</h1>
          <p className="text-muted-foreground">Belajar ilmu Islam dari ustadzah terpercaya, kapan saja & di mana saja</p>
        </div>
        <div className="flex gap-3">
          <Badge variant="emerald" className="px-3 py-1.5">📚 500+ Materi</Badge>
          <Badge variant="gold" className="px-3 py-1.5">🎓 Bersertifikat</Badge>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari materi, ustadzah, atau topik..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 max-w-md"
        />
      </motion.div>

      {/* Categories */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
              activeCategory === cat.id
                ? 'bg-teal-600 text-white shadow-md'
                : 'bg-muted text-muted-foreground hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950/20'
            }`}
          >
            <span>{cat.icon}</span> {cat.label}
          </button>
        ))}
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">📚 Semua</TabsTrigger>
          <TabsTrigger value="inprogress">▶️ Sedang Belajar</TabsTrigger>
          <TabsTrigger value="completed">✅ Selesai</TabsTrigger>
          <TabsTrigger value="saved">🔖 Disimpan</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((course, index) => {
              const TypeIcon = typeIcons[course.type as keyof typeof typeIcons] || BookOpen
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07 }}
                >
                  <Card className="card-hover overflow-hidden group cursor-pointer" onClick={() => router.push(`/dashboard/learning/${course.id}`)}>
                    <div className={`h-36 bg-gradient-to-br ${course.color} flex items-center justify-center relative`}>
                      <span className="text-6xl">{course.image}</span>
                      <div className="absolute top-3 right-3 flex gap-1.5">
                        <Badge className="bg-black/30 text-white border-0 backdrop-blur-sm text-xs">
                          <TypeIcon className="w-3 h-3 mr-1" /> {course.type}
                        </Badge>
                      </div>
                      {course.progress > 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                          <div className="h-full bg-white/70 transition-all duration-500" style={{ width: `${course.progress}%` }} />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="emerald" className="text-xs">{course.level}</Badge>
                        <span className="text-xs text-muted-foreground">{course.lessons} pelajaran</span>
                      </div>
                      <h3 className="font-bold text-foreground text-sm mb-1 line-clamp-2 group-hover:text-teal-600 transition-colors">{course.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                      <p className="text-xs text-teal-600 font-medium mb-3">{course.instructor}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-foreground">{course.rating}</span>
                          <span>({course.students.toLocaleString()})</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.duration}
                        </div>
                      </div>
                      {course.progress > 0 ? (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium text-teal-600">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-1.5" />
                          <Button size="sm" className="w-full mt-3 gap-1.5" onClick={e => { e.stopPropagation(); router.push(`/dashboard/learning/${course.id}`) }}>
                            <Play className="w-3.5 h-3.5" /> Lanjutkan Belajar
                          </Button>
                        </div>
                      ) : (
                        <Button variant="outline" size="sm" className="w-full gap-1.5" onClick={e => { e.stopPropagation(); router.push(`/dashboard/learning/${course.id}`) }}>
                          Mulai Belajar <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="inprogress" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {courses.filter(c => c.progress > 0 && c.progress < 100).map((course, index) => (
              <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
                <Card className="card-hover cursor-pointer" onClick={() => router.push(`/dashboard/learning/${course.id}`)}>
                  <CardContent className="p-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-2xl mb-3`}>{course.image}</div>
                    <h3 className="font-bold text-sm text-foreground mb-1">{course.title}</h3>
                    <p className="text-xs text-teal-600 mb-3">{course.instructor}</p>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2 mb-3" />
                    <Button size="sm" className="w-full gap-1.5" onClick={e => { e.stopPropagation(); router.push(`/dashboard/learning/${course.id}`) }}><Play className="w-3.5 h-3.5" /> Lanjutkan</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-4xl mb-3">🎓</div>
            <p className="font-medium">Belum ada yang selesai</p>
            <p className="text-sm">Selesaikan kursus yang sedang berjalan untuk melihatnya di sini</p>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-4xl mb-3">🔖</div>
            <p className="font-medium">Belum ada yang disimpan</p>
            <p className="text-sm">Simpan kursus favorit untuk akses cepat</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
