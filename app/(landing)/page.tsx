"use client"
import { useState } from 'react'
import { Dialog } from '@headlessui/react'

import Hero from '@/components/Hero'
import LogoCloud from '@/components/LogoCloud'
import FeaturesSection from '@/components/FeaturesSection'
import TestimonialSection from '@/components/TestimonialSection'
import PricingSection from '@/components/PricingSection'
import FAQSection from '@/components/FAQSection'
import Footer from '@/components/Footer'
import LandingHeader from '@/components/LandingHeader'



export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-white">
      
      <LandingHeader />

      <main className="isolate">
        <Hero />

        {/* Feature section */}
        <FeaturesSection />

        {/* Pricing section */}
        <PricingSection />

        {/* CTA section */}
        
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
