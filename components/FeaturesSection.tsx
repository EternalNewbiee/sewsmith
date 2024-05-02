import React from 'react'
import { Fragment } from 'react'
import { Tab } from '@headlessui/react'

const features = [
  { name: 'Origin', description: 'Conceived and crafted by SewSmith Designers.' },
  { name: 'Material', description: '100% organic cotton, ethically sourced.' },
  { name: 'Sizes', description: 'Available in XS, S, M, L, XL, XXL.' },
  { name: 'Fit', description: 'Available in slim, regular, and relaxed fits to suit every body type.' },
  { name: 'Care', description: 'Machine wash cold, tumble dry low. Iron on low heat. Avoid bleach.' },
  { name: 'Customization', description: 'Custom fits and designs available upon request.' },
]

const FeaturesSection = () => {
  return (
    <div className="bg-white">
    <div aria-hidden="true" className="relative">
      <img
        src="https://tailwindui.com/img/ecommerce-images/product-feature-02-full-width.jpg"
        alt=""
        className="h-96 w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white" />
    </div>

    <div className="relative mx-auto -mt-12 max-w-7xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
      <div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">SewSmith Shirt Features</h2>
        <p className="mt-4 text-gray-500">
            SewSmith shirts blend impeccable craftsmanship with environmental consciousness. Each shirt is designed for comfort, style, and sustainability.
          </p>
      
      </div>

      <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-16 lg:max-w-none lg:grid-cols-3 lg:gap-x-8">
        {features.map((feature) => (
          <div key={feature.name} className="border-t border-gray-200 pt-4">
            <dt className="font-medium text-gray-900">{feature.name}</dt>
            <dd className="mt-2 text-sm text-gray-500">{feature.description}</dd>
          </div>
        ))}
      </dl>
    </div>
  </div>
  )
}
export default FeaturesSection
