'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Heart, MessageCircle, Share2, UserPlus } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const posts = [
  {
    id: 1,
    user: 'Aisyah N.',
    level: 'Consistent Muslimah',
    time: '2 jam lalu',
    content: 'Alhamdulillah hari ini berhasil menjaga hijab dengan sempurna meski ada olokan dari teman kerja. Allah memampukan saya untuk tetap istiqomah 💚',
    likes: 128,
    comments: 24,
    tags: ['#hijrah', '#istiqomah'],
    avatar: 'AN',
    color: 'from-teal-400 to-emerald-600',
  },
  {
    id: 2,
    user: 'Fatimah R.',
    level: 'Knowledge Seeker',
    time: '5 jam lalu',
    content: 'Baru saja menyelesaikan kajian Fiqih Wanita di platform ini. MasyaAllah banyak sekali ilmu baru yang didapat! Terima kasih Ustadzah Hana 🌹',
    likes: 89,
    comments: 15,
    tags: ['#belajar', '#fiqihwanita'],
    avatar: 'FR',
    color: 'from-pink-400 to-rose-600',
  },
  {
    id: 3,
    user: 'Khadijah M.',
    level: 'Quran Lover',
    time: '1 hari lalu',
    content: 'Milestone! Sudah hafal Juz 30 dengan sempurna berkat fitur Quran Tracker di sini. Doa teman-teman ya, semoga bisa lanjut ke Juz 29 🤲',
    likes: 247,
    comments: 67,
    tags: ['#tahfidz', '#quran'],
    avatar: 'KM',
    color: 'from-amber-400 to-orange-600',
  },
]

export function CommunitySection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="community" className="py-24 bg-background" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Posts Feed */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:shadow-teal-500/5 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className={`bg-gradient-to-br ${post.color} text-white text-xs font-bold`}>
                      {post.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-foreground">{post.user}</span>
                      <Badge variant="emerald" className="text-xs px-2 py-0.5">{post.level}</Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">{post.time}</span>
                  </div>
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-3">{post.content}</p>
                <div className="flex gap-1.5 mb-3">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs text-teal-600 dark:text-teal-400 font-medium">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <button className="flex items-center gap-1.5 text-xs hover:text-rose-500 transition-colors">
                    <Heart className="w-3.5 h-3.5" /> {post.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs hover:text-teal-500 transition-colors">
                    <MessageCircle className="w-3.5 h-3.5" /> {post.comments}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs hover:text-blue-500 transition-colors">
                    <Share2 className="w-3.5 h-3.5" /> Bagikan
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Badge className="mb-4">Komunitas Muslimah</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tumbuh Bersama{' '}
              <span className="text-gradient">Sahabat Hijrah</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Bergabung dengan komunitas Muslimah yang saling mendukung, menginspirasi,
              dan menjaga satu sama lain untuk tetap istiqomah di jalan Allah.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { emoji: '💬', label: 'Forum Diskusi', desc: 'Tanya & berbagi ilmu' },
                { emoji: '📖', label: 'Cerita Hijrah', desc: 'Inspirasi nyata' },
                { emoji: '🤝', label: 'Support Group', desc: 'Saling menguatkan' },
                { emoji: '🎯', label: 'Challenge', desc: 'Kompetisi ibadah' },
              ].map(({ emoji, label, desc }) => (
                <div key={label} className="bg-muted/50 rounded-2xl p-4 hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-colors">
                  <span className="text-2xl mb-2 block">{emoji}</span>
                  <div className="font-semibold text-sm text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground">{desc}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex -space-x-2">
                {['🧕', '🧕', '🧕', '🧕', '🧕', '🧕'].map((emoji, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 border-2 border-background flex items-center justify-center">
                    <span className="text-sm">{emoji}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">50,000+ Muslimah Aktif</p>
                <p className="text-xs text-muted-foreground">+128 bergabung hari ini</p>
              </div>
            </div>

            <Button size="lg" className="gap-2">
              <UserPlus className="w-5 h-5" />
              Bergabung Sekarang
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
