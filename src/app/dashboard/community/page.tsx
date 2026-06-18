'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, Plus, TrendingUp, Users, ArrowRight } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/lib/auth-context'
import { createPost, getPosts, toggleLike, CommunityPost } from '@/lib/db'
import { Timestamp } from 'firebase/firestore'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(createdAt: Timestamp | null | undefined): string {
  if (!createdAt) return ''
  const date = createdAt instanceof Timestamp ? createdAt.toDate() : new Date(createdAt as unknown as string)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'baru saja'
  if (diffMin < 60) return `${diffMin} menit lalu`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour} jam lalu`
  const diffDay = Math.floor(diffHour / 24)
  return `${diffDay} hari lalu`
}

function avatarInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

const AVATAR_COLORS = [
  'from-teal-400 to-emerald-600',
  'from-pink-400 to-rose-500',
  'from-amber-400 to-orange-500',
  'from-blue-400 to-cyan-500',
  'from-purple-400 to-violet-500',
  'from-green-400 to-teal-500',
]

function avatarColor(userId: string): string {
  let hash = 0
  for (let i = 0; i < userId.length; i++) hash = (hash * 31 + userId.charCodeAt(i)) & 0xffffffff
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

// ─── Static data ──────────────────────────────────────────────────────────────

const forumTopics = [
  { icon: '🔥', title: 'Cara Memulai Hijrah di Lingkungan yang Tidak Mendukung', replies: 89, views: '2.3K', hot: true },
  { icon: '💬', title: 'Tips Konsisten Shalat Dhuha bagi Karyawan Sibuk', replies: 45, views: '1.1K', hot: true },
  { icon: '📖', title: 'Rekomendasi Buku Islami untuk Muslimah Modern', replies: 67, views: '890', hot: false },
  { icon: '🤲', title: 'Berbagi Doa dan Amalan Agar Istiqomah', replies: 123, views: '3.4K', hot: true },
  { icon: '💍', title: 'Bagaimana Memilih Pasangan yang Mendukung Hijrah?', replies: 98, views: '2.8K', hot: false },
]

const CATEGORIES = ['Cerita Hijrah', 'Motivasi', 'Tanya Ilmu', 'Pencapaian']

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function PostSkeleton() {
  return (
    <Card>
      <CardContent className="p-5 animate-pulse">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-11 h-11 rounded-full bg-muted shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-36 bg-muted rounded" />
            <div className="h-3 w-20 bg-muted rounded" />
          </div>
        </div>
        <div className="space-y-2 mb-3">
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-5/6" />
          <div className="h-3 bg-muted rounded w-4/6" />
        </div>
        <div className="flex gap-2 mb-4">
          <div className="h-5 w-16 bg-muted rounded-full" />
          <div className="h-5 w-16 bg-muted rounded-full" />
        </div>
        <div className="flex gap-4 pt-3 border-t border-border">
          <div className="h-4 w-14 bg-muted rounded" />
          <div className="h-4 w-14 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const { user, profile } = useAuth()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [showCompose, setShowCompose] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Cerita Hijrah')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const loadPosts = async () => {
    setLoadingPosts(true)
    const fetched = await getPosts(20)
    setPosts(fetched)
    setLoadingPosts(false)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const handleCreatePost = async () => {
    if (!user || !newPostContent.trim()) return
    setSubmitting(true)
    try {
      await createPost({
        userId: user.uid,
        userName: profile?.name || user.displayName || 'Muslimah',
        userPhoto: profile?.photoURL || user.photoURL || '',
        content: newPostContent.trim(),
        tags: selectedTags,
      })
      await loadPosts()
      setNewPostContent('')
      setSelectedTags([])
      setShowCompose(false)
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleLike = async (post: CommunityPost) => {
    if (!user || !post.id) return
    const isLiked = post.likedBy?.includes(user.uid) ?? false
    await toggleLike(post.id, user.uid, isLiked)
    await loadPosts()
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Komunitas Muslimah</h1>
          <p className="text-muted-foreground">Bergabung, berbagi, dan saling menguatkan bersama 50,000+ Muslimah</p>
        </div>
        {user ? (
          <Button onClick={() => setShowCompose(!showCompose)} className="gap-2">
            <Plus className="w-4 h-4" /> Buat Post
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground italic">Login untuk posting</p>
        )}
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
      {user && showCompose && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="p-5">
              <div className="flex gap-3">
                <Avatar className="w-10 h-10 shrink-0">
                  <AvatarFallback className={`bg-gradient-to-br ${avatarColor(user.uid)} text-white text-xs font-bold`}>
                    {avatarInitials(profile?.name || user.displayName || 'AN')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea
                    value={newPostContent}
                    onChange={e => setNewPostContent(e.target.value)}
                    placeholder="Bagikan cerita hijrah, motivasi, atau pertanyaan kamu..."
                    className="w-full h-28 resize-none rounded-xl bg-muted border-0 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                  />
                  <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                    <div className="flex gap-2 flex-wrap">
                      {CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`text-xs border rounded-full px-2.5 py-1 transition-colors ${
                            selectedCategory === cat
                              ? 'text-teal-600 border-teal-400 bg-teal-50 dark:bg-teal-950/30'
                              : 'text-muted-foreground hover:text-teal-600 border-border hover:border-teal-300'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                    <Button size="sm" disabled={!newPostContent.trim() || submitting} onClick={handleCreatePost}>
                      {submitting ? 'Posting...' : 'Posting'}
                    </Button>
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
          {/* Loading skeletons */}
          {loadingPosts && (
            <>
              <PostSkeleton />
              <PostSkeleton />
              <PostSkeleton />
            </>
          )}

          {/* Empty state */}
          {!loadingPosts && posts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">🌸</div>
              <h3 className="font-bold text-foreground mb-2">Belum ada post</h3>
              <p className="text-muted-foreground text-sm mb-4">Jadilah yang pertama berbagi!</p>
              {user ? (
                <Button onClick={() => setShowCompose(true)}>Buat Post Pertama</Button>
              ) : (
                <p className="text-sm text-muted-foreground italic">Login untuk memulai berbagi</p>
              )}
            </div>
          )}

          {/* Posts */}
          {!loadingPosts && posts.map((post, index) => {
            const isLiked = user ? (post.likedBy?.includes(user.uid) ?? false) : false
            const initials = avatarInitials(post.userName)
            const color = avatarColor(post.userId)
            return (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <Avatar className="w-11 h-11 shrink-0">
                        {post.userPhoto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={post.userPhoto} alt={post.userName} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <AvatarFallback className={`bg-gradient-to-br ${color} text-white text-sm font-bold`}>{initials}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-2 mb-0.5">
                          <span className="font-semibold text-sm text-foreground">{post.userName}</span>
                          <Badge variant="secondary" className="text-xs">Muslimah</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatTime(post.createdAt)}</span>
                      </div>
                    </div>

                    <p className="text-sm text-foreground leading-relaxed mb-3 whitespace-pre-line">{post.content}</p>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap mb-4">
                        {post.tags.map(tag => (
                          <span key={tag} className="text-xs text-teal-600 dark:text-teal-400 font-medium hover:underline cursor-pointer">{tag}</span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 pt-3 border-t border-border">
                      <button
                        onClick={() => handleToggleLike(post)}
                        disabled={!user}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors disabled:cursor-not-allowed ${isLiked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'}`}
                      >
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} /> {post.likes ?? 0}
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-teal-600 transition-colors font-medium">
                        <MessageCircle className="w-4 h-4" /> {post.comments ?? 0}
                      </button>
                      <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-blue-500 transition-colors font-medium ml-auto">
                        <Share2 className="w-4 h-4" /> Bagikan
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
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
