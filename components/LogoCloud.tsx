import React from 'react';

const services = [
  { name: "Express Delivery", tagline: "Your Orders Delivered Fast", image: "/img/express-delivery.png" },
  { name: "Secure Shield", tagline: "Guaranteed Protection for Your Orders", image: "/img/shield.png" },
  { name: "Quality Assurance", tagline: "Excellence You Can Trust", image: "/img/guarantee.png" },
  { name: "Rapid Sewing Service", tagline: "High-Quality Sewing in Record Time", image: "/img/fast.png" },
];

const LogoCloud: React.FC = () => {
  return (
    <div className="bg-white py-8">
      <div className="container mx-auto p-8">
        <div className="flex justify-between items-center">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col items-center mx-4">
              <img src={service.image} alt={service.name} className="h-12 mb-2" />
              <span className="text-gray-800 font-medium">{service.name}</span>
              <span className="text-gray-600 text-sm">{service.tagline}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 text-center">
        <p className="text-gray-600">
          SewSmith is about sewing fabric in the style you like.{" "}
           <a href="#" className="font-semibold text-indigo-600">
                <span className="absolute inset-0" aria-hidden="true" /> Read our case study{' '}
                <span aria-hidden="true">&rarr;</span>
              </a>
        </p>
      </div>
    </div>
  );
};

export default LogoCloud;