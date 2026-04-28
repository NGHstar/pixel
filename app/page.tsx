'use client'

import CanvasDemo from '@/components/home/CanvasDemo'
import HeroSection from '@/components/home/HeroSection'
import InteractiveStats from '@/components/home/InterActiveStats'
import PlansSection from '@/components/home/PlansSection'
import Features from '@/components/home/Features'

export default function Page() {
  // ---
  return (
    <main className="dark:bg-slate-900 text-foreground min-h-screen overflow-x-hidden">
      <HeroSection />
      <CanvasDemo />
      <InteractiveStats />
      <Features />
      <PlansSection />
    </main>
  )
}
