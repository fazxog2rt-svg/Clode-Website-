import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { Heart, Instagram, Twitter, Youtube, MessageCircle } from 'lucide-react'

const footerLinks = {
  platform: {
    title: 'Platform',
    links: [
      { href: '/dashboard', label: 'Dashboard' },
      { href: '/tracker', label: 'Hijrah Tracker' },
      { href: '/learning', label: 'Learning Center' },
      { href: '/community', label: 'Komunitas' },
      { href: '/quran', label: 'Quran Tracker' },
      { href: '/journal', label: 'Jurnal' },
    ],
  },
  learn: {
    title: 'Belajar',
    links: [
      { href: '/learning/aqidah', label: 'Aqidah' },
      { href: '/learning/fiqih', label: 'Fiqih Wanita' },
      { href: '/learning/adab', label: 'Adab Muslimah' },
      { href: '/learning/parenting', label: 'Parenting' },
      { href: '/learning/tahfidz', label: 'Tahfidz' },
    ],
  },
  company: {
    title: 'Perusahaan',
    links: [
      { href: '/about', label: 'Tentang Kami' },
      { href: '/blog', label: 'Blog' },
      { href: '/events', label: 'Kajian & Event' },
      { href: '/marketplace', label: 'Marketplace' },
      { href: '/contact', label: 'Kontak' },
    ],
  },
  support: {
    title: 'Dukungan',
    links: [
      { href: '/help', label: 'Pusat Bantuan' },
      { href: '/privacy', label: 'Kebijakan Privasi' },
      { href: '/terms', label: 'Syarat & Ketentuan' },
      { href: '/community-guidelines', label: 'Panduan Komunitas' },
    ],
  },
}

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
  { icon: MessageCircle, href: '#', label: 'Telegram' },
]

export function Footer() {
  return (
    <footer className="bg-navy dark:bg-slate-950 text-white">
      {/* Islamic Pattern Divider */}
      <div className="h-1 bg-gradient-to-r from-teal-700 via-amber-500 to-teal-700" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                <span className="text-xl">🌙</span>
              </div>
              <div>
                <div className="font-bold text-xl">Muslimah Journey</div>
                <div className="text-xs text-teal-400">Berhijrah Tidak Harus Sendiri</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              Platform islami premium untuk Muslimah yang ingin berhijrah, menambah ilmu,
              membangun kebiasaan baik, dan terhubung dengan komunitas yang supportif.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-teal-600 flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-white mb-4 text-sm">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-slate-400 hover:text-teal-400 text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="bg-white/5 rounded-2xl p-6 mb-12 border border-white/10">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-white mb-1">Dapatkan Motivasi Harian</h4>
              <p className="text-slate-400 text-sm">Ayat, hadits, dan motivasi hijrah langsung ke email kamu</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Email kamu..."
                className="flex-1 md:w-64 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-teal-500 transition-colors"
              />
              <button className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-semibold transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10 mb-8" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © 2025 Muslimah Journey. Dibuat dengan{' '}
            <Heart className="inline w-3.5 h-3.5 text-red-400 fill-red-400" /> untuk Muslimah Indonesia
          </p>
          <div className="flex items-center gap-1 text-slate-500 text-sm">
            <span className="text-teal-500 font-arabic text-lg">بِسْمِ اللَّهِ</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
