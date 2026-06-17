'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, RefreshCw, BookOpen, Heart, Bell, Target } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  time: string
}

const suggestions = [
  { icon: Heart, text: 'Berikan motivasi hijrah untuk hari ini', color: 'text-rose-500' },
  { icon: BookOpen, text: 'Hadits tentang keutamaan wanita shalihah', color: 'text-teal-600' },
  { icon: Bell, text: 'Ingatkan saya ibadah sunnah apa yang bisa dilakukan', color: 'text-amber-500' },
  { icon: Target, text: 'Bantu saya buat target hijrah bulan ini', color: 'text-purple-500' },
]

const initialMessages: Message[] = [
  {
    id: 1,
    role: 'assistant',
    content: 'Assalamu\'alaikum warahmatullahi wabarakatuh! 🌙\n\nSaya adalah AI Muslimah Companion kamu. Saya siap membantu perjalanan hijrah kamu dengan:\n\n✨ Motivasi islami harian\n📿 Pengingat dan saran ibadah\n📖 Jawaban pertanyaan keislaman\n🎯 Membantu membuat target hijrah\n💬 Teman curhat yang memahami perjalanan Muslimah\n\nAda yang bisa saya bantu hari ini?',
    time: 'Sekarang',
  },
]

const aiResponses: Record<string, string> = {
  default: `Alhamdulillah, terima kasih sudah berbagi! 🌸

Ingatlah bahwa setiap langkah kecil menuju kebaikan adalah ibadah yang dicatat Allah.

"وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا يَرَهُ"
"Dan barangsiapa yang mengerjakan kebaikan seberat zarrah pun, niscaya dia akan melihat (balasan)nya." — QS. Al-Zalzalah: 7

Teruslah istiqomah ya ukhti! 💚`,
  motivasi: `Subhanallah, masyaAllah! 🌟

Motivasi hijrah hari ini untukmu:

"إِنَّ مَعَ الْعُسْرِ يُسْرًا"
"Sesungguhnya bersama kesulitan ada kemudahan." — QS. Al-Insyirah: 6

Ukhti, hijrah bukan tentang menjadi sempurna dalam semalam. Setiap hari yang kamu jalani dengan niat ikhlas karena Allah adalah hijrah yang sesungguhnya.

Tips hari ini:
🕌 Mulai dengan shalat Subuh tepat waktu
📖 Baca minimal 1 halaman Al-Quran
🤲 Dzikir pagi sebelum memulai aktivitas
💝 Sedekah minimal satu senyuman

Kamu tidak sendirian dalam perjalanan ini. Allah bersama orang-orang yang sabar dan istiqomah 💚`,
  hadits: `Bismillahirrahmanirrahim 📖

Hadits tentang keutamaan wanita shalihah:

"الدُّنْيَا مَتَاعٌ، وَخَيْرُ مَتَاعِ الدُّنْيَا الْمَرْأَةُ الصَّالِحَةُ"

"Dunia adalah perhiasan, dan sebaik-baik perhiasan dunia adalah wanita shalihah." — HR. Muslim

Makna hadits ini mengajarkan kita bahwa:
✨ Wanita shalihah adalah anugerah terbesar
💚 Keshalihahan adalah nilai tertinggi seorang wanita
🌸 Menjadi shalihah adalah tujuan mulia yang worth diperjuangkan

Teruslah berusaha menjadi wanita shalihah ya ukhti! 🤲`,
}

export default function AICompanionPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText) return

    const userMessage: Message = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      time: 'Sekarang',
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    await new Promise(r => setTimeout(r, 1500))

    let responseText = aiResponses.default
    if (messageText.toLowerCase().includes('motivasi')) responseText = aiResponses.motivasi
    else if (messageText.toLowerCase().includes('hadits')) responseText = aiResponses.hadits

    const aiMessage: Message = {
      id: Date.now() + 1,
      role: 'assistant',
      content: responseText,
      time: 'Sekarang',
    }

    setMessages(prev => [...prev, aiMessage])
    setIsTyping(false)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-3xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 pb-4 border-b border-border mb-4 shrink-0"
      >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-foreground">AI Muslimah Companion</h1>
            <Badge variant="default" className="text-xs bg-green-500/90">● Online</Badge>
          </div>
          <p className="text-sm text-muted-foreground">Teman hijrah AI yang memahami perjalananmu</p>
        </div>
        <button className="ml-auto w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw className="w-4 h-4" />
        </button>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn('flex gap-3', message.role === 'user' && 'flex-row-reverse')}
            >
              <Avatar className="w-9 h-9 shrink-0 mt-1">
                <AvatarFallback className={cn(
                  'text-white text-xs font-bold',
                  message.role === 'assistant'
                    ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                    : 'bg-gradient-to-br from-teal-400 to-emerald-600'
                )}>
                  {message.role === 'assistant' ? '✨' : 'AN'}
                </AvatarFallback>
              </Avatar>

              <div className={cn('max-w-[80%]', message.role === 'user' && 'items-end flex flex-col')}>
                <div className={cn(
                  'rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line',
                  message.role === 'assistant'
                    ? 'bg-card border border-border text-foreground rounded-tl-sm'
                    : 'bg-teal-600 text-white rounded-tr-sm'
                )}>
                  {message.content}
                </div>
                <span className="text-xs text-muted-foreground mt-1 px-1">{message.time}</span>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
              <Avatar className="w-9 h-9 shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-xs">✨</AvatarFallback>
              </Avatar>
              <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1.5 items-center h-4">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-muted-foreground"
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      <div className="shrink-0 pb-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {suggestions.map(({ icon: Icon, text, color }) => (
            <button
              key={text}
              onClick={() => sendMessage(text)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted hover:bg-teal-50 dark:hover:bg-teal-950/20 border border-transparent hover:border-teal-200 text-xs text-muted-foreground hover:text-teal-700 whitespace-nowrap transition-all shrink-0"
            >
              <Icon className={`w-3.5 h-3.5 ${color}`} />
              {text}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Tanya atau curhat apapun..."
            className="flex-1 h-11 px-4 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all"
          />
          <Button onClick={() => sendMessage()} disabled={!input.trim() || isTyping} size="icon" className="w-11 h-11 shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
