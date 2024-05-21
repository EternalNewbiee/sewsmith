import React from 'react'

export default async function OrderTable() {
  return (
    <div className = "px-4 sm:px-6 lg:px-8">
        <div className = "sm:flex sm:items-center">
            <div className = "sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">Orders</h1>
            <p className="mt-2 text-sm text-gray-700">
                A list of all the orders that came in, New Orders, Preparing, and Ready for Delivery 
            </p>
            </div>
        </div>
    </div>
  )
}

