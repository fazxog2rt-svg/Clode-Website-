'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ShoppingCart, Heart, Star, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const categories = [
  { id: 'all', label: 'Semua', icon: '🛍️' },
  { id: 'hijab', label: 'Hijab', icon: '🧕' },
  { id: 'abaya', label: 'Abaya', icon: '👗' },
  { id: 'books', label: 'Buku Islami', icon: '📚' },
  { id: 'quran', label: "Al-Qur'an", icon: '📖' },
  { id: 'accessories', label: 'Aksesoris', icon: '💎' },
]

const products = [
  { id: 1, name: 'Hijab Instant Premium Voile', category: 'hijab', price: 89000, originalPrice: 120000, rating: 4.8, reviews: 234, seller: 'HijabStore Official', badge: 'Best Seller', image: '🧕', colors: ['#2dd4bf', '#f9a8d4', '#fef3c7', '#1e293b'] },
  { id: 2, name: 'Al-Quran Mushaf Madinah A5', category: 'quran', price: 185000, originalPrice: 220000, rating: 5.0, reviews: 567, seller: 'Toko Quran Nusantara', badge: 'Top Rated', image: '📖', colors: ['#065f46', '#1e293b'] },
  { id: 3, name: 'Abaya Luxury Turkish Cotton', category: 'abaya', price: 350000, originalPrice: 450000, rating: 4.9, reviews: 89, seller: 'Modest Fashion ID', badge: 'Premium', image: '👗', colors: ['#1e293b', '#374151', '#4b5563'] },
  { id: 4, name: 'Buku "Muslimah & Hijrah" Ustadzah Hana', category: 'books', price: 95000, originalPrice: 120000, rating: 4.9, reviews: 445, seller: 'Penerbit Islami', badge: 'New', image: '📚', colors: ['#0f766e'] },
  { id: 5, name: 'Tasbih Digital 99 Premium', category: 'accessories', price: 145000, originalPrice: 180000, rating: 4.7, reviews: 123, seller: 'Islamic Tools', badge: null, image: '📿', colors: ['#d4af37', '#0f766e'] },
  { id: 6, name: 'Mukena Renda Mewah Set', category: 'accessories', price: 275000, originalPrice: 350000, rating: 4.8, reviews: 312, seller: 'Modest Collection', badge: 'Best Seller', image: '🌸', colors: ['white', '#fef3c7', '#fce7f3'] },
]

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [wishlist, setWishlist] = useState<number[]>([2, 4])

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const toggleWishlist = (id: number) => setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id])

  const discount = (orig: number, price: number) => Math.round((1 - price / orig) * 100)

  return (
    <div className="space-y-6 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">Muslimah Marketplace</h1>
          <p className="text-muted-foreground">Belanja produk islami berkualitas dari seller terpercaya</p>
        </div>
        <Button variant="outline" className="gap-2">
          <ShoppingCart className="w-4 h-4" /> Keranjang (0)
        </Button>
      </motion.div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Cari produk..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:text-foreground hover:border-teal-300 transition-all">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all shrink-0 ${
              activeCategory === cat.id ? 'bg-teal-600 text-white' : 'bg-muted text-muted-foreground hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950/20'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((product, index) => (
          <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
            <Card className="card-hover overflow-hidden group cursor-pointer">
              <div className="relative h-40 bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20 flex items-center justify-center">
                <span className="text-6xl">{product.image}</span>
                {product.badge && (
                  <div className="absolute top-2 left-2">
                    <Badge variant={product.badge === 'Best Seller' ? 'default' : product.badge === 'Premium' ? 'gold' : 'emerald'} className="text-xs">
                      {product.badge}
                    </Badge>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge className="bg-red-500 text-white border-0 text-xs">-{discount(product.originalPrice, product.price)}%</Badge>
                </div>
                <button
                  onClick={e => { e.preventDefault(); toggleWishlist(product.id) }}
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                >
                  <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'}`} />
                </button>
              </div>
              <CardContent className="p-3">
                <p className="text-xs text-teal-600 mb-0.5 font-medium truncate">{product.seller}</p>
                <h4 className="text-sm font-semibold text-foreground mb-1.5 line-clamp-2">{product.name}</h4>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium text-foreground">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.reviews})</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-foreground text-sm">Rp {product.price.toLocaleString('id-ID')}</span>
                  <span className="text-xs text-muted-foreground line-through">Rp {product.originalPrice.toLocaleString('id-ID')}</span>
                </div>
                <Button size="sm" className="w-full text-xs h-8">+ Keranjang</Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
