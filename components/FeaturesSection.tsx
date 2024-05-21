import React from 'react';

const features = [
  { 
    title: "Custom Designs", 
    description: "Tailor your fabric to your unique vision with our custom design services.", 
    icon:"/img/sewing.png" 
  },
  { 
    title: "High-Quality Materials", 
    description: "We use only the finest materials to ensure your creations stand the test of time.", 
    icon: "/img/high-quality.png" 
  
  },
  { 
    title: "Fast Turnaround", 
    description: "Get your custom fabric quickly with our efficient production process.", 
    icon: "/img/flash-sale.png"  
  },
  { 
    title: "Expert Craftsmanship", 
    description: "Our skilled artisans bring your fabric designs to life with precision and care.", 
    icon:  "/img/leader.png"
  },
  { 
    title: "Sustainable Practices", 
    description: "We prioritize eco-friendly methods to reduce our environmental impact.", 
    icon: "/img/brain.png" 
  },
  { 
    title: "Customer Support", 
    description: "Our team is here to help you with any questions or concerns you may have.", 
    icon: "/img/help-desk.png" 
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto text-center p-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Discover SewSmith Features</h2>
        <p className="mt-4 text-lg text-gray-600">Everything you need to bring your fabric designs to life</p>
        <div className="mt-10 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 gap-x-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center">
              <img src={feature.icon} alt={feature.title} className="h-12 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-base text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeaturesSection;
