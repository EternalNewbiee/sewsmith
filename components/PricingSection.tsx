import React from 'react';

const fabrics = [
  { 
    name: "Silk", 
    image: "/img/silk.jpg", 
    rating: 5 
  },
  { 
    name: "Cotton", 
    image: "/img/cotton.jpg", 
    rating: 4 
  },
  { 
    name: "Linen", 
    image: "/img/linen.jpg", 
    rating: 4 
  },
  { 
    name: "Wool", 
    image: "/img/wool.jpg", 
    rating: 5 
  },
  { 
    name: "Denim", 
    image: "/img/denim.jpg", 
    rating: 3 
  },
  { 
    name: "Velvet", 
    image: "/img/velvet.jpg", 
    rating: 5 
  },
];

const PricingSection: React.FC = () => {
  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto text-center p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Our Fabrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {fabrics.map((fabric, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-lg relative">
              <div className="relative overflow-hidden rounded-lg" style={{ height: '12rem' }}>
                <img 
                  src={fabric.image} 
                  alt={fabric.name} 
                  className="w-full h-full object-cover transform transition-transform duration-300 ease-in-out hover:scale-110 cursor-pointer" 
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mt-4">{fabric.name}</h3>
            
              <div className="flex justify-center mt-2">
                {Array(5).fill(0).map((_, starIndex) => (
                  <svg 
                    key={starIndex} 
                    className={`h-5 w-5 ${starIndex < fabric.rating ? 'text-yellow-500' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.09 2.64 1.27-5.54-4.42-3.84 5.77-.5L10 2l2.47 5.76 5.77.5-4.42 3.84 1.27 5.54L10 15z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PricingSection;
