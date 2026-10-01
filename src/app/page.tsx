'use client'

import { useState } from 'react'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { Loader } from '@/components/layout/Loader'
import { Cursor } from '@/components/layout/Cursor'
import { ScrollProgress } from '@/components/layout/ScrollProgress'
import { Nav } from '@/components/layout/Nav'
import { Hero } from '@/components/sections/Hero'
import { RolesMarquee } from '@/components/sections/RolesMarquee'
import { Manifesto } from '@/components/sections/Manifesto'
import { Features } from '@/components/sections/Features'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { WhoItsFor } from '@/components/sections/WhoItsFor'
import { LiveInterview } from '@/components/sections/LiveInterview'
import { Numbers } from '@/components/sections/Numbers'
import { Moments } from '@/components/sections/Moments'
import { ResumeReview } from '@/components/sections/ResumeReview'
import { Faq } from '@/components/sections/Faq'
import { FinalCta } from '@/components/sections/FinalCta'
import { Footer } from '@/components/layout/Footer'

export default function Home() {
  // Flips to true when the preloader finishes; the hero intro and scrolling wait for it
  const [ready, setReady] = useState(false)

  return (
    <SmoothScroll paused={!ready}>
      <Loader onDone={() => setReady(true)} />
      <Cursor />
      <ScrollProgress />
      <Nav ready={ready} />

      {/* Sections are listed top to bottom, so their ScrollTriggers are created (and refreshed) in page order */}
      <main id="top">
        <Hero ready={ready} />
        <RolesMarquee />
        <Manifesto />
        <Features />
        <HowItWorks />
        <WhoItsFor />
        <LiveInterview />
        <Numbers />
        <Moments />
        <ResumeReview />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
