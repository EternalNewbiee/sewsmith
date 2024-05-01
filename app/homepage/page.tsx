"use client"
import { useState } from 'react'
import { Dialog } from '@headlessui/react'

import UserHeader from '@/components/UserHeader'
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'



export default function Homepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-white">
    {/* User header */}
    <UserHeader />

    {/* Main content */}
    <main className="isolate">
      <Hero />
    </main>

    {/* Footer */}
    <Footer />
  </div>
);
}
