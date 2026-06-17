'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserCheck, MessageCircle, Heart, Star, MapPin, Target, Users, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'

const matches = [
  {
    id: 1,
    name: 'Nisa Fadhilah',
    avatar: 'NF',
    color: 'from-teal-400 to-emerald-600',
    level: 'Consistent Muslimah',
    city: 'Bandung',
    age: 24,
    matchScore: 95,
    goals: ['Istiqomah shalat', 'Hafalan Juz 30', 'Perbaiki akhlak'],
    interests: ['Tahsin', 'Fiqih Wanita', 'Parenting'],
    bio: 'Sedang dalam perjalanan hijrah dan mencari sahabat yang bisa saling mengingatkan untuk tetap istiqomah 💚',
    connected: false,
  },
  {
    id: 2,
    name: 'Rahma Aulia',
    avatar: 'RA',
    color: 'from-pink-400 to-rose-500',
    level: 'Knowledge Seeker',
    city: 'Jakarta',
    age: 28,
    matchScore: 91,
    goals: ['Belajar ilmu agama', 'Tahfidz', 'Jadi ibu shalihah'],
    interests: ['Aqidah', 'Tafsir', 'Parenting'],
    bio: 'Ibu muda yang ingin terus belajar dan tumbuh sebagai Muslimah. Suka diskusi ilmu dan motivasi islami.',
    connected: true,
  },
  {
    id: 3,
    name: 'Hafsah Qatrunnada',
    avatar: 'HQ',
    color: 'from-amber-400 to-orange-500',
    level: 'Quran Lover',
    city: 'Yogyakarta',
    age: 22,
    matchScore: 88,
    goals: ['Hafal 30 Juz', 'Tahsin sempurna', 'Jadi hafizah'],
    interests: ['Tahfidz', 'Tahsin', 'Aqidah'],
    bio: 'Mahasiswi yang sedang mengejar hafalan Quran. Mencari teman belajar yang bisa saling menyimak hafalan.',
    connected: false,
  },
  {
    id: 4,
    name: 'Zainab Mutmainnah',
    avatar: 'ZM',
    color: 'from-purple-400 to-violet-600',
    level: 'Hijrah Starter',
    city: 'Surabaya',
    age: 26,
    matchScore: 84,
    goals: ['Mulai berhijab', 'Shalat 5 waktu', 'Tinggalkan maksiat'],
    interests: ['Fiqih', 'Adab Muslimah', 'Motivasi Hijrah'],
    bio: 'Baru memulai hijrah dan sangat membutuhkan teman yang bisa membimbing dan mendukung tanpa menghakimi.',
    connected: false,
  },
]

export default function SahabatPage() {
  const [matchesState, setMatchesState] = useState(matches)

  const toggleConnect = (id: number) => {
    setMatchesState(prev => prev.map(m => m.id === id ? { ...m, connected: !m.connected } : m))
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Sahabat Hijrah Matching</h1>
          <p className="text-muted-foreground">Temukan sahabat hijrah yang cocok berdasarkan tujuan dan minatmu</p>
        </div>
        <Badge className="bg-teal-500/10 text-teal-700 border-teal-200 dark:text-teal-400 dark:border-teal-800 px-3 py-1.5">
          <Sparkles className="w-3.5 h-3.5 mr-1" /> AI-Powered Matching
        </Badge>
      </motion.div>

      {/* Profile completion */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/10">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-foreground">Profil Matching Kamu</p>
                <p className="text-sm text-muted-foreground">Lengkapi profil untuk hasil matching yang lebih akurat</p>
              </div>
              <Button size="sm" variant="outline">Edit Profil</Button>
            </div>
            <Progress value={75} className="h-2 mb-1" />
            <p className="text-xs text-muted-foreground">75% selesai — tambahkan tujuan hijrah untuk meningkatkan akurasi matching</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Users, label: 'Sahabat Terhubung', value: '1', color: 'text-teal-600' },
          { icon: Heart, label: 'Match Tersimpan', value: '3', color: 'text-rose-500' },
          { icon: MessageCircle, label: 'Pesan Aktif', value: '2', color: 'text-blue-500' },
        ].map(({ icon: Icon, label, value, color }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <Icon className={`w-5 h-5 ${color}`} />
              <div>
                <div className="font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Matches */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-foreground">Rekomendasi Sahabat Hijrah</h2>
          <Button variant="ghost" size="sm" className="text-teal-600">Refresh ↺</Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {matchesState.map((match, index) => (
            <motion.div key={match.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="card-hover">
                <CardContent className="p-5">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="w-14 h-14 shrink-0">
                      <AvatarFallback className={`bg-gradient-to-br ${match.color} text-white font-bold text-lg`}>{match.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h3 className="font-bold text-foreground">{match.name}</h3>
                        <div className="flex items-center gap-1 shrink-0">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{match.matchScore}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="emerald" className="text-xs">{match.level}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                          <MapPin className="w-3 h-3" /> {match.city}
                        </span>
                        <span className="text-xs text-muted-foreground">{match.age} tahun</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{match.bio}</p>

                  {/* Goals */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Target className="w-3 h-3" /> Tujuan Hijrah
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {match.goals.map(goal => (
                        <span key={goal} className="text-xs bg-teal-50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-400 rounded-full px-2.5 py-0.5 border border-teal-200 dark:border-teal-800">
                          {goal}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Star className="w-3 h-3" /> Minat Belajar
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {match.interests.map(interest => (
                        <span key={interest} className="text-xs bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 rounded-full px-2.5 py-0.5 border border-amber-200 dark:border-amber-800">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => toggleConnect(match.id)}
                      size="sm"
                      variant={match.connected ? 'outline' : 'default'}
                      className="flex-1 gap-1.5"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      {match.connected ? 'Terhubung ✓' : 'Hubungkan'}
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5" /> Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
