'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, TrendingUp, BookOpen, Users, Sun,
  BookMarked, PenLine, Calendar, ShoppingBag, UserCheck,
  Sparkles, Settings, ChevronLeft, ChevronRight, Bell, LogOut
} from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', badge: null },
  { href: '/dashboard/tracker', icon: TrendingUp, label: 'Hijrah Tracker', badge: null },
  { href: '/dashboard/learning', icon: BookOpen, label: 'Learning Center', badge: 'Baru' },
  { href: '/dashboard/community', icon: Users, label: 'Komunitas', badge: '12' },
  { href: '/dashboard/daily', icon: Sun, label: 'Daily Boost', badge: null },
  { href: '/dashboard/quran', icon: BookMarked, label: 'Quran Tracker', badge: null },
  { href: '/dashboard/journal', icon: PenLine, label: 'Jurnal', badge: null },
  { href: '/dashboard/events', icon: Calendar, label: 'Kajian & Event', badge: '3' },
  { href: '/dashboard/marketplace', icon: ShoppingBag, label: 'Marketplace', badge: null },
  { href: '/dashboard/sahabat', icon: UserCheck, label: 'Sahabat Hijrah', badge: null },
  { href: '/dashboard/ai', icon: Sparkles, label: 'AI Companion', badge: 'AI' },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'relative flex flex-col h-full bg-card border-r border-border transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center h-16 px-4 border-b border-border', collapsed && 'justify-center')}>
        {!collapsed ? (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center">
              <span className="text-base">🌙</span>
            </div>
            <div>
              <span className="font-bold text-sm text-foreground">Muslimah</span>
              <span className="text-teal-600 font-bold text-sm"> Journey</span>
            </div>
          </Link>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-600 to-emerald-700 flex items-center justify-center">
            <span className="text-base">🌙</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {navItems.map(({ href, icon: Icon, label, badge }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-400 shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                collapsed && 'justify-center px-2'
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className={cn('w-5 h-5 shrink-0', isActive ? 'text-teal-600' : 'text-muted-foreground group-hover:text-foreground')} />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{label}</span>
                  {badge && (
                    <Badge
                      variant={badge === 'AI' ? 'default' : badge === 'Baru' ? 'gold' : 'secondary'}
                      className="text-xs px-1.5 py-0 h-5"
                    >
                      {badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className={cn('border-t border-border p-3 space-y-1', collapsed && 'flex flex-col items-center')}>
        {!collapsed && (
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/50 mb-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-br from-teal-400 to-emerald-600 text-white text-xs font-bold">AN</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">Aisyah N.</p>
              <p className="text-xs text-teal-600">Consistent Muslimah</p>
            </div>
            <Bell className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
        <Link href="/dashboard/settings" className={cn('flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors', collapsed && 'justify-center px-2')}>
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && 'Pengaturan'}
        </Link>
        <button className={cn('w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/20 transition-colors', collapsed && 'justify-center px-2')}>
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && 'Keluar'}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border shadow-sm flex items-center justify-center hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors z-10"
      >
        {collapsed ? <ChevronRight className="w-3 h-3 text-muted-foreground" /> : <ChevronLeft className="w-3 h-3 text-muted-foreground" />}
      </button>
    </aside>
  )
}
