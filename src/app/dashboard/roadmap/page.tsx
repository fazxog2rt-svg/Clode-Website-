'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Circle, Lock, Loader2, Star, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'

const STORAGE_KEY = 'mj_roadmap_progress'

type NodeStatus = 'locked' | 'available' | 'in_progress' | 'completed'
type NodeCategory = 'ibadah' | 'akhlak' | 'ilmu' | 'sosial'

interface RoadmapNode {
  id: string
  title: string
  category: NodeCategory
  xp: number
  description: string
  subtasks: string[]
  dependsOn: string[]
}

const NODES: RoadmapNode[] = [
  {
    id: 'shalat5',
    title: 'Shalat 5 Waktu Istiqomah',
    category: 'ibadah',
    xp: 100,
    description: 'Menjaga shalat 5 waktu secara konsisten selama 30 hari berturut-turut.',
    subtasks: ['Subuh tepat waktu 7 hari', 'Lengkap 5 waktu 14 hari', 'Istiqomah 30 hari penuh'],
    dependsOn: [],
  },
  {
    id: 'quran1',
    title: 'Baca Al-Quran 1 Halaman/Hari',
    category: 'ilmu',
    xp: 80,
    description: 'Membangun kebiasaan membaca Al-Quran minimal 1 halaman setiap hari.',
    subtasks: ['Baca 1 halaman 7 hari berturut', 'Baca dengan tajwid benar', 'Konsisten 21 hari'],
    dependsOn: ['shalat5'],
  },
  {
    id: 'dzikir',
    title: 'Dzikir Pagi & Petang',
    category: 'ibadah',
    xp: 80,
    description: 'Mengamalkan dzikir pagi dan petang sesuai sunnah.',
    subtasks: ["Hafal dzikir pagi (7 dzikir)", "Hafal dzikir petang (7 dzikir)", "Amalkan 14 hari berturut"],
    dependsOn: ['shalat5'],
  },
  {
    id: 'puasasunnah',
    title: 'Puasa Sunnah Senin-Kamis',
    category: 'ibadah',
    xp: 120,
    description: 'Menjalankan puasa sunnah Senin dan Kamis secara rutin.',
    subtasks: ['Puasa Senin pertama', 'Puasa Kamis pertama', 'Konsisten 4 minggu berturut'],
    dependsOn: ['quran1'],
  },
  {
    id: 'fiqihdsr',
    title: 'Belajar Fiqih Dasar',
    category: 'ilmu',
    xp: 100,
    description: 'Mempelajari fiqih dasar meliputi thaharah, shalat, puasa, dan zakat.',
    subtasks: ['Pelajari bab thaharah', 'Pelajari bab shalat', 'Pelajari bab puasa & zakat'],
    dependsOn: ['quran1'],
  },
  {
    id: 'lisan',
    title: 'Menjaga Lisan',
    category: 'akhlak',
    xp: 90,
    description: 'Menjaga lisan dari ghibah, fitnah, dan perkataan sia-sia.',
    subtasks: ['Hindari ghibah 7 hari', 'Biasakan berkata baik', 'Introspeksi harian 21 hari'],
    dependsOn: ['dzikir'],
  },
  {
    id: 'sedekah',
    title: 'Sedekah Rutin',
    category: 'sosial',
    xp: 100,
    description: 'Membiasakan bersedekah secara rutin, walau sedikit setiap harinya.',
    subtasks: ['Sedekah 7 hari berturut', 'Sedekah ke yatim/fakir', 'Sedekah jariyah'],
    dependsOn: ['dzikir'],
  },
  {
    id: 'dhuha',
    title: 'Shalat Dhuha',
    category: 'ibadah',
    xp: 80,
    description: 'Membangun kebiasaan shalat Dhuha minimal 2 rakaat setiap pagi.',
    subtasks: ['Shalat dhuha 7 hari', 'Dhuha 4 rakaat 7 hari', 'Konsisten 21 hari'],
    dependsOn: ['puasasunnah'],
  },
  {
    id: 'tahsin',
    title: 'Tahsin Al-Quran',
    category: 'ilmu',
    xp: 120,
    description: 'Memperbaiki bacaan Al-Quran dengan mempelajari tajwid secara mendalam.',
    subtasks: ['Ikuti kelas tahsin', 'Perbaiki makharijul huruf', 'Bacaan dinilai baik oleh guru'],
    dependsOn: ['fiqihdsr'],
  },
  {
    id: 'hafalan',
    title: 'Hafalan Surat Pendek',
    category: 'ilmu',
    xp: 150,
    description: 'Menghafal surat-surat pendek (juz 30) dengan tartil dan benar.',
    subtasks: ["Hafal An-Nas, Al-Falaq, Al-Ikhlas", "Hafal Al-Kafirun, Al-Kautsar", "Hafal 10 surat juz 30"],
    dependsOn: ['tahsin'],
  },
  {
    id: 'silaturahmi',
    title: 'Silaturahmi Keluarga',
    category: 'sosial',
    xp: 100,
    description: 'Menjaga dan mempererat silaturahmi dengan keluarga dan kerabat.',
    subtasks: ['Kunjungi orang tua/wali', 'Hubungi saudara yang jauh', 'Pererat hubungan kerabat'],
    dependsOn: ['lisan', 'sedekah'],
  },
  {
    id: 'mentor',
    title: 'Mentor Muslimah Lain',
    category: 'sosial',
    xp: 200,
    description: 'Menjadi mentor bagi muslimah lain dalam perjalanan hijrah mereka.',
    subtasks: ['Bagikan ilmu ke 3 orang', 'Bimbing 1 muslimah baru', 'Aktif di komunitas islami'],
    dependsOn: ['hafalan', 'silaturahmi'],
  },
]

const CATEGORY_COLORS: Record<NodeCategory, string> = {
  ibadah: 'teal',
  akhlak: 'purple',
  ilmu: 'blue',
  sosial: 'amber',
}

const CATEGORY_LABELS: Record<NodeCategory, string> = {
  ibadah: 'Ibadah',
  akhlak: 'Akhlak',
  ilmu: 'Ilmu',
  sosial: 'Sosial',
}

interface NodeProgress {
  status: NodeStatus
  completedSubtasks: number[]
}

function getInitialProgress(): Record<string, NodeProgress> {
  if (typeof window === 'undefined') return {}
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  const initial: Record<string, NodeProgress> = {}
  NODES.forEach(n => {
    initial[n.id] = {
      status: n.dependsOn.length === 0 ? 'available' : 'locked',
      completedSubtasks: [],
    }
  })
  return initial
}

function computeStatuses(progress: Record<string, NodeProgress>): Record<string, NodeProgress> {
  const updated = { ...progress }
  NODES.forEach(node => {
    if (updated[node.id]?.status === 'completed') return
    const allDepsComplete = node.dependsOn.every(
      dep => updated[dep]?.status === 'completed'
    )
    if (allDepsComplete) {
      if (updated[node.id]?.status === 'locked') {
        updated[node.id] = { ...updated[node.id], status: 'available' }
      }
    } else {
      if (updated[node.id]?.status !== 'locked') {
        // keep in_progress if already started but not completed
      }
    }
  })
  return updated
}

export default function RoadmapPage() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<Record<string, NodeProgress>>({})
  const [expandedNode, setExpandedNode] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initial = getInitialProgress()
    const computed = computeStatuses(initial)
    setProgress(computed)
    setMounted(true)
  }, [])

  const saveProgress = (newProgress: Record<string, NodeProgress>) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress))
    }
    setProgress(newProgress)
  }

  const toggleSubtask = (nodeId: string, subtaskIdx: number) => {
    const nodeProg = progress[nodeId]
    if (!nodeProg || nodeProg.status === 'locked') return

    const alreadyDone = nodeProg.completedSubtasks.includes(subtaskIdx)
    const newCompleted = alreadyDone
      ? nodeProg.completedSubtasks.filter(i => i !== subtaskIdx)
      : [...nodeProg.completedSubtasks, subtaskIdx]

    const node = NODES.find(n => n.id === nodeId)!
    let newStatus: NodeStatus = nodeProg.status
    if (newCompleted.length === 0) {
      newStatus = 'available'
    } else if (newCompleted.length >= node.subtasks.length) {
      newStatus = 'completed'
    } else {
      newStatus = 'in_progress'
    }

    const newProgress = {
      ...progress,
      [nodeId]: { status: newStatus, completedSubtasks: newCompleted },
    }
    const recomputed = computeStatuses(newProgress)
    saveProgress(recomputed)
  }

  const totalXP = NODES.reduce((sum, n) => {
    if (progress[n.id]?.status === 'completed') return sum + n.xp
    return sum
  }, 0)

  const maxXP = NODES.reduce((sum, n) => sum + n.xp, 0)
  const xpPercent = maxXP > 0 ? Math.round((totalXP / maxXP) * 100) : 0
  const completedCount = NODES.filter(n => progress[n.id]?.status === 'completed').length

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Hijrah Roadmap</h1>
            <p className="text-sm text-muted-foreground">Perjalanan transformasi dirimu sebagai Muslimah</p>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mt-4 bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Total XP: <span className="text-teal-600 font-bold">{totalXP}</span> / {maxXP}</span>
            <span className="text-sm text-muted-foreground">{completedCount}/{NODES.length} selesai</span>
          </div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">{xpPercent}% perjalanan selesai</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4">
          {[
            { color: 'bg-gray-200 dark:bg-gray-700', label: 'Terkunci' },
            { color: 'bg-white dark:bg-gray-900 border-2 border-teal-500', label: 'Tersedia' },
            { color: 'bg-teal-500', label: 'Sedang Dikerjakan' },
            { color: 'bg-emerald-500', label: 'Selesai' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${color}`} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Nodes */}
      <div className="relative">
        {NODES.map((node, index) => {
          const nodeProg = progress[node.id] || { status: 'locked', completedSubtasks: [] }
          const status = nodeProg.status
          const isExpanded = expandedNode === node.id
          const catColor = CATEGORY_COLORS[node.category]

          const cardBg =
            status === 'completed'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400'
              : status === 'in_progress'
              ? 'bg-teal-50 dark:bg-teal-950/30 border-teal-400'
              : status === 'available'
              ? 'bg-card border-teal-300 dark:border-teal-700'
              : 'bg-muted/50 border-border opacity-60'

          return (
            <div key={node.id} className="relative">
              {/* Connecting line */}
              {index < NODES.length - 1 && (
                <div className="absolute left-6 top-full w-0.5 h-6 bg-border z-0" style={{ marginTop: '-2px' }} />
              )}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative z-10 border-2 rounded-2xl mb-6 overflow-hidden transition-all duration-200 ${cardBg} ${status !== 'locked' ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed'}`}
                onClick={() => {
                  if (status === 'locked') return
                  setExpandedNode(isExpanded ? null : node.id)
                }}
              >
                {status === 'in_progress' && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-teal-400"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}

                <div className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Status icon */}
                    <div className="mt-0.5">
                      {status === 'completed' ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      ) : status === 'in_progress' ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        >
                          <Loader2 className="w-6 h-6 text-teal-500" />
                        </motion.div>
                      ) : status === 'available' ? (
                        <Circle className="w-6 h-6 text-teal-500" />
                      ) : (
                        <Lock className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`font-semibold text-base ${status === 'locked' ? 'text-muted-foreground' : 'text-foreground'}`}>
                          {node.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className={`text-xs border-${catColor}-400 text-${catColor}-600 dark:text-${catColor}-400`}
                        >
                          {CATEGORY_LABELS[node.category]}
                        </Badge>
                        <span className="text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-full">
                          +{node.xp} XP
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{node.description}</p>

                      {/* Progress bar for subtasks */}
                      {status !== 'locked' && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>{nodeProg.completedSubtasks.length}/{node.subtasks.length} sub-tugas</span>
                            <span>{Math.round((nodeProg.completedSubtasks.length / node.subtasks.length) * 100)}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-300"
                              style={{ width: `${(nodeProg.completedSubtasks.length / node.subtasks.length) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {status !== 'locked' && (
                      <div className="text-muted-foreground">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded subtasks */}
                <AnimatePresence>
                  {isExpanded && status !== 'locked' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 border-t border-border/50">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-3 mb-2">Sub-tugas</p>
                        <div className="space-y-2">
                          {node.subtasks.map((task, idx) => {
                            const done = nodeProg.completedSubtasks.includes(idx)
                            return (
                              <motion.button
                                key={idx}
                                whileTap={{ scale: 0.98 }}
                                onClick={e => {
                                  e.stopPropagation()
                                  toggleSubtask(node.id, idx)
                                }}
                                className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left text-sm transition-colors ${done ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' : 'bg-muted/50 hover:bg-muted text-foreground'}`}
                              >
                                {done ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                  <Circle className="w-4 h-4 text-muted-foreground shrink-0" />
                                )}
                                <span className={done ? 'line-through opacity-70' : ''}>{task}</span>
                              </motion.button>
                            )
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
