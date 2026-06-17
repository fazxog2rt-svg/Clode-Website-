'use client'

import { motion } from 'framer-motion'
import { Users, BookOpen, MessageSquare, Calendar, TrendingUp, Eye, AlertTriangle, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const stats = [
  { icon: Users, label: 'Total Pengguna', value: '52,341', change: '+1,234 bulan ini', color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/20' },
  { icon: BookOpen, label: 'Konten Aktif', value: '1,247', change: '+45 bulan ini', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/20' },
  { icon: MessageSquare, label: 'Post Komunitas', value: '8,923', change: '+892 bulan ini', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/20' },
  { icon: TrendingUp, label: 'Pendapatan', value: 'Rp 45,2 Jt', change: '+12% dari bulan lalu', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/20' },
]

const recentUsers = [
  { name: 'Aisyah N.', email: 'aisyah@gmail.com', plan: 'Premium', status: 'active', avatar: 'AN', joined: '2 jam lalu' },
  { name: 'Fatimah R.', email: 'fatimah@gmail.com', plan: 'Free', status: 'active', avatar: 'FR', joined: '5 jam lalu' },
  { name: 'Khadijah M.', email: 'khadijah@gmail.com', plan: 'Premium', status: 'active', avatar: 'KM', joined: 'Kemarin' },
  { name: 'Zahra N.', email: 'zahra@gmail.com', plan: 'Free', status: 'inactive', avatar: 'ZN', joined: '2 hari lalu' },
]

const pendingModeration = [
  { type: 'Post', user: 'Anonymous User', preview: 'Ada yang punya saran untuk...', flag: 'Perlu Review', time: '1 jam lalu' },
  { type: 'Komentar', user: 'Muslimah123', preview: 'Wah, setuju banget dengan...', flag: 'OK', time: '3 jam lalu' },
  { type: 'Post', user: 'SisterHijrah', preview: 'Teman-teman, aku mau berbagi...', flag: 'Perlu Review', time: '5 jam lalu' },
]

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground">Muslimah Journey — Dashboard Administrasi</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-muted-foreground">Sistem Normal</span>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, label, value, change, color, bg }, index) => (
            <motion.div key={label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }}>
              <Card>
                <CardContent className="p-5">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <div className="text-2xl font-bold text-foreground">{value}</div>
                  <div className="text-sm font-medium text-foreground">{label}</div>
                  <div className="text-xs text-teal-600 mt-0.5">{change}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Users */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>Pengguna Terbaru</CardTitle>
                  <Button variant="outline" size="sm">Kelola Pengguna</Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user.email} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                      <Avatar className="w-9 h-9 shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-teal-400 to-emerald-600 text-white text-xs font-bold">{user.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant={user.plan === 'Premium' ? 'gold' : 'secondary'} className="text-xs shrink-0">{user.plan}</Badge>
                      <Badge variant={user.status === 'active' ? 'emerald' : 'secondary'} className="text-xs shrink-0">{user.status}</Badge>
                      <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{user.joined}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">Moderasi Konten</CardTitle></CardHeader>
              <CardContent className="pt-0 space-y-3">
                {pendingModeration.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 py-2 border-b border-border last:border-0">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${item.flag === 'Perlu Review' ? 'bg-amber-100 dark:bg-amber-950/30' : 'bg-teal-100 dark:bg-teal-950/30'}`}>
                      {item.flag === 'Perlu Review'
                        ? <AlertTriangle className="w-3 h-3 text-amber-500" />
                        : <CheckCircle className="w-3 h-3 text-teal-500" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{item.type} — {item.user}</p>
                      <p className="text-xs text-muted-foreground truncate">{item.preview}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">Review Semua</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">Kapasitas Server</CardTitle></CardHeader>
              <CardContent className="pt-0 space-y-3">
                {[
                  { label: 'CPU', value: 34 },
                  { label: 'Memory', value: 68 },
                  { label: 'Storage', value: 45 },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{label}</span>
                      <span className={`font-medium ${value > 80 ? 'text-red-500' : value > 60 ? 'text-amber-500' : 'text-teal-600'}`}>{value}%</span>
                    </div>
                    <Progress value={value} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
