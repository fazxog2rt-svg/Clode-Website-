import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Muslimah Journey - Berhijrah Tidak Harus Sendiri',
    template: '%s | Muslimah Journey',
  },
  description: 'Platform islami premium untuk Muslimah yang ingin berhijrah, menambah ilmu, membangun kebiasaan baik, dan terhubung dengan komunitas Muslimah yang supportif.',
  keywords: ['muslimah', 'hijrah', 'islam', 'quran', 'dzikir', 'komunitas muslimah', 'belajar islam'],
  authors: [{ name: 'Muslimah Journey' }],
  creator: 'Muslimah Journey',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://muslimahjourneyplatform.com',
    title: 'Muslimah Journey - Berhijrah Tidak Harus Sendiri',
    description: 'Platform islami premium untuk Muslimah yang ingin berhijrah, menambah ilmu, membangun kebiasaan baik.',
    siteName: 'Muslimah Journey',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muslimah Journey',
    description: 'Platform islami premium untuk Muslimah',
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0F766E' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange={false}
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
