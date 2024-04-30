import React from 'react';

type FabricCardProps = {
  imageSrc: string;
  altText: string;
  title: string;
  price: number;
  onClick?: () => void; // Make onClick optional
};


const FabricCard: React.FC<FabricCardProps> = ({ imageSrc, altText, title, price, onClick }) => {
  return (
    <div className="product-card cursor bg-gray-200 h-250 w-[290px] border rounded-lg cursor-pointer border-gray-400 relative" onClick={onClick}>
      <div className="image-container h-4/5 w-full rounded-t-lg overflow-hidden">
        <img src={imageSrc} alt={altText} className="w-full h-full object-cover rounded-lg" />
      </div>
      <div className="details-container h-[57px] w-full bg-white rounded-b-lg p-2 flex justify-between">
        <div className='flex flex-col'>
          <h4>{title}</h4>
          <h2>${price}</h2>
        </div>
      </div>
    </div>
  );
};

export default FabricCard;
