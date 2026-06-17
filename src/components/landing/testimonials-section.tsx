'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Star, Quote } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const testimonials = [
  {
    name: 'Aisyah Rahmawati',
    role: 'Mahasiswi S2',
    city: 'Bandung',
    avatar: 'AR',
    color: 'from-teal-400 to-emerald-600',
    rating: 5,
    content: 'MasyaAllah! Sudah 3 bulan pakai Muslimah Journey dan perubahan yang terasa luar biasa. Shalat lebih konsisten, tilawah rutin, dan yang paling penting punya sahabat hijrah yang selalu support.',
    badge: 'Consistent Muslimah',
  },
  {
    name: 'Fatimah Azzahra',
    role: 'Ibu Rumah Tangga',
    city: 'Surabaya',
    avatar: 'FA',
    color: 'from-pink-400 to-rose-500',
    rating: 5,
    content: 'Sebagai ibu baru, susah banget cari waktu belajar. Tapi di sini ada konten khusus parenting islami yang bisa dibuka kapan aja. Fitur tracker ibadah juga membantu banget untuk tetap istiqomah.',
    badge: 'Knowledge Seeker',
  },
  {
    name: 'Khadijah Munira',
    role: 'Dokter Muda',
    city: 'Jakarta',
    avatar: 'KM',
    color: 'from-amber-400 to-orange-500',
    rating: 5,
    content: 'Fitur AI Muslimah Companion yang paling saya suka. Bisa curhat, tanya soal fiqih, dan dapat motivasi kapan saja. Rasanya seperti punya konselor islami 24 jam!',
    badge: 'Inspiring Muslimah',
  },
  {
    name: 'Zahra Nurfadillah',
    role: 'Guru SD',
    city: 'Yogyakarta',
    avatar: 'ZN',
    color: 'from-purple-400 to-violet-500',
    rating: 5,
    content: 'Fitur Sahabat Hijrah Matching ini keren banget! Dipertemukan dengan Muslimah-Muslimah yang visinya sama, sekarang kami saling menguatkan dan mengingatkan setiap hari.',
    badge: 'Quran Lover',
  },
  {
    name: 'Maryam Salihah',
    role: 'Pengusaha Muda',
    city: 'Makassar',
    avatar: 'MS',
    color: 'from-blue-400 to-cyan-500',
    rating: 5,
    content: 'Learning Center-nya lengkap banget. Dari kajian aqidah sampai fiqih muamalah bisnis ada semua. Plus komunitas diskusinya aktif dan moderasinya bagus, konten selalu berkualitas.',
    badge: 'Knowledge Seeker',
  },
  {
    name: 'Raihanah Putri',
    role: 'Desainer Grafis',
    city: 'Medan',
    avatar: 'RP',
    color: 'from-emerald-400 to-teal-600',
    rating: 5,
    content: 'Streak 60 hari di Hijrah Tracker! Dulu sering skip shalat dhuha, sekarang udah jadi kebiasaan. Motivasi dari komunitas dan badge yang bisa diraih bikin semangat banget.',
    badge: 'Consistent Muslimah',
  },
]

export function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="py-24 bg-background" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4">Testimoni</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ribuan Muslimah Sudah{' '}
            <span className="text-gradient">Merasakan Manfaatnya</span>
          </h2>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
            ))}
            <span className="ml-2 text-lg font-bold text-foreground">4.9/5</span>
          </div>
          <p className="text-muted-foreground">Dari 10,000+ ulasan pengguna</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl hover:shadow-teal-500/5 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-11 h-11">
                    <AvatarFallback className={`bg-gradient-to-br ${testimonial.color} text-white text-sm font-bold`}>
                      {testimonial.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role} • {testimonial.city}</div>
                  </div>
                </div>
                <Quote className="w-6 h-6 text-teal-300 shrink-0" />
              </div>
              <div className="flex items-center gap-0.5 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{testimonial.content}</p>
              <Badge variant="emerald" className="text-xs">{testimonial.badge}</Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
