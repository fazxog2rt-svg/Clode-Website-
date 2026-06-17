'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, Plus, Search, TrendingUp, Users, BookOpen, HelpCircle, ArrowRight } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const posts = [
  {
    id: 1,
    user: 'Aisyah Rahmawati',
    avatar: 'AR',
    level: 'Consistent Muslimah',
    color: 'from-teal-400 to-emerald-600',
    time: '2 jam lalu',
    category: 'Cerita Hijrah',
    content: 'Alhamdulillah hari ini berhasil menjaga hijab dengan sempurna meski ada olokan dari teman kerja. Allah memampukan saya untuk tetap istiqomah. Bagi teman-teman yang sedang berjuang, jangan pernah menyerah ya! 💚\n\nTips saya: setiap kali muncul godaan, langsung baca istighfar dan ingat niat awal kita berhijrah karena Allah.',
    likes: 128,
    comments: 24,
    liked: false,
    tags: ['#hijrah', '#istiqomah', '#hijab'],
  },
  {
    id: 2,
    user: 'Fatimah Azzahra',
    avatar: 'FA',
    level: 'Knowledge Seeker',
    color: 'from-pink-400 to-rose-500',
    time: '5 jam lalu',
    category: 'Tanya Ilmu',
    content: 'Ustadzah & sisters, ada yang tahu hukumnya wanita yang tidak memakai jilbab karena tekanan orang tua yang non-muslim? Saya sedang dalam posisi ini dan sangat ingin mulai berhijab. Mohon doanya ya 🤲',
    likes: 89,
    comments: 47,
    liked: true,
    tags: ['#fiqih', '#hijab', '#mualaf'],
  },
  {
    id: 3,
    user: 'Khadijah Munira',
    avatar: 'KM',
    level: 'Quran Lover',
    color: 'from-amber-400 to-orange-500',
    time: '1 hari lalu',
    category: 'Pencapaian',
    content: 'MILESTONE! 🎉 Alhamdulillah, hari ini saya resmi menyelesaikan hafalan Juz 30 dengan muraja\'ah 3 kali! Terima kasih buat semua sahabat hijrah yang selalu support dan mengingatkan. Ini bukan akhir, ini awal dari perjalanan yang lebih panjang. Bismillah lanjut Juz 29! 🌟',
    likes: 247,
    comments: 67,
    liked: false,
    tags: ['#tahfidz', '#milestone', '#quran'],
  },
  {
    id: 4,
    user: 'Raihanah Putri',
    avatar: 'RP',
    level: 'Hijrah Starter',
    color: 'from-blue-400 to-cyan-500',
    time: '2 hari lalu',
    category: 'Motivasi',
    content: 'Pengingat untuk diri sendiri dan sisters semua: Hijrah itu bukan tentang menjadi sempurna, tapi tentang terus bergerak maju meski pelan. Bahkan satu langkah kecil menuju kebaikan sudah dicatat oleh Allah.\n\n"Man jadda wajada" - Siapa yang bersungguh-sungguh, dia akan berhasil 💪',
    likes: 312,
    comments: 45,
    liked: true,
    tags: ['#motivasi', '#hijrah', '#semangat'],
  },
]

const forumTopics = [
  { icon: '🔥', title: 'Cara Memulai Hijrah di Lingkungan yang Tidak Mendukung', replies: 89, views: '2.3K', hot: true },
  { icon: '💬', title: 'Tips Konsisten Shalat Dhuha bagi Karyawan Sibuk', replies: 45, views: '1.1K', hot: true },
  { icon: '📖', title: 'Rekomendasi Buku Islami untuk Muslimah Modern', replies: 67, views: '890', hot: false },
  { icon: '🤲', title: 'Berbagi Doa dan Amalan Agar Istiqomah', replies: 123, views: '3.4K', hot: true },
  { icon: '💍', title: 'Bagaimana Memilih Pasangan yang Mendukung Hijrah?', replies: 98, views: '2.8K', hot: false },
]

export default function CommunityPage() {
  const [posts_state, setPosts] = useState(posts)
  const [newPost, setNewPost] = useState('')
  const [showCompose, setShowCompose] = useState(false)

  const toggleLike = (id: number) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ))
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Komunitas Muslimah</h1>
          <p className="text-muted-foreground">Bergabung, berbagi, dan saling menguatkan bersama 50,000+ Muslimah</p>
        </div>
        <Button onClick={() => setShowCompose(!showCompose)} className="gap-2">
          <Plus className="w-4 h-4" /> Buat Post
        </Button>
      </motion.div>

      {/* Stats bar */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-3">
        {[
          { icon: Users, label: 'Anggota Aktif', value: '50K+', color: 'text-teal-600' },
          { icon: TrendingUp, label: 'Post Hari Ini', value: '234', color: 'text-amber-600' },
          { icon: MessageCircle, label: 'Komentar', value: '1.2K', color: 'text-blue-600' },
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
      </motion.div>

      {/* Compose */}
      {showCompose && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex gap-3">
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-teal-400 to-emerald-600 text-white text-xs font-bold">AN</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={e => setNewPost(e.target.value)}
                    placeholder="Bagikan cerita hijrah, motivasi, atau pertanyaan kamu..."
                    className="w-full h-28 resize-none rounded-xl bg-muted border-0 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-2">
                      {['Cerita Hijrah', 'Motivasi', 'Tanya Ilmu', 'Pencapaian'].map(cat => (
                        <button key={cat} className="text-xs text-muted-foreground hover:text-teal-600 border border-border hover:border-teal-300 rounded-full px-2.5 py-1 transition-colors">
                          {cat}
                        </button>
                      ))}
                    </div>
                    <Button size="sm" disabled={!newPost.trim()}>Posting</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Tabs defaultValue="feed">
        <TabsList>
          <TabsTrigger value="feed">📱 Feed</TabsTrigger>
          <TabsTrigger value="forum">💬 Forum</TabsTrigger>
          <TabsTrigger value="stories">📖 Cerita Hijrah</TabsTrigger>
          <TabsTrigger value="groups">👥 Grup</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="mt-6 space-y-4">
          {posts_state.map((post, index) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <Avatar className="w-11 h-11 shrink-0">
                      <AvatarFallback className={`bg-gradient-to-br ${post.color} text-white text-sm font-bold`}>{post.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-2 mb-0.5">
                        <span className="font-semibold text-sm text-foreground">{post.user}</span>
                        <Badge variant="emerald" className="text-xs">{post.level}</Badge>
                        <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">{post.time}</span>
                    </div>
                  </div>

                  <p className="text-sm text-foreground leading-relaxed mb-3 whitespace-pre-line">{post.content}</p>

                  <div className="flex gap-1.5 mb-4">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-xs text-teal-600 dark:text-teal-400 font-medium hover:underline cursor-pointer">{tag}</span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-3 border-t border-border">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${post.liked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'}`}
                    >
                      <Heart className={`w-4 h-4 ${post.liked ? 'fill-rose-500' : ''}`} /> {post.likes}
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-teal-600 transition-colors font-medium">
                      <MessageCircle className="w-4 h-4" /> {post.comments}
                    </button>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-blue-500 transition-colors font-medium ml-auto">
                      <Share2 className="w-4 h-4" /> Bagikan
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="forum" className="mt-6">
          <div className="space-y-3">
            {forumTopics.map((topic, index) => (
              <motion.div key={topic.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
                <Card className="card-hover cursor-pointer">
                  <CardContent className="p-4 flex items-center gap-4">
                    <span className="text-2xl">{topic.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-foreground line-clamp-1">{topic.title}</p>
                        {topic.hot && <Badge variant="default" className="text-xs shrink-0">🔥 Hot</Badge>}
                      </div>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span>{topic.replies} balasan</span>
                        <span>{topic.views} dilihat</span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stories" className="mt-6">
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📖</div>
            <h3 className="font-bold text-foreground mb-2">Cerita Hijrah</h3>
            <p className="text-muted-foreground text-sm mb-4">Baca kisah inspiratif dari Muslimah yang telah berhasil dalam perjalanan hijrah mereka</p>
            <Button>Tulis Cerita Hijrahmu</Button>
          </div>
        </TabsContent>

        <TabsContent value="groups" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'Hijab Starter Circle', members: 1240, icon: '🧕', desc: 'Untuk Muslimah yang baru memulai berhijab' },
              { name: 'Tahfidz Quran Group', members: 876, icon: '📖', desc: 'Komunitas penghafal Al-Quran bersama' },
              { name: 'Working Muslimah', members: 2341, icon: '💼', desc: 'Muslimah profesional yang tetap istiqomah' },
              { name: 'New Moms Islamic', members: 567, icon: '👶', desc: 'Ibu baru yang belajar parenting islami' },
            ].map((group, index) => (
              <motion.div key={group.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
                <Card className="card-hover">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/30 flex items-center justify-center text-2xl">{group.icon}</div>
                      <div>
                        <h4 className="font-bold text-sm text-foreground">{group.name}</h4>
                        <p className="text-xs text-muted-foreground">{group.members.toLocaleString()} anggota</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{group.desc}</p>
                    <Button variant="outline" size="sm" className="w-full">Bergabung</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
