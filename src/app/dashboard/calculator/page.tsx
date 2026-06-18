'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, Scale, Calendar, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// ─── Zakat Types ───────────────────────────────────────────────────────────────
type ZakatType = 'mal' | 'emas' | 'perak' | 'perdagangan'

const NISAB = {
  mal:        { label: 'Zakat Mal',        nisab: 85 * 1200000, info: '85 gram emas × Rp1.200.000' },
  emas:       { label: 'Zakat Emas',       nisab: 85 * 1200000, info: '85 gram emas × Rp1.200.000' },
  perak:      { label: 'Zakat Perak',      nisab: 595 * 15000,  info: '595 gram perak × Rp15.000' },
  perdagangan:{ label: 'Zakat Perdagangan',nisab: 85 * 1200000, info: 'Setara nisab emas' },
}

function formatRp(n: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)
}

function parseRp(s: string) {
  return Number(s.replace(/\D/g, '')) || 0
}

// ─── Hijri Conversion ──────────────────────────────────────────────────────────
const HIJRI_MONTHS_ID = [
  'Muharram','Safar','Rabi\'ul Awal','Rabi\'ul Akhir',
  'Jumadil Awal','Jumadil Akhir','Rajab','Sya\'ban',
  'Ramadhan','Syawal','Dzulqa\'dah','Dzulhijjah',
]
const HIJRI_MONTHS_AR = [
  'مُحَرَّم','صَفَر','رَبِيعٌ الأَوَّل','رَبِيعٌ الثَّانِي',
  'جُمَادَى الأُولَى','جُمَادَى الآخِرَة','رَجَب','شَعْبَان',
  'رَمَضَان','شَوَّال','ذُو الْقَعْدَة','ذُو الْحِجَّة',
]

function toJulianDay(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12)
  const yr = y + 4800 - a
  const mo = m + 12 * a - 3
  return d + Math.floor((153 * mo + 2) / 5) + 365 * yr + Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045
}

function julianToHijri(jd: number): { day: number; month: number; year: number } {
  const l = jd - 1948440 + 10632
  const n = Math.floor((l - 1) / 10631)
  const l2 = l - 10631 * n + 354
  const j = Math.floor((10985 - l2) / 5316) * Math.floor(50 * l2 / 17719) + Math.floor(l2 / 5670) * Math.floor(43 * l2 / 15238)
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor(17719 * j / 50) - Math.floor(j / 16) * Math.floor(15238 * j / 43) + 29
  const month = Math.floor(24 * l3 / 709)
  const day = l3 - Math.floor(709 * month / 24)
  const year = 30 * n + j - 30
  return { day, month, year }
}

function gregorianToHijri(date: Date) {
  const jd = toJulianDay(date.getFullYear(), date.getMonth() + 1, date.getDate())
  return julianToHijri(jd)
}

// Approximate Gregorian date for Hijri date (inverse)
function hijriToApproxGregorian(hYear: number, hMonth: number, hDay: number): Date {
  // JD for hijri date
  const jd = Math.floor((11 * hYear + 3) / 30) + 354 * hYear + 30 * hMonth - Math.floor((hMonth - 1) / 2) + hDay + 1948440 - 385
  // Convert JD to Gregorian
  const l = jd + 68569
  const n = Math.floor(4 * l / 146097)
  const l2 = l - Math.floor((146097 * n + 3) / 4)
  const i = Math.floor(4000 * (l2 + 1) / 1461001)
  const l3 = l2 - Math.floor(1461 * i / 4) + 31
  const j = Math.floor(80 * l3 / 2447)
  const day = l3 - Math.floor(2447 * j / 80)
  const l4 = Math.floor(j / 11)
  const month = j + 2 - 12 * l4
  const year = 100 * (n - 49) + i + l4
  return new Date(year, month - 1, day)
}

const ISLAMIC_EVENTS_2025_2026 = [
  { name: 'Muharram 1 (Tahun Baru Islam)', hYear: 1447, hMonth: 1, hDay: 1 },
  { name: 'Maulid Nabi SAW', hYear: 1447, hMonth: 3, hDay: 12 },
  { name: 'Isra Mi\'raj', hYear: 1447, hMonth: 7, hDay: 27 },
  { name: 'Ramadhan 1', hYear: 1447, hMonth: 9, hDay: 1 },
  { name: 'Idul Fitri', hYear: 1447, hMonth: 10, hDay: 1 },
  { name: 'Idul Adha', hYear: 1447, hMonth: 12, hDay: 10 },
]

// ─── Waris Helpers ─────────────────────────────────────────────────────────────
type Heirs = {
  spouse: boolean
  sonCount: number
  daughterCount: number
  father: boolean
  mother: boolean
  sibling: boolean
}

function calcWaris(total: number, heirs: Heirs): { name: string; fraction: string; amount: number }[] {
  const results: { name: string; fraction: string; amount: number }[] = []
  let remaining = total
  const { spouse, sonCount, daughterCount, father, mother } = heirs

  // Simplified faraidh rules
  if (spouse) {
    const hasCh = sonCount > 0 || daughterCount > 0
    const frac = hasCh ? 1 / 8 : 1 / 4
    const amt = total * frac
    results.push({ name: 'Istri/Suami', fraction: hasCh ? '1/8' : '1/4', amount: amt })
    remaining -= amt
  }
  if (mother) {
    const hasChild = sonCount > 0 || daughterCount > 0
    const frac = hasChild ? 1 / 6 : 1 / 3
    const amt = total * frac
    results.push({ name: 'Ibu', fraction: hasChild ? '1/6' : '1/3', amount: amt })
    remaining -= amt
  }
  if (father) {
    const hasChild = sonCount > 0 || daughterCount > 0
    const frac = hasChild ? 1 / 6 : remaining / total
    const amt = hasChild ? total * (1 / 6) : remaining
    results.push({ name: 'Ayah', fraction: hasChild ? '1/6' : 'sisa', amount: amt })
    remaining = hasChild ? remaining - total * (1 / 6) : 0
  }

  // Ashabah: sons and daughters (2:1 ratio)
  if (sonCount > 0 || daughterCount > 0) {
    const totalParts = sonCount * 2 + daughterCount
    const perPart = remaining / totalParts
    if (sonCount > 0) results.push({ name: `Anak Laki-laki (${sonCount}x)`, fraction: `${sonCount * 2}/${totalParts} sisa`, amount: perPart * sonCount * 2 })
    if (daughterCount > 0) results.push({ name: `Anak Perempuan (${daughterCount}x)`, fraction: `${daughterCount}/${totalParts} sisa`, amount: perPart * daughterCount })
    remaining = 0
  }

  if (remaining > 0 && heirs.sibling) {
    results.push({ name: 'Saudara', fraction: 'sisa', amount: remaining })
    remaining = 0
  }

  return results
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function CalculatorPage() {
  // Zakat state
  const [zakatType, setZakatType] = useState<ZakatType>('emas')
  const [zakatHarta, setZakatHarta] = useState('')
  const [zakatResult, setZakatResult] = useState<{ sudahNisab: boolean; jumlah: number; nisab: number } | null>(null)

  // Waris state
  const [warisTotal, setWarisTotal] = useState('')
  const [heirs, setHeirs] = useState<Heirs>({ spouse: false, sonCount: 0, daughterCount: 0, father: false, mother: false, sibling: false })
  const [warisResult, setWarisResult] = useState<{ name: string; fraction: string; amount: number }[] | null>(null)

  // Hijri state
  const [inputDate, setInputDate] = useState('')
  const [hijriResult, setHijriResult] = useState<{ day: number; month: number; year: number } | null>(null)

  const todayHijri = gregorianToHijri(new Date())

  function calcZakat() {
    const harta = parseRp(zakatHarta)
    const nisabData = NISAB[zakatType]
    const sudahNisab = harta >= nisabData.nisab
    setZakatResult({ sudahNisab, jumlah: sudahNisab ? harta * 0.025 : 0, nisab: nisabData.nisab })
  }

  function calcWarisResult() {
    const total = parseRp(warisTotal)
    if (!total) return
    setWarisResult(calcWaris(total, heirs))
  }

  function convertHijri() {
    if (!inputDate) return
    const d = new Date(inputDate)
    setHijriResult(gregorianToHijri(d))
  }

  const today = new Date()
  const upcomingEvents = ISLAMIC_EVENTS_2025_2026.map(ev => {
    const gDate = hijriToApproxGregorian(ev.hYear, ev.hMonth, ev.hDay)
    const diff = Math.ceil((gDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return { ...ev, gDate, diff }
  }).filter(ev => ev.diff > -30).sort((a, b) => a.diff - b.diff)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-stone-950 dark:via-amber-950 dark:to-stone-900 p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 dark:text-amber-100 mb-2">Kalkulator Islam</h1>
          <p className="text-amber-700 dark:text-amber-400">Zakat, Waris, dan Kalender Hijriyah</p>
        </div>

        <Tabs defaultValue="zakat">
          <TabsList className="w-full mb-6 bg-amber-100 dark:bg-amber-900/30">
            <TabsTrigger value="zakat" className="flex-1 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <Calculator className="w-4 h-4 mr-1" /> Zakat
            </TabsTrigger>
            <TabsTrigger value="waris" className="flex-1 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <Scale className="w-4 h-4 mr-1" /> Waris
            </TabsTrigger>
            <TabsTrigger value="kalender" className="flex-1 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-1" /> Kalender
            </TabsTrigger>
          </TabsList>

          {/* ─── ZAKAT ─── */}
          <TabsContent value="zakat">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="border-amber-200 dark:border-amber-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-amber-900 dark:text-amber-100">Hitung Zakat</CardTitle>
                  <CardDescription>Hitung kewajiban zakat Anda berdasarkan nisab</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1 block">Jenis Zakat</label>
                    <select
                      value={zakatType}
                      onChange={e => { setZakatType(e.target.value as ZakatType); setZakatResult(null) }}
                      className="w-full rounded-xl border border-amber-200 dark:border-amber-700 bg-white dark:bg-amber-900/20 text-amber-900 dark:text-amber-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    >
                      {(Object.keys(NISAB) as ZakatType[]).map(k => (
                        <option key={k} value={k}>{NISAB[k].label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1 block">Nilai Harta (Rp)</label>
                    <Input
                      value={zakatHarta}
                      onChange={e => setZakatHarta(e.target.value)}
                      placeholder="Masukkan nilai harta..."
                      className="border-amber-200 dark:border-amber-700 focus:ring-amber-400"
                    />
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-amber-700 dark:text-amber-400">
                      <strong>Nisab {NISAB[zakatType].label}:</strong> {NISAB[zakatType].info}
                      <br />≈ {formatRp(NISAB[zakatType].nisab)}
                    </div>
                  </div>
                  <Button onClick={calcZakat} className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                    Hitung Zakat
                  </Button>

                  {zakatResult && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                      <Card className={`border-2 ${zakatResult.sudahNisab ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-orange-400 bg-orange-50 dark:bg-orange-900/20'}`}>
                        <CardContent className="p-4 text-center">
                          <Badge className={zakatResult.sudahNisab ? 'bg-green-500 mb-2' : 'bg-orange-500 mb-2'}>
                            {zakatResult.sudahNisab ? 'Wajib Zakat' : 'Belum Wajib Zakat'}
                          </Badge>
                          {zakatResult.sudahNisab ? (
                            <>
                              <div className="text-sm text-green-700 dark:text-green-300 mb-1">Jumlah Zakat (2.5%)</div>
                              <div className="text-3xl font-bold text-green-800 dark:text-green-200">{formatRp(zakatResult.jumlah)}</div>
                            </>
                          ) : (
                            <div className="text-sm text-orange-700 dark:text-orange-300">
                              Harta belum mencapai nisab ({formatRp(zakatResult.nisab)})
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* ─── WARIS ─── */}
          <TabsContent value="waris">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="border-amber-200 dark:border-amber-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-amber-900 dark:text-amber-100">Hitung Waris (Faraidh)</CardTitle>
                  <CardDescription>Pembagian harta warisan sesuai hukum Islam</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1 block">Total Harta Warisan (Rp)</label>
                    <Input value={warisTotal} onChange={e => setWarisTotal(e.target.value)} placeholder="Masukkan total harta..." className="border-amber-200 dark:border-amber-700" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2 block">Ahli Waris yang Ditinggalkan</label>
                    <div className="space-y-2">
                      {[
                        { key: 'spouse', label: 'Suami / Istri' },
                        { key: 'father', label: 'Ayah' },
                        { key: 'mother', label: 'Ibu' },
                        { key: 'sibling', label: 'Saudara' },
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={heirs[key as keyof Heirs] as boolean}
                            onChange={e => setHeirs(h => ({ ...h, [key]: e.target.checked }))}
                            className="w-4 h-4 accent-amber-500"
                          />
                          <span className="text-sm text-amber-800 dark:text-amber-300">{label}</span>
                        </label>
                      ))}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <label className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1 block">Anak Laki-laki</label>
                          <Input type="number" min={0} value={heirs.sonCount || ''} onChange={e => setHeirs(h => ({ ...h, sonCount: Number(e.target.value) }))} className="border-amber-200 dark:border-amber-700" placeholder="0" />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1 block">Anak Perempuan</label>
                          <Input type="number" min={0} value={heirs.daughterCount || ''} onChange={e => setHeirs(h => ({ ...h, daughterCount: Number(e.target.value) }))} className="border-amber-200 dark:border-amber-700" placeholder="0" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button onClick={calcWarisResult} className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                    Hitung Pembagian
                  </Button>

                  {warisResult && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2">
                      {warisResult.map((item, i) => (
                        <div key={i} className="flex justify-between items-center bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-3">
                          <div>
                            <div className="font-medium text-amber-900 dark:text-amber-100 text-sm">{item.name}</div>
                            <Badge variant="secondary" className="text-xs mt-0.5">{item.fraction}</Badge>
                          </div>
                          <div className="font-bold text-amber-700 dark:text-amber-300">{formatRp(item.amount)}</div>
                        </div>
                      ))}
                      <div className="text-xs text-amber-600 dark:text-amber-500 bg-amber-100 dark:bg-amber-900/30 rounded-xl p-3 flex gap-2">
                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        Untuk detail lebih lanjut, konsultasikan dengan ahli faraidh atau ulama terpercaya.
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* ─── KALENDER ─── */}
          <TabsContent value="kalender">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <Card className="border-amber-200 dark:border-amber-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-amber-900 dark:text-amber-100">Konversi Kalender Hijriyah</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 text-center">
                    <div className="text-sm text-amber-600 dark:text-amber-400 mb-1">Hari ini</div>
                    <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                      {todayHijri.day} {HIJRI_MONTHS_AR[todayHijri.month - 1]} {todayHijri.year}H
                    </div>
                    <div className="text-amber-700 dark:text-amber-300 text-sm">
                      {todayHijri.day} {HIJRI_MONTHS_ID[todayHijri.month - 1]} {todayHijri.year} H
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input type="date" value={inputDate} onChange={e => setInputDate(e.target.value)} className="border-amber-200 dark:border-amber-700 flex-1" />
                    <Button onClick={convertHijri} className="bg-amber-500 hover:bg-amber-600 text-white">Konversi</Button>
                  </div>
                  {hijriResult && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="border-amber-300 bg-amber-50 dark:bg-amber-900/20">
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-1">
                            {hijriResult.day} {HIJRI_MONTHS_AR[hijriResult.month - 1]} {hijriResult.year}H
                          </div>
                          <div className="text-amber-700 dark:text-amber-300">
                            {hijriResult.day} {HIJRI_MONTHS_ID[hijriResult.month - 1]} {hijriResult.year} Hijriyah
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-amber-200 dark:border-amber-800 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-amber-900 dark:text-amber-100 text-base">Hari-hari Islam Mendatang</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {upcomingEvents.map((ev, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-amber-100 dark:border-amber-800 last:border-0">
                      <div>
                        <div className="font-medium text-amber-900 dark:text-amber-100 text-sm">{ev.name}</div>
                        <div className="text-xs text-amber-600 dark:text-amber-400">
                          ~{ev.gDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      </div>
                      <Badge className={ev.diff <= 0 ? 'bg-green-500' : ev.diff <= 30 ? 'bg-amber-500' : 'bg-slate-400'}>
                        {ev.diff <= 0 ? 'Hari ini / Lalu' : `${ev.diff} hari lagi`}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
