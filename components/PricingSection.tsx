import React from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';

const tiers = [
  {
    name: 'Individual Tailor',
    id: 'tier-individual-tailor',
    href: '#',
    priceMonthly: '$19',
    description: 'Perfect for individual tailors or small workshops focused on custom-tailored shirts.',
    features: [
      'Manage up to 50 custom orders',
      'Client measurement and preference tracking',
      'Basic analytics for order fulfillment',
      'Email support with 72-hour response time',
    ],
    mostPopular: false,
  },
  {
    name: 'Tailoring Studio',
    id: 'tier-tailoring-studio',
    href: '#',
    priceMonthly: '$49',
    description: 'Ideal for established studios that require advanced order and client management.',
    features: [
      'Manage up to 200 custom orders',
      'Enhanced client management system',
      'Advanced fabric and style customization options',
      'Email and phone support with 24-hour response time',
      'SMS notifications for client updates',
    ],
    mostPopular: true,
  },
  {
    name: 'Tailoring Enterprise',
    id: 'tier-tailoring-enterprise',
    href: '#',
    priceMonthly: '$99',
    description: 'Comprehensive solution for large-scale operations with multiple tailors and high volume orders.',
    features: [
      'Unlimited custom orders management',
      'Advanced client management platform',
      'Real-time analytics dashboard for business insights',
      'Priority support with 1-hour response time',
      'Automated client follow-ups and marketing tools',
      'Multi-location management support',
    ],
    mostPopular: false,
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const PricingSection = () => {
  return (
    <div className="py-24 sm:pt-48">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Pricing</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Tailored plans for every size of tailoring business
            </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
            Whether you're starting out or managing a large tailor shop, our plans scale with your needs.
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
                Subscribe
                </a>
            </div>
            ))}
        </div>
        </div>
    </div>
  )
}

export default PricingSection;
