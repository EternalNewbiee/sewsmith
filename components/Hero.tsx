import React from 'react'

export default function Example() {
  

  return (
    <div className="relative min-h-screen md:flex md:flex-row">
    <div className="flex-1 relative bg-no-repeat bg-center bg-cover"
         style={{ backgroundImage: "url('/img/white-bg.png')" }}>
      <div className="absolute inset-0 bg-white opacity-70"></div>
    </div>
    <div className="flex-1 relative bg-no-repeat bg-center bg-cover"
         style={{ backgroundImage: "url('/img/blue-bg.jpg')" }}>
      <div className="absolute inset-0 bg-[#005DC5] opacity-50"></div>
    </div>
  
  
      {/* SewSmith Logo 
      <div className="absolute top-0 left-0 mt-6 ml-6 text-4xl font-jomhuria text-[#005DC5] z-10">
        SewSmith
      </div> */}

   { /* <nav className="absolute top-5 left-1/2 transform -translate-x-1/2 w-auto flex justify-center items-center z-20 bg-gray-700 bg-opacity-50 px-4 py-2 rounded-lg">
        <div className="flex space-x-6">
          <a href="/" className="text-base font-semibold text-white hover:text-blue-500">
            Home
          </a>
          <a href="/shop" className="text-base font-semibold text-white hover:text-blue-500">
            Shop
          </a>
          <a href="/about" className="text-base font-semibold text-white hover:text-blue-500">
            About
          </a>
        </div>
      </nav> */}

  <div className="absolute w-full top-1/4 md:top-1/10 flex justify-center items-center z-0">
    <h1 className="text-9xl md:text-9xxl font-bold"> 
    <span className="text-black">Style </span>
          <span className="text-white">
            <span className="text-black">C</span>rafted
          </span>
    </h1>
  </div>


  
      <div className="absolute w-full top-15 right-0 bottom-0 flex justify-center items-center z-10">
        <img src="/img/Woman.png" alt="Woman" className="h-auto max-w-sm" />
      </div>

       <div className="absolute inset-12 md:flex md:justify-end">
        <div className="flex-1 flex justify-start px-6 lg:px-5 z-10">
          <div className="max-w-md text-left">
            <p className="mt-60 text-lg leading-6 text-gray-700 font-lexend"> 
              At SewSmith, customize your fabric design and watch it come to life!
              Choose from our fabric selection and submit your design—our skilled
              artisans will handle the rest. Join our community for workshops and events,
              and let SewSmith turn your fabric dreams into reality, effortlessly.
            </p>
          
            <div className="mt-10 flex items-center justify-center md:justify-start gap-x-6">
              <a href="/order" className="rounded-md bg-blue-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#005DC5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Order Now
              </a>
              <a href="/order_history" className="rounded-md bg-gray-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                View Order
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
