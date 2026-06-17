import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { DailyBoostSection } from '@/components/landing/daily-boost-section'
import { TrackerPreviewSection } from '@/components/landing/tracker-preview-section'
import { CommunitySection } from '@/components/landing/community-section'
import { GamificationSection } from '@/components/landing/gamification-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { CTASection } from '@/components/landing/cta-section'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DailyBoostSection />
      <TrackerPreviewSection />
      <CommunitySection />
      <GamificationSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
