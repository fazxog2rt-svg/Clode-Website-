'use client'

import { motion } from 'framer-motion'
import { Calendar, MapPin, Users, Clock, Video, Star, Bell } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const events = [
  {
    id: 1,
    title: 'Kajian Fiqih Wanita: Haid, Nifas & Thaharah',
    date: 'Selasa, 17 Juni 2025',
    time: '20:00 - 21:30 WIB',
    type: 'Online',
    platform: 'Zoom',
    instructor: 'Ustadzah Dr. Hana Fauziyah, M.Ag',
    attendees: 124,
    maxAttendees: 200,
    price: 'Gratis',
    category: 'Fiqih',
    description: 'Pembahasan mendalam tentang thaharah dari haid, nifas, dan istihadhah dengan dalil-dalil yang sahih.',
    registered: true,
    color: 'from-teal-400 to-emerald-600',
    icon: '📖',
  },
  {
    id: 2,
    title: 'Workshop Tahsin Al-Quran untuk Pemula',
    date: 'Sabtu, 21 Juni 2025',
    time: '09:00 - 12:00 WIB',
    type: 'Offline',
    location: 'Masjid Raya Al-Azhar, Jakarta',
    instructor: 'Ustadzah Hafshah Qurani',
    attendees: 38,
    maxAttendees: 50,
    price: 'Rp 150.000',
    category: 'Tahfidz',
    description: 'Workshop interaktif belajar membaca Al-Quran dengan tajwid yang benar untuk pemula dan yang ingin memperbaiki bacaan.',
    registered: false,
    color: 'from-amber-400 to-orange-500',
    icon: '📿',
  },
  {
    id: 3,
    title: 'Webinar: Parenting Islami di Era Digital',
    date: 'Ahad, 22 Juni 2025',
    time: '14:00 - 16:00 WIB',
    type: 'Online',
    platform: 'YouTube Live',
    instructor: 'Ustadzah Ummu Ibrahim, M.Psi',
    attendees: 289,
    maxAttendees: 1000,
    price: 'Gratis',
    category: 'Parenting',
    description: 'Strategi mendidik anak di era gadget dan media sosial sesuai nilai-nilai Islam.',
    registered: false,
    color: 'from-purple-400 to-violet-600',
    icon: '👶',
  },
  {
    id: 4,
    title: 'Kajian Bulanan: Meraih Istiqomah',
    date: 'Sabtu, 28 Juni 2025',
    time: '15:30 - 17:00 WIB',
    type: 'Hybrid',
    location: 'Islamic Center Bandung',
    platform: 'Zoom & Offline',
    instructor: 'Ustadzah Maryam Salihah',
    attendees: 456,
    maxAttendees: 500,
    price: 'Gratis',
    category: 'Aqidah',
    description: 'Kajian bulanan membahas cara-cara meraih dan menjaga istiqomah dalam beribadah kepada Allah.',
    registered: true,
    color: 'from-rose-400 to-pink-600',
    icon: '🌸',
  },
]

export default function EventsPage() {
  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Kajian & Event</h1>
          <p className="text-muted-foreground">Ikuti kajian dan event islami berkualitas dari ustadzah terpercaya</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="emerald" className="px-3 py-1.5">🎓 12 Event Bulan Ini</Badge>
        </div>
      </motion.div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">📅 Mendatang</TabsTrigger>
          <TabsTrigger value="registered">✅ Terdaftar</TabsTrigger>
          <TabsTrigger value="past">📚 Lewat</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6 space-y-4">
          {events.map((event, index) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
              <Card className="overflow-hidden card-hover">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Left color bar */}
                    <div className={`bg-gradient-to-br ${event.color} w-full md:w-2 md:min-h-full h-2`} />
                    <div className="p-5 flex-1">
                      <div className="flex flex-wrap items-start gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <Badge variant={event.type === 'Online' ? 'emerald' : event.type === 'Offline' ? 'default' : 'gold'} className="text-xs">
                              {event.type === 'Online' ? <Video className="w-2.5 h-2.5 mr-1" /> : <MapPin className="w-2.5 h-2.5 mr-1" />}
                              {event.type}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">{event.category}</Badge>
                            {event.price === 'Gratis' && <Badge variant="emerald" className="text-xs">🎁 Gratis</Badge>}
                            {event.registered && <Badge className="text-xs bg-teal-600">✓ Terdaftar</Badge>}
                          </div>
                          <h3 className="font-bold text-foreground text-base mb-1">{event.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2 leading-relaxed">{event.description}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-teal-500" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-teal-500" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-teal-500" />
                          <span>{event.attendees}/{event.maxAttendees}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 text-amber-500" />
                          <span>{event.instructor}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <span className="text-lg font-bold text-foreground">{event.price}</span>
                        </div>
                        <div className="flex gap-2">
                          <button className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/20 transition-colors">
                            <Bell className="w-4 h-4" />
                          </button>
                          {event.registered ? (
                            <Button variant="outline" size="sm">Lihat Detail</Button>
                          ) : (
                            <Button size="sm">Daftar Sekarang</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="registered" className="mt-6 space-y-4">
          {events.filter(e => e.registered).map((event, index) => (
            <motion.div key={event.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
              <Card>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${event.color} flex items-center justify-center text-2xl shrink-0`}>{event.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-foreground truncate">{event.title}</h3>
                    <p className="text-xs text-muted-foreground">{event.date} • {event.time}</p>
                  </div>
                  <Button size="sm" variant="outline">Masuk Kelas</Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📚</div>
            <p className="font-medium text-foreground mb-1">Riwayat Kajian</p>
            <p className="text-sm text-muted-foreground">Event yang sudah kamu ikuti akan muncul di sini</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
