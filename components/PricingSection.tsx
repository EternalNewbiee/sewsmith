import React from 'react'
import { CheckIcon } from '@heroicons/react/20/solid'


const tiers = [
  {
    name: 'Home Tailor',
    id: 'tier-home-tailor',
    href: '#',
    priceMonthly: '$19',
    description: 'Perfect for the individual tailor managing personal client requests from home.',
    features: [
      'Manage up to 50 client orders',
      'Basic client management system',
      'Basic analytics for order tracking',
      'Email support with 72-hour response time',
    ],
    mostPopular: false,
  },
  {
    name: 'Local Boutique',
    id: 'tier-local-boutique',
    href: '#',
    priceMonthly: '$49',
    description: 'Ideal for growing tailoring shops needing more robust client and order management.',
    features: [
      'Manage up to 200 client orders',
      'Enhanced client management system',
      'Intermediate analytics with order and client insights',
      'Email and phone support with 24-hour response time',
      'SMS notifications for client updates',
    ],
    mostPopular: true,
  },
  {
    name: 'Tailoring Chain',
    id: 'tier-tailoring-chain',
    href: '#',
    priceMonthly: '$99',
    description: 'Comprehensive solutions for high-volume tailoring enterprises with multiple locations.',
    features: [
      'Manage unlimited client orders',
      'Advanced client management platform',
      'Detailed analytics dashboard with business insights',
      'Priority support with 1-hour response time',
      'Marketing automation tools',
      'Multi-location management support',
    ],
    mostPopular: false,
  },
]


function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const PricingSection = () => {
  return (
    <div className="py-24 sm:pt-48">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Pricing plans for businesses of&nbsp;all&nbsp;sizes
            </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
            Distinctio et nulla eum soluta et neque labore quibusdam. Saepe et quasi iusto modi velit ut non voluptas
            in. Explicabo id ut laborum.
        </p>
        <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {tiers.map((tier, tierIdx) => (
            <div
                key={tier.id}
                className={classNames(
                tier.mostPopular ? 'lg:z-10 lg:rounded-b-none' : 'lg:mt-8',
                tierIdx === 0 ? 'lg:rounded-r-none' : '',
                tierIdx === tiers.length - 1 ? 'lg:rounded-l-none' : '',
                'flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10'
                )}
            >
                <div>
                <div className="flex items-center justify-between gap-x-4">
                    <h3
                    id={tier.id}
                    className={classNames(
                        tier.mostPopular ? 'text-indigo-600' : 'text-gray-900',
                        'text-lg font-semibold leading-8'
                    )}
                    >
                    {tier.name}
                    </h3>
                    {tier.mostPopular ? (
                    <p className="rounded-full bg-indigo-600/10 px-2.5 py-1 text-xs font-semibold leading-5 text-indigo-600">
                        Most popular
                    </p>
                    ) : null}
                </div>
                <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.priceMonthly}</span>
                    <span className="text-sm font-semibold leading-6 text-gray-600">/month</span>
                </p>
                <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
                    {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                        <CheckIcon className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                        {feature}
                    </li>
                    ))}
                </ul>
                </div>
                <a
                href={tier.href}
                aria-describedby={tier.id}
                className={classNames(
                    tier.mostPopular
                    ? 'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'
                    : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300',
                    'mt-8 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                )}
                >
                Buy plan
                </a>
            </div>
            ))}
        </div>
        </div>
    </div>
  )
}

export default PricingSection
